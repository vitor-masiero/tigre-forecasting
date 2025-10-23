import numpy as np
import pandas as pd


class DataTransformer:
    """
    Trata colunas, datas e outliers
    """

    def __init__(self):
        pass

    def preprocess(self, df):
        df = df.copy()

        # 1. Converte coluna periodo para datetime
        df["Data"] = pd.to_datetime(df["periodo"], format="%Y-%m")

        # 2. Renomeia colunas para padrão
        df = df.rename(
            columns={
                "cdproduto": "SKU",
                "valor": "Quantidade",
                "cdfamilia": "Familia",
                "cdprocesso": "Processo",
            }
        )

        df = df[["SKU", "Data", "Quantidade", "Familia", "Processo"]]

        # 3. Garante tipo numérico
        df["Quantidade"] = pd.to_numeric(df["Quantidade"], errors="coerce").fillna(0)
    

        # 4. Remove outliers
        df = self.remove_outliers(df)
    
        
        return df

    def remove_outliers(self, df):
        """Remove outliers por SKU usando vetorização"""
        print("Removendo outliers...")
        df = df.copy()
        
        q1 = df.groupby("SKU")["Quantidade"].transform(lambda x: x.quantile(0.25))
        q3 = df.groupby("SKU")["Quantidade"].transform(lambda x: x.quantile(0.75))
        iqr = q3 - q1
        
        lower = np.maximum(0, q1 - 1.5 * iqr)
        upper = q3 + 1.5 * iqr
        
        df["Quantidade"] = df["Quantidade"].clip(lower=lower, upper=upper)
        
        return df

    def log_transform(self, df, quantity_col="Quantidade"):
        df = df.copy()
        df["Quantidade_log"] = np.log1p(df[quantity_col])
        return df


# Função de conveniência para pipeline
def preprocess_data(df):
    transformer = DataTransformer()
    return transformer.preprocess(df)