import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing
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
    
    if end_date is not None:
        end_date = pd.to_datetime(end_date)
        days_needed = (end_date - incc_historico['ds'].max()).days
        if days_needed > 0:
            forecast_periods = max(forecast_periods, days_needed + 30)
    
    print(f"🔮 Prevendo INCC por {forecast_periods} dias (último histórico: {incc_historico['ds'].max()})")
    
    incc_historico_indexed = incc_historico.set_index('ds')
    
    model_incc = ExponentialSmoothing(
        incc_historico_indexed['incc'],
        seasonal_periods=30,
        trend='add',
        seasonal='add'
    )
    
    fitted_model = model_incc.fit()
    
    forecast = fitted_model.forecast(steps=forecast_periods)
    
    forecast_df = pd.DataFrame({
        'ds': pd.date_range(start=incc_historico['ds'].max() + pd.Timedelta(days=1), periods=forecast_periods, freq='D'),
        'incc': forecast.values
    })
    
    incc_completo = pd.concat([incc_historico, forecast_df], ignore_index=True)
    
    print(f"✅ INCC disponível até {incc_completo['ds'].max()}")
    
    return incc_completo