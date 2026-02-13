import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from statsmodels.tsa.seasonal import seasonal_decompose


class DataClusterization:
    def __init__(self):
        pass

    @staticmethod
    def obter_metricas(df, sku):
        """Calcula métricas para um SKU específico."""
        df = df.copy()
        df["SKU"] = df["SKU"].astype(str).str.strip()
        sku = str(sku).strip()

        df_filtered = df[df["SKU"] == sku].copy()

        if len(df_filtered) == 0:
            print(f"⚠️ SKU '{sku}' não encontrado!")
            return None

        df_qtd = df_filtered["Quantidade"]
        df_media = df_qtd.mean()

        prop_zeros = DataClusterization.calcular_prop_zeros(df_qtd)
        trend = DataClusterization.calcular_tendencia(df_qtd)

        # Ajusta força de sazonalidade se houver muitos zeros
        if prop_zeros > 0.25:
            forca_sazonalidade = 0.0
        elif prop_zeros > 0.01:
            df_qtd_ajustado = df_qtd.replace(0, 0.8)
            forca_sazonalidade = DataClusterization.calcular_forca_sazonalidade(
                df_qtd_ajustado
            )
        else:
            forca_sazonalidade = DataClusterization.calcular_forca_sazonalidade(df_qtd)

        metrics = {
            "media": float(df_qtd.mean()),
            "coeficiente_variacao": float(df_qtd.std() / df_media),
            "tendencia": float(trend),
            "forca_sazonalidade": float(forca_sazonalidade),
            "proporcao_zeros": float(prop_zeros),
        }
        return metrics

    @staticmethod
    def obter_metricas_todos_skus(df):
        """Calcula métricas para todos os SKUs no DataFrame."""
        df = df.copy()
        df["SKU"] = df["SKU"].astype(str).str.strip()

        skus = df["SKU"].unique()
        resultados = {}
        total = len(skus)

        print(f"Calculando métricas para {total} SKUs...")
        lista_metrics = []

        for idx, sku in enumerate(skus, 1):
            if idx % 100 == 0:
                print(f"Processando SKU {idx}/{total}...")

            # Filtrar dados do SKU
            df_filtered = df[df["SKU"] == sku].copy()

            if len(df_filtered) == 0:
                continue

            df_qtd = df_filtered["Quantidade"]
            df_media = df_qtd.mean()

            if df_media == 0:
                continue

            # Calcular métricas
            prop_zeros = DataClusterization.calcular_prop_zeros(df_qtd)
            trend = DataClusterization.calcular_tendencia(df_qtd)

            # Ajusta força de sazonalidade se houver muitos zeros
            if prop_zeros > 0.25:
                forca_sazonalidade = 0.0
            elif prop_zeros > 0.01:
                df_qtd_ajustado = df_qtd.replace(0, 0.8)
                forca_sazonalidade = DataClusterization.calcular_forca_sazonalidade(
                    df_qtd_ajustado
                )
            else:
                forca_sazonalidade = DataClusterization.calcular_forca_sazonalidade(
                    df_qtd
                )

            metrics = {
                "media": float(df_qtd.mean()),
                "coeficiente_variacao": float(df_qtd.std() / df_media),
                "tendencia": float(trend),
                "forca_sazonalidade": float(forca_sazonalidade),
                "proporcao_zeros": float(prop_zeros),
            }

            metrics["sku"] = sku
            lista_metrics.append(metrics)

        df_final = pd.DataFrame(lista_metrics)
        return df_final

    @staticmethod
    def calcular_tendencia(df):
        """Calcula a tendência linear dos dados."""
        X = np.arange(len(df)).reshape(-1, 1)
        y = df.values

        model = LinearRegression()
        model.fit(X, y)

        return model.coef_[0]

    @staticmethod
    def calcular_prop_zeros(df):
        """Calcula a proporção de valores zero nos dados."""
        total_count = len(df)
        zero_count = (df == 0).sum()
        return zero_count / total_count

    @staticmethod
    def calcular_forca_sazonalidade(df, periodo=12):
        """Calcula a força da sazonalidade usando decomposição multiplicativa."""
        if len(df) < 24:
            return 0.0

        decomposition = seasonal_decompose(df, model="multiplicative", period=periodo)
        residuos = decomposition.resid.dropna()
        detrended = df - decomposition.trend
        forca = max(0, 1 - np.var(residuos) / np.var(detrended.dropna()))

        return forca

    @staticmethod
    def clusterizar_skus(df):
        """Clusterização dos SKUs com KMeans."""
        df_metrics = DataClusterization.obter_metricas_todos_skus(df)
        features = [
            "media",
            "coeficiente_variacao",
            "tendencia",
            "forca_sazonalidade",
            "proporcao_zeros",
        ]
        X = df_metrics[features]

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        optimal_k = 4
        kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
        kmeans.fit(X_scaled)
        df_metrics["cluster"] = kmeans.labels_

        cluster_profile = df_metrics.groupby("cluster")[features].mean()
        print("Perfis dos clusters:")
        print(cluster_profile.round(2))

        print("\nDistribuição dos SKUs por cluster:")
        print(df_metrics["cluster"].head())

        df_metrics = df_metrics.replace({np.nan: None})
        return df_metrics.to_dict(orient="records")
