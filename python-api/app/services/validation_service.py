import numpy as np
import pandas as pd
from app.data_processing.transformer import preprocess_data_for_validation
from app.repository.query_repository import QueryRepository
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from app.utils.holiday import get_brazil_holidays
from app.utils.incc import get_incc_with_forecast
from app.utils.selic import get_selic_with_forecast
from app.repository.prophet_repository import ProphetRepository
from app.data_processing.clusterization import DataClusterization
from sqlalchemy.orm import Session

br_holidays = get_brazil_holidays()

class ValidationService:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.saver = ProphetRepository(db_session)

    def cv_sku(self, sku=None, outlier_method='iqr', outlier_threshold=1.5):
        """
        Cross-validation de SKU com tratamento de outliers integrado.
        
        Args:
            sku: Código do SKU
            outlier_method: 'iqr', 'mad', 'percentile', 'zscore', 'none'
            outlier_threshold: Threshold para detecção (1.5 para IQR, 3.0 para zscore)
        """
        # Busca dados brutos
        df_bruto = QueryRepository.get_unique_sku(sku)
        
        # Preprocessa com tratamento de outliers
        df = preprocess_data_for_validation(
            df_bruto,
            outlier_method=outlier_method,
            outlier_threshold=outlier_threshold
        )
        
        print(f"\n📊 Validando SKU {sku} | Período: {df['Data'].min()} a {df['Data'].max()} | {len(df)} registros")

        # Obtém métricas de clusterização
        df_for_metrics = df[["Data", "Quantidade"]].copy()
        df_for_metrics["SKU"] = sku
        
        metrics_cluster = DataClusterization.obter_metricas(df_for_metrics, sku)
        
        if metrics_cluster is None:
            print(f"⚠️  Métricas de clusterização não disponíveis")
            metrics_cluster = {
                "media": 0.0,
                "coeficiente_variacao": 0.0,
                "tendencia": 0.0,
                "forca_sazonalidade": 0.0,
                "proporcao_zeros": 0.0
            }

        # Prepara para Prophet
        df_prophet = df[["Data", "Quantidade"]].copy()
        df_prophet = df_prophet.rename(columns={"Data": "ds", "Quantidade": "y"})
        
        # Calcula dias disponíveis
        data_days = (df_prophet['ds'].max() - df_prophet['ds'].min()).days
        data_months = data_days / 30
        
        print(f"📅 Histórico: {data_days} dias ({data_months:.1f} meses)")
        
        # Configuração adaptativa
        if data_days >= 900:
            initial, period, horizon = "540 days", "90 days", "180 days"
            cv_label = "Completa"
        elif data_days >= 720:
            initial, period, horizon = "450 days", "90 days", "120 days"
            cv_label = "Intermediária"
        else:
            initial, period, horizon = "365 days", "60 days", "90 days"
            cv_label = "Reduzida"
        
        print(f"⚙️  Config CV: {cv_label} | initial={initial}, period={period}, horizon={horizon}")
        
        # Carrega INCC
        cv_horizon_days = int(horizon.split()[0])
        total_forecast_days = cv_horizon_days + 180
        
        incc_data = get_incc_with_forecast(
            end_date=df_prophet['ds'].max() + pd.Timedelta(days=total_forecast_days),
            forecast_periods=total_forecast_days
        )
        selic_data = get_selic_with_forecast(
            end_date=df_prophet['ds'].max() + pd.Timedelta(days=total_forecast_days)
        )
        
        df_prophet = (
            df_prophet
            .merge(incc_data, on='ds', how='left')
            .merge(selic_data, on='ds', how='left')
        )

        lag_meses = 4
        df_prophet["selic_lagged"] = df_prophet["selic"].shift(lag_meses)
        df_prophet["selic_lagged"] = df_prophet["selic_lagged"].fillna(method="bfill")

        df_prophet["incc"] = df_prophet["incc"].interpolate(method="linear").fillna(method="ffill").fillna(method="bfill")
        
        print(f"✅ INCC integrado até {incc_data['ds'].max()}")
        
        # Validação de dados
        if df_prophet["y"].isna().any():
            print(f"⚠️  {df_prophet['y'].isna().sum()} NaN removidos")
            df_prophet = df_prophet.dropna()
        
        if (df_prophet["y"] < 0).any():
            print(f"⚠️  Valores negativos convertidos para 0")
            df_prophet["y"] = df_prophet["y"].clip(lower=0)

        # Parâmetros do modelo
        changepoint_prior_scale = 0.1
        seasonality_prior_scale = 10
        seasonality_mode = "multiplicative"

        # Treina modelo
        print(f"🚀 Treinando Prophet + INCC...")
        
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode=seasonality_mode,
            changepoint_prior_scale=changepoint_prior_scale,
            seasonality_prior_scale=seasonality_prior_scale,
            holidays=br_holidays
        )
        
        model.add_regressor('incc', prior_scale=10.0, mode='multiplicative')
        model.add_regressor('selic_lagged', prior_scale=5.0, mode='multiplicative')

        model.fit(df_prophet[['ds', 'y', 'incc', 'selic_lagged']])

        print(f"🔄 Executando cross-validation...")
        
        try:
            df_cv = cross_validation(
                model,
                initial=initial,
                period=period,
                horizon=horizon,
                parallel="processes",
            )
            
            num_splits = len(df_cv['cutoff'].unique())
            print(f"✅ CV concluído: {len(df_cv)} previsões em {num_splits} splits")
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Erro: {error_msg}")
            
            if "initial" in error_msg.lower() or "less than" in error_msg.lower():
                print(f"🔄 Tentando config mínima...")
                
                df_cv = cross_validation(
                    model,
                    initial="365 days",
                    period="60 days",
                    horizon="90 days",
                    parallel="processes",
                )
                
                num_splits = len(df_cv['cutoff'].unique())
                print(f"✅ CV alternativo: {len(df_cv)} previsões em {num_splits} splits")
            else:
                raise e

        df_metrics = performance_metrics(df_cv, rolling_window=1)
        wmape = ValidationService.calcular_wmape(df_cv)

        # Salva métricas
        self.saver.salvar_metricas_sku(
            sku=sku,
            ds_modelo="Prophet",
            wmape=wmape,
            media=metrics_cluster["media"],
            coeficiente_variacao=metrics_cluster["coeficiente_variacao"],
            tendencia=metrics_cluster["tendencia"],
            forca_sazonalidade=metrics_cluster["forca_sazonalidade"],
            proporcao_zeros=metrics_cluster["proporcao_zeros"],
            changepoint_prior_scale=changepoint_prior_scale,
            seasonality_prior_scale=seasonality_prior_scale,
            seasonality_mode=seasonality_mode
        )
        
        print(f"\n{'='*60}")
        print(f"✅ VALIDAÇÃO CONCLUÍDA - SKU {sku}")
        print(f"{'='*60}")
        print(f"WMAPE: {wmape:.2f}% | MAE: {df_metrics['mae'].mean():.2f} | RMSE: {df_metrics['rmse'].mean():.2f}")
        print(f"Método outliers: {outlier_method} | Splits: {num_splits}")
        print(f"{'='*60}\n")

        return df_cv, df_metrics, wmape
    
    @staticmethod
    def calcular_wmape(df_cv):
        """WMAPE = Σ|y_real - y_pred| / Σ|y_real| × 100"""
        y_real = df_cv["y"].values
        y_pred = df_cv["yhat"].values
        
        mask = y_real != 0
        y_real_filtered = y_real[mask]
        y_pred_filtered = y_pred[mask]
        
        if len(y_real_filtered) == 0:
            return np.nan

        numerador = np.sum(np.abs(y_real_filtered - y_pred_filtered))
        denominador = np.sum(np.abs(y_real_filtered))
        
        if denominador == 0:
            return np.nan
        
        wmape = (numerador / denominador) * 100

        return wmape