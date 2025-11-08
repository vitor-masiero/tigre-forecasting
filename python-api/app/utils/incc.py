import pandas as pd
from prophet import Prophet
import warnings
warnings.filterwarnings('ignore')

def get_incc():
    """Carrega dados históricos do INCC"""
    dados_incc = pd.read_excel('INCC_Prophet_Format.xlsx')
    dados_incc['ds'] = pd.to_datetime(dados_incc['ds'])
    dados_incc.columns = ['ds', 'incc']
    return dados_incc


def get_incc_with_forecast(end_date=None, forecast_periods=540):
    """
    Carrega INCC histórico e faz previsão dos valores futuros.
    
    Args:
        end_date: Data final necessária (se None, usa data atual + forecast_periods)
        forecast_periods: Número de dias para prever (padrão 540 = 18 meses)
    
    Returns:
        DataFrame com 'ds' e 'incc' (histórico + previsão)
    """
    incc_historico = get_incc()
    
    # Sempre faz previsão para garantir dados futuros suficientes
    if end_date is not None:
        end_date = pd.to_datetime(end_date)
        # Calcula quantos dias precisamos prever
        days_needed = (end_date - incc_historico['ds'].max()).days
        if days_needed > 0:
            forecast_periods = max(forecast_periods, days_needed + 30)  # +30 dias de margem
    
    print(f"🔮 Prevendo INCC por {forecast_periods} dias (último histórico: {incc_historico['ds'].max()})")
    
    # Prepara dados para Prophet
    incc_train = incc_historico.copy()
    incc_train.columns = ['ds', 'y']
    
    # Modelo Prophet para INCC
    model_incc = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.05,
        seasonality_prior_scale=10.0
    )
    
    model_incc.fit(incc_train)
    
    # Cria futuro e prevê
    future = model_incc.make_future_dataframe(periods=forecast_periods, freq='D')
    forecast = model_incc.predict(future)
    
    # Retorna dados completos
    incc_completo = forecast[['ds', 'yhat']].copy()
    incc_completo.columns = ['ds', 'incc']
    
    print(f"✅ INCC disponível até {incc_completo['ds'].max()}")
    
    return incc_completo