import pandas as pd
import io
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.feature_metadata import FeatureMetadata
from app.config.db_config import DatabaseConfig
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError

class ImportService:
    def __init__(self, db: Session):
        self.db = db
        self.engine: Engine = DatabaseConfig.get_engine()

    # Adicione este método na classe ImportService (import_service.py)

    async def processar_dados_historicos(self, file, file_extension: str):
        """
        Processa e importa dados históricos de vendas.
        Aceita tanto formato wide (colunas de datas) quanto formato long (normalizado).
        """
        df = await self._read_file_raw(file, file_extension)

        formato = self._detectar_formato_planilha(df)
        
        if formato == 'wide':
            df = self._transformar_wide_to_long(df)
        elif formato == 'long':
            df = self._normalizar_formato_long(df)
        else:
            raise ValueError("Formato de planilha não reconhecido. Use formato wide (colunas de datas) ou long (periodo, cdproduto, valor)")
        
        required_cols = ['periodo', 'cdproduto', 'cdlinha', 'cdprocesso', 'valor']
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            raise ValueError(f"Colunas obrigatórias faltando após transformação: {', '.join(missing_cols)}")
        
        df['periodo'] = pd.to_datetime(df['periodo'])
        df['valor'] = pd.to_numeric(df['valor'], errors='coerce')
        
        # Remove linhas com valores inválidos
        df = df.dropna(subset=['periodo', 'cdproduto', 'valor'])
        
        if df.empty:
            raise ValueError("Nenhum dado válido encontrado no arquivo")
        
        # 5. Renomeia cdlinha para cdfamilia (padrão do banco)
        df = df.rename(columns={'cdlinha': 'cdfamilia'})
        
        # 6. Seleciona apenas as colunas necessárias
        df = df[['periodo', 'cdproduto', 'cdfamilia', 'cdprocesso', 'valor']]
        
        # 7. Busca dados existentes para fazer merge inteligente (AGORA COM VALOR)
        existing_query = text("""
            SELECT periodo, cdproduto, cdfamilia, cdprocesso, valor 
            FROM tbdadosbruto
        """)
        existing_df = pd.read_sql(existing_query, self.engine)
        existing_df['periodo'] = pd.to_datetime(existing_df['periodo'])
        
        # Substitua as linhas 64-96 por:
        merge_cols = ['periodo', 'cdproduto', 'cdfamilia', 'cdprocesso']

        # Cria cópias para não afetar os DataFrames originais
        df_compare = df.copy()
        existing_compare = existing_df.copy()

        # Normaliza tipos para comparação
        df_compare['cdproduto'] = df_compare['cdproduto'].astype(str).str.strip()
        df_compare['cdfamilia'] = df_compare['cdfamilia'].astype(str).str.strip()
        df_compare['cdprocesso'] = df_compare['cdprocesso'].astype(str).str.strip()
        df_compare['periodo_str'] = pd.to_datetime(df_compare['periodo']).dt.strftime('%Y-%m-%d')

        existing_compare['cdproduto'] = existing_compare['cdproduto'].astype(str).str.strip()
        existing_compare['cdfamilia'] = existing_compare['cdfamilia'].astype(str).str.strip()
        existing_compare['cdprocesso'] = existing_compare['cdprocesso'].astype(str).str.strip()
        existing_compare['periodo_str'] = pd.to_datetime(existing_compare['periodo']).dt.strftime('%Y-%m-%d')
        

        # Cria chave única para comparação
        merge_cols_compare = ['periodo_str', 'cdproduto', 'cdfamilia', 'cdprocesso']
        df_compare['_key'] = df_compare[merge_cols_compare].agg('|'.join, axis=1)
        existing_compare['_key'] = existing_compare[merge_cols_compare].agg('|'.join, axis=1)

        # Separa registros novos (chave não existe no banco)
        new_keys = df_compare[~df_compare['_key'].isin(existing_compare['_key'])].index
        new_records = df.loc[new_keys].copy()

        # Para registros existentes, verifica se o VALOR mudou
        existing_keys = df_compare[df_compare['_key'].isin(existing_compare['_key'])].index
        existing_records = df.loc[existing_keys].copy()

        if not existing_records.empty:
            # Adiciona a chave aos registros existentes para merge
            existing_records['_key'] = df_compare.loc[existing_keys, '_key'].values
            
            # Faz merge para comparar valores
            existing_records = existing_records.merge(
                existing_compare[['_key', 'valor']],
                on='_key',
                suffixes=('_new', '_old')
            )
            
            # Filtra apenas registros onde o valor realmente mudou
            update_records = existing_records[
                existing_records['valor_new'] != existing_records['valor_old']
            ][['periodo', 'cdproduto', 'cdfamilia', 'cdprocesso', 'valor_new']].rename(
                columns={'valor_new': 'valor'}
            )
        else:
            update_records = pd.DataFrame()
        
        # 9. Insere novos registros
        inserted = 0
        updated = 0
        skipped = len(df) - len(new_records) - len(update_records)
        
        if not new_records.empty:
            try:
                with self.engine.begin() as conn:
                    new_records.to_sql('tbdadosbruto', con=conn, if_exists='append', index=False)
                    inserted = len(new_records)
            except Exception as e:
                raise RuntimeError(f"Erro ao inserir novos registros: {e}")
        
        # 10. Atualiza registros existentes (apenas os que mudaram)
        if not update_records.empty:
            try:
                with self.engine.begin() as conn:
                    for _, row in update_records.iterrows():
                        update_query = text("""
                            UPDATE tbdadosbruto 
                            SET valor = :valor
                            WHERE periodo = :periodo 
                            AND cdproduto = :cdproduto 
                            AND cdfamilia = :cdfamilia 
                            AND cdprocesso = :cdprocesso
                        """)
                        conn.execute(update_query, {
                            'valor': row['valor'],
                            'periodo': row['periodo'],
                            'cdproduto': row['cdproduto'],
                            'cdfamilia': row['cdfamilia'],
                            'cdprocesso': row['cdprocesso']
                        })
                    updated = len(update_records)
            except Exception as e:
                raise RuntimeError(f"Erro ao atualizar registros: {e}")
        
        # 11. Estatísticas
        produtos_unicos = df['cdproduto'].nunique()
        periodo_min = df['periodo'].min()
        periodo_max = df['periodo'].max()
        
        return {
            "message": "Dados históricos importados com sucesso",
            "formato_detectado": formato,
            "inserted": inserted,
            "updated": updated,
            "skipped": skipped,  # Registros que já existiam e não mudaram
            "total_rows": len(df),
            "unique_products": produtos_unicos,
            "date_range": {
                "start": str(periodo_min.date()) if hasattr(periodo_min, 'date') else str(periodo_min)[:10],
                "end": str(periodo_max.date()) if hasattr(periodo_max, 'date') else str(periodo_max)[:10]
            },
            "summary": {
                "new_products": new_records['cdproduto'].nunique() if not new_records.empty else 0,
                "updated_products": update_records['cdproduto'].nunique() if not update_records.empty else 0
            }
        }

    
    async def processar_features(
        self,
        file,
        feature_name: str,
        file_extension: str,
    ):
    
        df = await self._read_file(file, file_extension)
        
        # 3. Normaliza o nome da tabela
        table_name = self._normalize_feature_table_name(feature_name)

        if 'date' not in df.columns:
            raise ValueError("Coluna 'date' obrigatória não encontrada no arquivo.")
        
        try:
            with self.engine.begin() as conn:
                df.to_sql(table_name, con=conn, if_exists="replace", index=False)
        except SQLAlchemyError as e:
            raise RuntimeError(f"Erro ao gravar tabela {table_name}: {e}")

        # Registra/atualiza metadados via sessão ORM
        session_provided = isinstance(self.db, Session)
        if session_provided:
            session = self.db
            close_after = False
        else:
            # usa context manager centralizado
            session_ctx = DatabaseConfig.get_db_session()
            session = session_ctx.__enter__()  # contextmanager enter
            close_after = True

        try:
            existing: FeatureMetadata = session.query(FeatureMetadata).filter_by(table_name=table_name).first()
            version = 1 if not existing else (existing.version + 1)

            metadata = FeatureMetadata(
                feature_name=feature_name,
                table_name=table_name,
                version=version,
                row_count=int(len(df)),
                columns=list(df.columns),
                date_range_start=pd.to_datetime(df['date'].min()).date(),
                date_range_end=pd.to_datetime(df['date'].max()).date(),
                uploaded_at=datetime.utcnow()
            )

            if existing:
                # atualiza somente campos relevantes
                existing.feature_name = metadata.feature_name
                existing.version = metadata.version
                existing.row_count = metadata.row_count
                existing.columns = metadata.columns
                existing.date_range_start = metadata.date_range_start
                existing.date_range_end = metadata.date_range_end
                existing.uploaded_at = metadata.uploaded_at
                session.add(existing)
            else:
                session.add(metadata)

            session.commit()
        except Exception as e:
            session.rollback()
            raise
        finally:
            if close_after:
                session_ctx.__exit__(None, None, None)

        return {
            "message": f"Feature '{feature_name}' importada com sucesso.",
            "table_name": table_name,
            "version": version,
            "rows": int(len(df)),
            "columns": list(df.columns),
            "date_range": {
                "start": str(df['date'].min()),
                "end": str(df['date'].max())
            }
        }
    
    async def _read_file(self, file, extension: str) -> pd.DataFrame:
        """Lê arquivo CSV ou XLSX (UploadFile async)."""
        contents = await file.read()

        if extension == ".csv":
            df = pd.read_csv(io.BytesIO(contents))
        elif extension in [".xlsx", ".xls"]:
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise ValueError(f"Extensão não suportada: {extension}")

        # Normaliza nomes de colunas
        df.columns = df.columns.str.lower().str.strip()

        # Converte coluna de data
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
        else:
            # Se chave de data tiver outro nome comum, tenta mapear (opcional)
            for candidate in ['data', 'ds']:
                if candidate in df.columns:
                    df.rename(columns={candidate: 'date'}, inplace=True)
                    df['date'] = pd.to_datetime(df['date'])
                    break

        return df

    def _normalize_feature_table_name(self, feature_name: str) -> str:
        """Normaliza nome da tabela."""
        normalized = feature_name.lower().strip().replace(" ", "_").replace("-", "_")
        normalized = ''.join(c for c in normalized if c.isalnum() or c == '_')
        return f"tbfeatures_{normalized}"

    def list_features(self):
        """Retorna lista de features registradas no metadata."""
        # usa sessão temporária se self.db não estiver presente
        session_provided = isinstance(self.db, Session)
        if session_provided:
            session = self.db
            close_after = False
        else:
            session_ctx = DatabaseConfig.get_db_session()
            session = session_ctx.__enter__()
            close_after = True

        try:
            rows = session.query(FeatureMetadata).order_by(FeatureMetadata.feature_name).all()
            result = []
            for r in rows:
                result.append({
                    "feature_name": r.feature_name,
                    "table_name": r.table_name,
                    "version": r.version,
                    "rows": r.row_count,
                    "columns": r.columns,
                    "date_range_start": str(r.date_range_start),
                    "date_range_end": str(r.date_range_end),
                    "uploaded_at": str(r.uploaded_at)
                })
            return result
        finally:
            if close_after:
                session_ctx.__exit__(None, None, None)

    def _detectar_formato_planilha(self, df):
        """Detecta se a planilha está em formato wide ou long."""
        colunas_lower = [str(col).lower() for col in df.columns]
        
        # Verifica se tem as colunas do formato long
        has_periodo = any('periodo' in col or 'data' in col for col in colunas_lower)
        has_valor = any('valor' in col or 'quantidade' in col for col in colunas_lower)
        has_produto = any('produto' in col or 'sku' in col for col in colunas_lower)
        
        if has_periodo and has_valor and has_produto:
            return 'long'
        
        # Verifica se tem colunas de datas (formato wide)
        date_cols = []
        meses_pt = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        meses_en = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
        
        for col in df.columns:
            col_str = str(col).lower()
            # Verifica se tem barra (ex: 01/2022) ou meses em PT/EN
            if '/' in col_str or any(mes in col_str for mes in meses_pt + meses_en):
                date_cols.append(col)
        
        if len(date_cols) > 3:  # Se tem mais de 3 colunas de datas
            return 'wide'
        
        return 'unknown'

    def _transformar_wide_to_long(self, df):
        """Transforma formato wide (colunas de datas) para long."""
        id_cols = []
        date_cols = []
        
        meses_pt = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        meses_en = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
        
        for col in df.columns:
            col_lower = str(col).lower()
            # Identifica colunas de identificação
            if any(x in col_lower for x in ['sku', 'produto', 'codigo', 'código', 'familia', 'linha', 'processo', 'classe']):
                id_cols.append(col)
            # Identifica colunas de datas
            else:
                col_str = str(col).lower()
                if '/' in col_str or any(mes in col_str for mes in meses_pt + meses_en):
                    date_cols.append(col)
        
        print(f"🔍 Identificadas {len(id_cols)} colunas de ID e {len(date_cols)} colunas de datas")
        
        # 2. Mapeia nomes das colunas
        rename_map = {}
        for col in id_cols:
            col_lower = str(col).lower()
            if 'sku' in col_lower or 'produto' in col_lower or 'codigo' in col_lower or 'código' in col_lower:
                rename_map[col] = 'cdproduto'
            elif 'familia' in col_lower or 'linha' in col_lower:
                rename_map[col] = 'cdlinha'
            elif 'processo' in col_lower:
                rename_map[col] = 'cdprocesso'
        
        df = df.rename(columns=rename_map)
        
        # 3. Converte formato wide para long
        id_columns = ['cdproduto', 'cdlinha', 'cdprocesso']
        id_columns = [col for col in id_columns if col in df.columns]
        
        df_long = pd.melt(
            df,
            id_vars=id_columns,
            value_vars=date_cols,
            var_name='periodo',
            value_name='valor'
        )
        
        # 4. Normaliza datas
        df_long['periodo'] = df_long['periodo'].apply(self._parse_date)
        
        # 5. Remove linhas inválidas
        df_long = df_long.dropna(subset=['periodo', 'valor'])
        
        return df_long

    def _normalizar_formato_long(self, df):
        """Normaliza planilha que já está em formato long."""
        # Mapeia nomes das colunas
        rename_map = {}
        for col in df.columns:
            col_lower = str(col).lower()
            if 'periodo' in col_lower or 'data' in col_lower:
                rename_map[col] = 'periodo'
            elif 'sku' in col_lower or 'produto' in col_lower:
                rename_map[col] = 'cdproduto'
            elif 'familia' in col_lower or 'linha' in col_lower:
                rename_map[col] = 'cdlinha'
            elif 'processo' in col_lower:
                rename_map[col] = 'cdprocesso'
            elif 'valor' in col_lower or 'quantidade' in col_lower:
                rename_map[col] = 'valor'
        
        df = df.rename(columns=rename_map)
        return df

    def _parse_date(self, date_str):
        """Converte diferentes formatos de data para YYYY-MM-01."""
        date_str = str(date_str).strip()
        
        # Mapeamento de meses em português
        meses = {
            'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
            'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
            'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
        }
        
        try:
            # Formato: ago/22, set/23
            if '/' in date_str and len(date_str.split('/')) == 2:
                mes_str, ano_str = date_str.split('/')
                mes_str = mes_str.lower()[:3]
                
                if mes_str in meses:
                    mes = meses[mes_str]
                    ano = '20' + ano_str if len(ano_str) == 2 else ano_str
                    return f"{ano}-{mes}-01"
            
            # Formato: 08/2022, 8/2022
            elif '/' in date_str:
                parts = date_str.split('/')
                if len(parts) == 2:
                    mes = parts[0].zfill(2)
                    ano = parts[1]
                    return f"{ano}-{mes}-01"
            
            # Formato: 2022-08
            elif '-' in date_str and len(date_str.split('-')) == 2:
                ano, mes = date_str.split('-')
                return f"{ano}-{mes.zfill(2)}-01"
            
            # Tenta pandas
            return pd.to_datetime(date_str).strftime('%Y-%m-01')
            
        except Exception as e:
            return None

    async def _read_file_raw(self, file, extension: str) -> pd.DataFrame:
        """Lê arquivo sem normalizar colunas (para detectar formato)."""
        contents = await file.read()

        if extension == ".csv":
            df = pd.read_csv(io.BytesIO(contents))
        elif extension in [".xlsx", ".xls"]:
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise ValueError(f"Extensão não suportada: {extension}")

        return df

    