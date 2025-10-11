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
        
        print("\n" + "="*60)
        print("ANTES DO TRATAMENTO DE OUTLIERS")
        print("="*60)
        print(f"Estatísticas da Quantidade:")
        print(df["Quantidade"].describe())
        print(f"\nValores únicos de SKU: {df['SKU'].nunique()}")
        print(f"Total de registros: {len(df)}")

        # 4. Remove outliers
        df = self.remove_outliers(df)
        
        print("\n" + "="*60)
        print("DEPOIS DO TRATAMENTO DE OUTLIERS")
        print("="*60)
        print(f"Estatísticas da Quantidade:")
        print(df["Quantidade"].describe())
        print(f"Total de registros: {len(df)}")
        print("="*60 + "\n")
        
        return df

    def remove_outliers(self, df):
        """
        Remove outliers por SKU usando regra do IQR.
        Substitui valores fora do intervalo de IQR
        pelo limite máximo/mínimo permitido (winsorização).
        """
        df = df.copy()
        
        # Guarda valores originais para comparação
        original_values = df["Quantidade"].copy()
        
        print("\n🔧 INICIANDO TRATAMENTO DE OUTLIERS")
        print("="*60)
        
        # Processa cada SKU separadamente
        result_dfs = []
        
        for sku_id, group in df.groupby("SKU"):
            # Faz cópia do grupo
            group = group.copy()
            
            # Calcula quartis
            q1 = group["Quantidade"].quantile(0.25)
            q3 = group["Quantidade"].quantile(0.75)
            iqr = q3 - q1
            
            # Calcula limites
            lower = max(0, q1 - 1.5 * iqr)
            upper = q3 + 1.5 * iqr
            
            # Identifica outliers
            outliers_lower = group["Quantidade"] < lower
            outliers_upper = group["Quantidade"] > upper
            outliers_mask = outliers_lower | outliers_upper
            
            n_outliers = outliers_mask.sum()
            n_lower = outliers_lower.sum()
            n_upper = outliers_upper.sum()
            
            print(f"\n📊 SKU: {sku_id}")
            print(f"   Total de registros: {len(group)}")
            print(f"   Q1: {q1:.2f} | Q3: {q3:.2f} | IQR: {iqr:.2f}")
            print(f"   Limites: [{lower:.2f}, {upper:.2f}]")
            print(f"   Outliers detectados: {n_outliers} ({n_outliers/len(group)*100:.1f}%)")
            
            if n_outliers > 0:
                print(f"   ├─ Abaixo do limite: {n_lower}")
                print(f"   └─ Acima do limite: {n_upper}")
                
                # Mostra alguns exemplos de valores que serão alterados
                if n_lower > 0:
                    valores_baixos = group.loc[outliers_lower, "Quantidade"].values[:3]
                    print(f"   Exemplos de valores baixos: {valores_baixos} → {lower:.2f}")
                if n_upper > 0:
                    valores_altos = group.loc[outliers_upper, "Quantidade"].values[:3]
                    print(f"   Exemplos de valores altos: {valores_altos} → {upper:.2f}")
            
            # Aplica o clip (winsorização)
            group["Quantidade"] = group["Quantidade"].clip(lower=lower, upper=upper)
            
            result_dfs.append(group)
        
        # Concatena todos os grupos
        df_treated = pd.concat(result_dfs, ignore_index=True)
        
        # Calcula estatísticas de mudança
        changes = (original_values.values != df_treated["Quantidade"].values).sum()
        total = len(df_treated)
        
        print("\n" + "="*60)
        print(f"✅ TRATAMENTO CONCLUÍDO")
        print(f"   Total de valores alterados: {changes}/{total} ({changes/total*100:.1f}%)")
        print("="*60)
        
        return df_treated

    def log_transform(self, df, quantity_col="Quantidade"):
        df = df.copy()
        df["Quantidade_log"] = np.log1p(df[quantity_col])
        return df


# Função de conveniência para pipeline
def preprocess_data(df):
    transformer = DataTransformer()
    return transformer.preprocess(df)