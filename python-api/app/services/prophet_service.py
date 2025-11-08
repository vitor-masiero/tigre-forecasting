import numpy as np
from app.repository.prophet_repository import ProphetRepository
from app.utils.holiday import get_brazil_holidays
from app.utils.incc import get_incc
from app.utils.time import Time
from prophet import Prophet
from sqlalchemy.orm import Session

br_holidays = get_brazil_holidays()
incc = get_incc()


class ProphetService:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.saver = ProphetRepository(db_session)

    def make_prediction(self, df, sku=None, periods=12, time=None, aggregation_info=None):
        time = Time()

        if sku is not None:
            if "SKU" not in df.columns:
                raise ValueError("DataFrame deve conter coluna 'SKU' quando sku é especificado")
            df_filtered = df[df["SKU"] == sku].copy()
            
            if df_filtered.empty:
                raise ValueError(f"SKU '{sku}' não encontrado nos dados")
            
            print(f"Previsão individual para SKU: {sku}")
        else:  
            df_filtered = df.copy()
            print(f"Previsão agregada para {len(df_filtered)} registros")
            
        df_prophet = df_filtered[["Data", "Quantidade"]].copy()
        df_prophet = df_prophet.rename(columns={"Data": "ds", "Quantidade": "y"})
        
        print(f"📊 Dados preparados: {len(df_prophet)} pontos de dados")
        
        split_idx = int(len(df_prophet) * 0.8)
        train = df_prophet.iloc[:split_idx]
        test = df_prophet.iloc[split_idx:]

        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode="multiplicative",
            changepoint_prior_scale=0.05,
            holidays=br_holidays,
        )
        
        if len(df_prophet) >= 24:
            model.add_seasonality(name="monthly", period=periods, fourier_order=5)

        model.fit(train)
        
        if len(test) > 0:
            forecast_test = model.predict(test[['ds']])
            
            y_true = test['y'].values
            y_pred = forecast_test['yhat'].values
            
            metrics = {
                'WMAPE (%)': round(np.sum(np.abs(y_true - y_pred)) / np.sum(y_true) * 100, 2),
                'Bias': round(np.mean(y_pred - y_true), 2),
                'Bias (%)': round((np.sum(y_pred - y_true) / np.sum(y_true)) * 100, 2),
                'MAE': round(np.mean(np.abs(y_true - y_pred)), 2),
                'RMSE': round(np.sqrt(np.mean((y_true - y_pred) ** 2)), 2),
                'MAPE (%)': round(np.mean(np.abs((y_true - y_pred) / (y_true + 1e-10))) * 100, 2)
            }
            
            if not sku:
                test_df = test.copy()
                test_df['yhat'] = y_pred
                
                if all(col in df_filtered.columns for col in ['Familia', 'Processo', 'Classe_ABC']):
                    test_df = test_df.merge(
                        df_filtered[['Data', 'Familia', 'Processo', 'Classe_ABC']].rename(columns={'Data': 'ds'}),
                        on='ds',
                        how='left'
                    )
                    
                    from app.services.xgboost_service import XGBoostService
                    aggregated_metrics = XGBoostService.calculate_all_aggregations(
                        test_df,
                        y_true_col='y',
                        y_pred_col='yhat',
                        group_columns=['Familia', 'Processo', 'Classe_ABC']
                    )
                    
                    print("\n📊 Métricas Agregadas:")
                    print(f"Global WMAPE: {aggregated_metrics['global']['metrics_global']['WMAPE (%)']}%")
                    
                    for group_name, group_data in aggregated_metrics.items():
                        if group_name != 'global' and 'metrics_by_group' in group_data:
                            print(f"\n{group_name.upper()}:")
                            for item in group_data['metrics_by_group'][:5]:
                                print(f"  {item[group_data['group_column']]}: WMAPE = {item['WMAPE (%)']}%")
                    
                    metrics = aggregated_metrics
        else:
            metrics = None

        model.fit(df_prophet)
        future = model.make_future_dataframe(
            periods=periods, freq="MS", include_history=False
        )
        forecast = model.predict(future)

        forecast["yhat"] = forecast["yhat"].clip(lower=0)
        forecast["yhat_lower"] = forecast["yhat_lower"].clip(lower=0)
        forecast["yhat_upper"] = forecast["yhat_upper"].clip(lower=0)

        identifier = sku if sku else "aggregated"
        run_id = self.saver.save_forecast_run("Prophet", 1, identifier)
        time_elapsed = time.obter_tempo()

        print(f"✅ Previsão concluída em {time_elapsed:.2f}s")

        return run_id, forecast, time_elapsed, metrics

    def predict_all_skus(self, df, periods=12):
        # Lista de SKUs únicos em ordem crescente
        skus = np.sort(df["SKU"].unique())

        run_id = self.saver.save_forecast_run("Prophet", len(skus), None)

        print(f"Iniciando as previsões para {len(skus)} SKUs")

        forecasts = {}
        failed_skus = []

        # Loop para prever SKU a SKU
        for i, sku in enumerate(skus, 1):
            try:
                print(f"\n--- Processando SKU {i}/{len(skus)}: {sku} ---")
                forecast = ProphetService.make_prediction(
                    self, df, sku=sku, periods=periods
                )
                forecasts[sku] = forecast

            except Exception as e:
                failed_skus.append((sku, str(e)))
                continue  # Continuar com os demais SKUs

        # Relatório final
        print("\nProcesso concluído!")
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
    forecast_copy["yhat"] = np.expm1(forecast_copy["yhat"])
    forecast_copy["yhat_lower"] = np.expm1(forecast_copy["yhat_lower"])
    forecast_copy["yhat_upper"] = np.expm1(forecast_copy["yhat_upper"])

    return forecast_copy
