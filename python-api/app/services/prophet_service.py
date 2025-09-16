from prophet import Prophet
import pandas as pd
import numpy as np
from app.utils.holiday import get_brazil_holidays

br_holidays = get_brazil_holidays()

class ProphetService:
    #Tabelas de Feriados Brasileiros

    def make_prediction(df, sku=None, periods=12):
        
        if sku is not None:
            df_filtered = df[df['SKU'] == sku].copy()
            if df_filtered.empty:
                raise ValueError(f"SKU '{sku}' não encontrado nos dados")
            print(f"Fazendo previsão para SKU: {sku}")
        else:
            df_filtered = df.copy()
            print("Fazendo previsão para todos os SKUs")

        
        prophet_df = df_filtered[['ds', 'y']].copy()

        #prophet_df = df_prophet.rename(columns={
        #    'Data': 'ds',
        #   'Quantidade': 'y'
        #})

        print(f"📊 Dados preparados: {len(prophet_df)} pontos de dados")

        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode="multiplicative",
            changepoint_prior_scale=0.05,
            holidays=br_holidays
        )

        if len(prophet_df) >= 24:
            model.add_seasonality(name='monthly', period=periods, fourier_order=5)
        
        model.fit(prophet_df)

        future = model.make_future_dataframe(periods=periods, freq='MS')
        forecast = model.predict(future)

        forecast['yhat'] = forecast['yhat'].clip(lower=0)
        forecast['yhat_lower'] = forecast['yhat_lower'].clip(lower=0)
        forecast['yhat_upper'] = forecast['yhat_upper'].clip(lower=0)

        return forecast

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