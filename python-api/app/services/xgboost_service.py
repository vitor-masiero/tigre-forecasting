import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from app.repository.xgboost_repository import XGBoostRepository
from app.utils.time import Time
from sqlalchemy.orm import Session

class XGBoostService:
    def __init__(self, db_session: Session):
        self.db = db_session
        self.saver = XGBoostRepository(db_session)

    @staticmethod
    def enrich_features(df, target='Quantidade', date_col='Data', group_col=None):
        df = df.copy()
        df[date_col] = pd.to_datetime(df[date_col])
        df = df.sort_values(date_col).reset_index(drop=True)

        if group_col:
            group_obj = df.groupby(group_col)
        else:
            group_obj = [(None, df)]

        enriched_dfs = []

        for group_name, group_df in group_obj:
            g = group_df.copy()

            for lag in [1, 3, 6, 12]:
                g[f'lag_{lag}'] = g[target].shift(lag)

            for w in [3, 6, 12]:
                g[f'rolling_mean_{w}'] = g[target].shift(1).rolling(window=w, min_periods=1).mean()
                g[f'rolling_std_{w}'] = g[target].shift(1).rolling(window=w, min_periods=1).std()

            g['growth_rate_1'] = g[target].pct_change(1)
            g['growth_rate_3'] = g[target].pct_change(3)
            g['growth_rate_6'] = g[target].pct_change(6)

            g['year'] = g[date_col].dt.year
            g['month'] = g[date_col].dt.month
            g['quarter'] = g[date_col].dt.quarter
            g['day_of_year'] = g[date_col].dt.dayofyear
            g['week_of_year'] = g[date_col].dt.isocalendar().week.astype(int)

            g['month_sin'] = np.sin(2 * np.pi * g['month'] / 12)
            g['month_cos'] = np.cos(2 * np.pi * g['month'] / 12)
            g['quarter_sin'] = np.sin(2 * np.pi * g['quarter'] / 4)
            g['quarter_cos'] = np.cos(2 * np.pi * g['quarter'] / 4)

            feriados = [
                '01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25'
            ]
            g['is_holiday'] = g[date_col].dt.strftime('%m-%d').isin(feriados).astype(int)

            def rolling_trend(x, window=6):
                if len(x) < 2:
                    return 0
                y = np.array(x)
                X = np.arange(len(y))
                A = np.vstack([X, np.ones(len(X))]).T
                slope, _ = np.linalg.lstsq(A, y, rcond=None)[0]
                return slope

            g['trend_6'] = g[target].shift(1).rolling(window=6, min_periods=3).apply(rolling_trend, raw=False)

            g = g.fillna(method='bfill').fillna(0)

            enriched_dfs.append(g)
        
        df_enriched = pd.concat(enriched_dfs, ignore_index=True)
        return df_enriched

    @staticmethod
    def calculate_metrics(y_true, y_pred):
        y_true = np.array(y_true)
        y_pred = np.array(y_pred)
        
        wmape = np.sum(np.abs(y_true - y_pred)) / np.sum(y_true) * 100
        bias = np.mean(y_pred - y_true)
        bias_pct = (np.sum(y_pred - y_true) / np.sum(y_true)) * 100
        
        y_true_series = pd.Series(y_true)
        naive_forecast = y_true_series.shift(1).fillna(method='bfill')
        mae_model = np.mean(np.abs(y_true - y_pred))
        mae_naive = np.mean(np.abs(y_true - naive_forecast))
        fva = ((mae_naive - mae_model) / mae_naive) * 100 if mae_naive > 0 else 0
        
        mae = np.mean(np.abs(y_true - y_pred))
        rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))
        mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1e-10))) * 100
        
        return {
            'WMAPE (%)': round(wmape, 2),
            'Bias': round(bias, 2),
            'Bias (%)': round(bias_pct, 2),
            'FVA (%)': round(fva, 2),
            'MAE': round(mae, 2),
            'RMSE': round(rmse, 2),
            'MAPE (%)': round(mape, 2)
        }

    def make_prediction(self, df, sku=None, periods=12, outlier_method='iqr', outlier_threshold=1.5, time=None, aggregation_info=None):
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

        if outlier_method != 'none':
            df_filtered = self._remove_outliers(df_filtered, method=outlier_method, threshold=outlier_threshold)
            
        print(f"📊 Dados preparados: {len(df_filtered)} pontos de dados")

        df_enriched = self.enrich_features(df_filtered, target='Quantidade', date_col='Data')
        
        split_date = df_enriched['Data'].quantile(0.8)
        train = df_enriched[df_enriched['Data'] < split_date]
        test = df_enriched[df_enriched['Data'] >= split_date]

        feature_cols = [col for col in df_enriched.columns 
                        if col not in ['Data', 'SKU', 'Quantidade', 'Familia', 'Processo', 'Classe_ABC', 
                                      'Percentual_Acumulado', 'Quantidade_Total']]

        X_train = train[feature_cols]
        y_train = train['Quantidade']
        X_test = test[feature_cols]
        y_test = test['Quantidade']

        model = XGBRegressor(
            n_estimators=300,
            learning_rate=0.04,
        )

        model.fit(X_train, y_train, eval_set=[(X_train, y_train), (X_test, y_test)], verbose=False)

        y_pred_test = model.predict(X_test)
        metrics = self.calculate_metrics(y_test, y_pred_test)

        last_date = df_enriched['Data'].max()
        future_dates = pd.date_range(start=last_date + pd.DateOffset(months=1), periods=periods, freq='MS')
        
        last_row = df_enriched[feature_cols + ['Data', 'Quantidade']].iloc[-1:].copy()
        
        future_predictions = []
        
        for i in range(periods):
            future_row = last_row.copy()
            future_row['Data'] = future_dates[i]
            
            future_row['year'] = future_row['Data'].dt.year
            future_row['month'] = future_row['Data'].dt.month
            future_row['quarter'] = future_row['Data'].dt.quarter
            future_row['day_of_year'] = future_row['Data'].dt.dayofyear
            future_row['week_of_year'] = future_row['Data'].dt.isocalendar().week.astype(int)
            future_row['month_sin'] = np.sin(2 * np.pi * future_row['month'] / 12)
            future_row['month_cos'] = np.cos(2 * np.pi * future_row['month'] / 12)
            future_row['quarter_sin'] = np.sin(2 * np.pi * future_row['quarter'] / 4)
            future_row['quarter_cos'] = np.cos(2 * np.pi * future_row['quarter'] / 4)
            
            feriados = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25']
            future_row['is_holiday'] = future_row['Data'].dt.strftime('%m-%d').isin(feriados).astype(int)
            
            X_future = future_row[feature_cols]
            pred = model.predict(X_future)[0]
            
            future_predictions.append({
                'ds': future_dates[i],
                'yhat': max(0, pred)
            })
            
            future_row['Quantidade'] = pred
            last_row = future_row

        forecast_data = pd.DataFrame(future_predictions)

        identifier = sku if sku else "aggregated"
        run_id = self.saver.save_forecast_run("XGBoost", 1, identifier)
        
        if sku:
            self.saver.salvar_metricas_sku(
                sku=sku,
                ds_modelo="XGBoost",
                wmape=metrics['WMAPE (%)'],
                bias=metrics['Bias'],
                bias_pct=metrics['Bias (%)'],
                fva=metrics['FVA (%)'],
                mae=metrics['MAE'],
                rmse=metrics['RMSE'],
                mape=metrics['MAPE (%)'],
                n_estimators=300,
                learning_rate=0.04
            )

        time_elapsed = time.obter_tempo()
        print(f"✅ Previsão concluída em {time_elapsed:.2f}s")

        return run_id, forecast_data, time_elapsed

    def predict_all_skus(self, df, periods=12, outlier_method='iqr', outlier_threshold=1.5):
        skus = np.sort(df["SKU"].unique())

        run_id = self.saver.save_forecast_run("XGBoost", len(skus), None)

        print(f"Iniciando as previsões para {len(skus)} SKUs")

        forecasts = {}
        failed_skus = []

        for i, sku in enumerate(skus, 1):
            try:
                print(f"\n--- Processando SKU {i}/{len(skus)}: {sku} ---")
                forecast = self.make_prediction(
                    df, sku=sku, periods=periods, 
                    outlier_method=outlier_method, 
                    outlier_threshold=outlier_threshold
                )
                forecasts[sku] = forecast

            except Exception as e:
                failed_skus.append((sku, str(e)))
                continue

        print("\nProcesso concluído!")
        print(f"SKUs processados com sucesso: {len(forecasts)}")
        print(f"SKUs com falha: {len(failed_skus)}")

        if failed_skus:
            print("\nSKUs com falha:")
            for sku, error in failed_skus:
                print(f"  - {sku}: {error}")

        return run_id, failed_skus

    def _remove_outliers(self, df, method='iqr', threshold=1.5):
        df_clean = df.copy()
        
        if method == 'iqr':
            Q1 = df_clean['Quantidade'].quantile(0.25)
            Q3 = df_clean['Quantidade'].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - threshold * IQR
            upper_bound = Q3 + threshold * IQR
            df_clean = df_clean[(df_clean['Quantidade'] >= lower_bound) & (df_clean['Quantidade'] <= upper_bound)]
            
        elif method == 'zscore':
            z_scores = np.abs((df_clean['Quantidade'] - df_clean['Quantidade'].mean()) / df_clean['Quantidade'].std())
            df_clean = df_clean[z_scores < threshold]
            
        elif method == 'percentile':
            lower = df_clean['Quantidade'].quantile(threshold / 100)
            upper = df_clean['Quantidade'].quantile(1 - threshold / 100)
            df_clean = df_clean[(df_clean['Quantidade'] >= lower) & (df_clean['Quantidade'] <= upper)]
            
        elif method == 'mad':
            median = df_clean['Quantidade'].median()
            mad = np.median(np.abs(df_clean['Quantidade'] - median))
            modified_z_scores = 0.6745 * (df_clean['Quantidade'] - median) / mad
            df_clean = df_clean[np.abs(modified_z_scores) < threshold]
        
        print(f"🧹 Outliers removidos: {len(df) - len(df_clean)} pontos ({method})")
        return df_clean