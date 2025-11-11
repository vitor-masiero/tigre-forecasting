import pandas as pd
import io
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.feature_metadata import FeatureMetadata
from app.config.db_config import DatabaseConfig
from sqlalchemy.engine import Engine

class ImportService:
    def __init__(self, db: Session):
        self.db = db
        self.engine: Engine = DatabaseConfig.get_engine()
    
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