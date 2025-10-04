import numpy as np
from app.data_processing.transformer import DataTransformer
from app.repository.query_repository import QueryRepository
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics


class ValidationService:
    def cv_sku(sku=None):
        df = QueryRepository.get_unique_sku(sku)
        print(df.head())
        df = DataTransformer().preprocess(df)
        print(df.head())

        if sku is not None:
            df_prophet = df[df["SKU"] == sku].copy()
            if df.empty:
                raise ValueError(f"SKU '{sku}' não encontrado nos dados")
            print(f"Fazendo validação cruzada para SKU: {sku}")
        else:
            df_prophet = df.copy()
            print("Fazendo validação cruzada para todos os SKUs")

        df_prophet = df_prophet[["Data", "Quantidade"]].copy()

        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode="multiplicative",
            changepoint_prior_scale=0.05,
        )

        model.fit(df.rename(columns={"Data": "ds", "Quantidade": "y"}))

        df_cv = cross_validation(
            model,
            initial="720 days",
            period="90 days",
            horizon="180 days",
            parallel="processes",
        )

        df_metrics = performance_metrics(df_cv, rolling_window=1)

        return df_cv, df_metrics

    @staticmethod
    def calcular_wmape(df_cv):
        """
        WMAPE = Σ|y_real - y_pred| / Σ|y_real| × 100
        """
        y_real = df_cv["y"].values
        y_pred = df_cv["yhat"].values

        numerador = np.sum(np.abs(y_real - y_pred))
        denominador = np.sum(np.abs(y_real))
        wmape = (numerador / denominador) * 100

        return wmape
