
from sqlalchemy.orm import Session
from prophet import Prophet
import pandas as pd
import numpy as np
from app.utils.holiday import get_brazil_holidays
from app.repository.prophet_repository import ProphetRepository

br_holidays = get_brazil_holidays()

class ProphetService:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.saver = ProphetRepository(db_session)

    def make_prediction(self, df, sku=None, periods=12):
    
        if sku is not None:
            df_filtered = df[df['SKU'] == sku].copy()
            skus = [sku]
            if df_filtered.empty:
                raise ValueError(f"SKU '{sku}' não encontrado nos dados")
            print(f"Fazendo previsão para SKU: {sku}")
        else:
            df_filtered = df.copy()
            skus = np.sort(df['SKU'].unique())
            print("Fazendo previsão para todos os SKUs")

        
        df_filtered = df_filtered[['Data', 'Quantidade']].copy()

        df_prophet = df_filtered.rename(columns={
            'Data': 'ds',
           'Quantidade': 'y'
        })

        print(f"📊 Dados preparados: {len(df_prophet)} pontos de dados")

        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode="multiplicative",
            changepoint_prior_scale=0.05,
            holidays=br_holidays
        )

        if len(df_prophet) >= 24:
            model.add_seasonality(name='monthly', period=periods, fourier_order=5)
        
        model.fit(df_prophet)

        future = model.make_future_dataframe(periods=periods, freq='MS')
        forecast = model.predict(future)

        forecast['yhat'] = forecast['yhat'].clip(lower=0)
        forecast['yhat_lower'] = forecast['yhat_lower'].clip(lower=0)
        forecast['yhat_upper'] = forecast['yhat_upper'].clip(lower=0)

        run_id = self.saver.save_forecast_run("Prophet", len(skus), None)

        return run_id, forecast
    
    def predict_all_skus(self, df, periods=12):
        #Lista de SKUs únicos em ordem crescente
        skus = np.sort(df['SKU'].unique())
        
        run_id = self.saver.save_forecast_run("Prophet", len(skus), None)

        print(f"Iniciando as previsões para {len(skus)} SKUs")
        
        forecasts = {}
        failed_skus = []
        
        # Loop para prever SKU a SKU
        for i, sku in enumerate(skus, 1):
            try:
                print(f"\n--- Processando SKU {i}/{len(skus)}: {sku} ---")
                forecast = ProphetService.make_prediction(self, df, sku=sku, periods=periods)
                forecasts[sku] = forecast
            except Exception as e:
                failed_skus.append((sku, str(e)))
                continue  # Continuar com os demais SKUs
        
        # Relatório final
        print(f"\nProcesso concluído!")
        print(f"SKUs processados com sucesso: {len(forecasts)}")
        print(f"SKUs com falha: {len(failed_skus)}")
        
        if failed_skus:
            print("\nSKUs com falha:")
            for sku, error in failed_skus:
                print(f"  - {sku}: {error}")

        
        
        return run_id, failed_skus

def inverse_log_transform(forecast):
    """
    Converte as previsões de volta da escala logarítmica para a escala original
    
    Por que isso é necessário?
    - Os dados foram transformados com log1p() (escala logarítmica)
    - O Prophet fez previsões nessa escala logarítmica
    - Precisamos converter de volta para valores reais (escala original)
    - expm1() é o inverso de log1p()
    """
    forecast_copy = forecast.copy()
    
    # Aplica a transformação inversa nas colunas de previsão
    forecast_copy['yhat'] = np.expm1(forecast_copy['yhat'])
    forecast_copy['yhat_lower'] = np.expm1(forecast_copy['yhat_lower'])
    forecast_copy['yhat_upper'] = np.expm1(forecast_copy['yhat_upper'])
    
    print("✅ Previsões convertidas de volta para escala original")
    return forecast_copy