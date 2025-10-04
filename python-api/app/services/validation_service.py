import numpy as np
from app.repository.query_repository import QueryRepository
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics


class ValidationService:
    def cv_sku():
        df_prophet = QueryRepository.get_unique_sku(sku="84110165")
        df_prophet = df_prophet[["periodo", "valor"]].copy()

        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode="multiplicative",
            changepoint_prior_scale=0.05,
        )

        model.fit(df_prophet.rename(columns={"periodo": "ds", "valor": "y"}))

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
