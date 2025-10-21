import pandas as pd
from typing import Optional, Tuple

class AggregationService:
    @staticmethod
    def _prepare_data(df: pd.DataFrame) -> pd.DataFrame:
        duplicates = df.groupby(['SKU', 'Data']).size()
        has_duplicates = (duplicates > 1).any()
        
        if has_duplicates:
            print("⚠️ Detectadas múltiplas entradas para o mesmo SKU na mesma data")
            print("📊 Agregando por SKU + Data (somando quantidades duplicadas)")
            
            # Agrupa por SKU + Data e soma quantidades (mantém outras colunas)
            df_clean = (
                df.groupby(['SKU', 'Data', 'Familia', 'Processo'])
                ['Quantidade']
                .sum()
                .reset_index()
            )
        else:
            df_clean = df.copy()
        
        return df_clean

    @staticmethod
    def aggregate_combined(
        df: pd.DataFrame,
        df_classified: Optional[pd.DataFrame] = None,
        familia: Optional[str] = None,
        processo: Optional[str] = None,
        abc_class: Optional[str] = None
    ) -> Tuple[pd.DataFrame, dict]:
        
        df_clean = AggregationService._prepare_data(df)
        
        # Inicia com todos os dados
        df_filtered = df_clean.copy()
        filters_applied = []
        
    
        if familia:
            df_filtered = df_filtered[df_filtered["Familia"] == familia]
            if df_filtered.empty:
                raise ValueError(f"Família '{familia}' não encontrada nos dados")
            filters_applied.append(f"Familia={familia}")
            print(f"🔍 Filtro aplicado: Familia = {familia} → {len(df_filtered)} registros")
        
        # Filtro 2: Processo
        if processo:
            df_filtered = df_filtered[df_filtered["Processo"] == processo]
            if df_filtered.empty:
                raise ValueError(f"Processo '{processo}' não encontrado nos dados (após filtros anteriores)")
            filters_applied.append(f"Processo={processo}")
            print(f"🔍 Filtro aplicado: Processo = {processo} → {len(df_filtered)} registros")
        
        # Filtro 3: Classe ABC
        if abc_class:
            if df_classified is None:
                raise ValueError("df_classified é necessário quando abc_class é especificado")
            
            abc_class = abc_class.upper().strip()
            if abc_class not in ["A", "B", "C"]:
                raise ValueError(f"Classe ABC inválida: '{abc_class}'. Use A, B ou C")
            
            # Filtra SKUs da classe ABC
            skus_abc = df_classified[df_classified["Classe_ABC"] == abc_class]["SKU"].unique()
            
            if len(skus_abc) == 0:
                raise ValueError(f"Nenhum SKU encontrado para classe ABC '{abc_class}'")
            
            df_filtered = df_filtered[df_filtered["SKU"].isin(skus_abc)]
            
            if df_filtered.empty:
                raise ValueError(f"Nenhum dado encontrado para classe ABC '{abc_class}' (após filtros anteriores)")
            
            filters_applied.append(f"ABC={abc_class}")
            print(f"🔍 Filtro aplicado: ABC = {abc_class} → {len(df_filtered)} registros")
        
       
        df_aggregated = (
            df_filtered.groupby("Data")["Quantidade"]
            .sum()
            .reset_index()
        )
    
        info = {
            "type": "combined",
            "filters": filters_applied,
            "skus_count": df_filtered["SKU"].nunique(),
            "total_quantity": df_filtered["Quantidade"].sum(),
            "date_range": {
                "start": str(df_filtered["Data"].min()),
                "end": str(df_filtered["Data"].max())
            }
        }
        
        # Adiciona detalhes dos filtros
        if familia:
            info["familia"] = familia
        if processo:
            info["processo"] = processo
        if abc_class:
            info["abc_class"] = abc_class
        
        # Adiciona informações adicionais
        info["familias_included"] = df_filtered["Familia"].unique().tolist()
        info["processos_included"] = df_filtered["Processo"].unique().tolist()
        
        
        return df_aggregated, info

    @staticmethod
    def aggregate_familia(df: pd.DataFrame, familia: Optional[str] = None) -> Tuple[pd.DataFrame, dict]:
        df_clean = AggregationService._prepare_data(df)
        
        if familia:
            df_filtered = df_clean[df_clean["Familia"] == familia].copy()
            if df_filtered.empty:
                raise ValueError(f"Família '{familia}' não encontrada nos dados")
            
            skus_list = df_filtered["SKU"].unique().tolist()
            info = {
                "type": "familia",
                "familia": familia,
                "skus_count": len(skus_list),
                "processos": df_filtered["Processo"].unique().tolist(),
                "skus": skus_list[:10]  # Primeiros 10 SKUs para referência
            }
        else:
            df_filtered = df_clean.copy()
            info = {
                "type": "all_familias",
                "familias": df_clean["Familia"].unique().tolist(),
                "skus_count": df_clean["SKU"].nunique()
            }
        
        df_aggregated = (
            df_filtered.groupby("Data")["Quantidade"]
            .sum()
            .reset_index()
        )
        
        print(f"📊 Agregação concluída: {len(df_aggregated)} períodos, {info['skus_count']} SKUs")
        
        return df_aggregated, info
    
    @staticmethod
    def aggregate_by_processo(df: pd.DataFrame, processo: Optional[str] = None) -> Tuple[pd.DataFrame, dict]:
        # Prepara dados (remove duplicatas se existirem)
        df_clean = AggregationService._prepare_data(df)
        
        if processo:
            df_filtered = df_clean[df_clean["Processo"] == processo].copy()
            if df_filtered.empty:
                raise ValueError(f"Processo '{processo}' não encontrado nos dados")
            
            skus_list = df_filtered["SKU"].unique().tolist()
            info = {
                "type": "processo",
                "processo": processo,
                "skus_count": len(skus_list),
                "familias": df_filtered["Familia"].unique().tolist(),
                "skus": skus_list[:10]  # Primeiros 10 SKUs para referência
            }
        else:
            df_filtered = df_clean.copy()
            info = {
                "type": "all_processos",
                "processos": df_clean["Processo"].unique().tolist(),
                "skus_count": df_clean["SKU"].nunique()
            }
        
        # Agrupa por Data e soma as quantidades
        df_aggregated = (
            df_filtered.groupby("Data")["Quantidade"]
            .sum()
            .reset_index()
        )
        
        print(f"📊 Agregação concluída: {len(df_aggregated)} períodos, {info['skus_count']} SKUs")
        
        return df_aggregated, info
    
    @staticmethod
    def aggregate_by_abc(
        df: pd.DataFrame, 
        df_classified: pd.DataFrame, 
        abc_class: str
    ) -> Tuple[pd.DataFrame, dict]:

        abc_class = abc_class.upper().strip()
        if abc_class not in ["A", "B", "C"]:
            raise ValueError(f"Classe ABC inválida: '{abc_class}'. Use A, B ou C")
        
        # Prepara dados (remove duplicatas se existirem)
        df_clean = AggregationService._prepare_data(df)
        
        # Filtra SKUs da classe ABC especificada
        skus_abc = df_classified[df_classified["Classe_ABC"] == abc_class]["SKU"].unique()
        
        if len(skus_abc) == 0:
            raise ValueError(f"Nenhum SKU encontrado para classe ABC '{abc_class}'")
        
        # Filtra dados originais pelos SKUs da classe ABC
        df_filtered = df_clean[df_clean["SKU"].isin(skus_abc)].copy()
        
        # Agrupa por Data e soma as quantidades
        df_aggregated = (
            df_filtered.groupby("Data")["Quantidade"]
            .sum()
            .reset_index()
        )
        
        info = {
            "type": "abc_class",
            "abc_class": abc_class,
            "skus_count": len(skus_abc),
            "familias": df_filtered["Familia"].unique().tolist(),
            "processos": df_filtered["Processo"].unique().tolist(),
            "skus": skus_abc.tolist()[:10]  # Primeiros 10 SKUs
        }
        
        print(f"📊 Agregação ABC '{abc_class}' concluída: {len(df_aggregated)} períodos, {len(skus_abc)} SKUs")
        
        return df_aggregated, info
    
    @staticmethod
    def aggregate_all(df: pd.DataFrame) -> Tuple[pd.DataFrame, dict]:
        # Prepara dados (remove duplicatas se existirem)
        df_clean = AggregationService._prepare_data(df)
        
        df_aggregated = (
            df_clean.groupby("Data")["Quantidade"]
            .sum()
            .reset_index()
        )
        
        info = {
            "type": "all_products",
            "total_skus": df_clean["SKU"].nunique(),
            "familias": df_clean["Familia"].unique().tolist(),
            "processos": df_clean["Processo"].unique().tolist()
        }
        
        print(f"📊 Agregação total concluída: {len(df_aggregated)} períodos, {info['total_skus']} SKUs")
        
        return df_aggregated, info
    
