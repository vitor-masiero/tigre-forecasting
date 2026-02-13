import numpy as np
import pandas as pd
from xgboost import XGBRegressor
from app.repository.xgboost_repository import XGBoostRepository
from app.utils.time import Time
from app.utils.incc import get_incc_with_forecast
from app.utils.selic import get_selic_with_forecast
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.feature_metadata import FeatureMetadata


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

            g = g.replace([np.inf, -np.inf], np.nan).fillna(0)

            enriched_dfs.append(g)
        
        df_enriched = pd.concat(enriched_dfs, ignore_index=True)
        return df_enriched

    @staticmethod
    def add_external_regressors(df, date_col='Data'):
        df = df.copy()
        df[date_col] = pd.to_datetime(df[date_col])
        
        max_date = df[date_col].max() + pd.DateOffset(months=24)
        
        incc_data = get_incc_with_forecast(end_date=max_date, forecast_periods=730)
        selic_data = get_selic_with_forecast(end_date=max_date)
        
        incc_data['ds'] = pd.to_datetime(incc_data['ds'])
        selic_data['ds'] = pd.to_datetime(selic_data['ds'])
        
        df['year_month'] = df[date_col].dt.to_period('M')
        incc_data['year_month'] = incc_data['ds'].dt.to_period('M')
        selic_data['year_month'] = selic_data['ds'].dt.to_period('M')
        
        incc_monthly = incc_data.groupby('year_month')['incc'].mean().reset_index()
        selic_monthly = selic_data.groupby('year_month')['selic'].mean().reset_index()
        
        df = df.merge(incc_monthly, on='year_month', how='left')
        df = df.merge(selic_monthly, on='year_month', how='left')
        
        df['incc'] = df['incc'].fillna(method='ffill')
        df['selic'] = df['selic'].fillna(method='ffill')
        
        df = df.drop('year_month', axis=1)
        
        print(f"✅ Variáveis externas adicionadas: INCC e SELIC")
        
        return df
    
    def add_custom_features(self, df, date_col='Data'):
        df = df.copy()
        df[date_col] = pd.to_datetime(df[date_col])
        
        # Busca todas as features disponíveis
        features = self.db.query(FeatureMetadata).all()
        
        if not features:
            print("⚠️ Nenhuma feature externa encontrada no banco")
            return df
        
        print(f"🔍 Encontradas {len(features)} features externas")
        
        for feature in features:
            try:
                # Lê a tabela de feature do banco
                query = text(f"SELECT * FROM {feature.table_name}")
                feature_df = pd.read_sql(query, self.db.bind)
                
                # Normaliza a coluna de data
                feature_df['date'] = pd.to_datetime(feature_df['date'])
                
                # Cria year_month para merge
                df['year_month'] = df[date_col].dt.to_period('M')
                feature_df['year_month'] = feature_df['date'].dt.to_period('M')
                
                # Agrupa por mês (caso tenha múltiplos valores)
                value_cols = [col for col in feature_df.columns if col not in ['date', 'year_month']]
                
                for col in value_cols:
                    feature_monthly = feature_df.groupby('year_month')[col].mean().reset_index()
                    feature_monthly.rename(columns={col: f"{feature.feature_name}_{col}"}, inplace=True)
                    
                    # Merge com o dataframe principal
                    df = df.merge(feature_monthly, on='year_month', how='left')
                    
                    # Preenche valores faltantes
                    df[f"{feature.feature_name}_{col}"] = df[f"{feature.feature_name}_{col}"].fillna(method='ffill')
                
                print(f"✅ Feature '{feature.feature_name}' adicionada com sucesso")
                
            except Exception as e:
                print(f"⚠️ Erro ao adicionar feature '{feature.feature_name}': {str(e)}")
                continue
        
        # Remove coluna auxiliar
        df = df.drop('year_month', axis=1)
        
        return df
    def get_future_custom_features(self, future_date, df_enriched):
        """Busca valores de features externas para uma data futura."""
        features = self.db.query(FeatureMetadata).all()
        feature_values = {}
        
        for feature in features:
            try:
                query = text(f"""
                    SELECT * FROM {feature.table_name} 
                    WHERE date <= :future_date 
                    ORDER BY date DESC 
                    LIMIT 1
                """)
                result = self.db.execute(query, {"future_date": future_date}).fetchone()
                
                if result:
                    # Usa _mapping para acessar as colunas corretamente
                    result_dict = dict(result._mapping)
                    for col, value in result_dict.items():
                        if col != 'date':
                            feature_values[f"{feature.feature_name}_{col}"] = value
                else:
                    # NÃO encontrou dados futuros, usa último valor histórico
                    for col in feature.columns:
                        if col != 'date':
                            feature_col_name = f"{feature.feature_name}_{col}"
                            if feature_col_name in df_enriched.columns:
                                feature_values[feature_col_name] = df_enriched[feature_col_name].iloc[-1]
                            else:
                                feature_values[feature_col_name] = 0
                                
            except Exception as e:
                # Em caso de erro, usa último valor histórico como fallback
                for col in feature.columns:
                    if col != 'date':
                        feature_col_name = f"{feature.feature_name}_{col}"
                        if feature_col_name in df_enriched.columns:
                            feature_values[feature_col_name] = df_enriched[feature_col_name].iloc[-1]
                        else:
                            feature_values[feature_col_name] = 0
        
        return feature_values

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

    @staticmethod
    def calculate_metrics_aggregated(df, y_true_col='y', y_pred_col='yhat', group_by=None):
        if group_by is None:
            y_true = df[y_true_col].values
            y_pred = df[y_pred_col].values
            metrics = XGBoostService.calculate_metrics(y_true, y_pred)
            
            return {
                'metrics_global': metrics,
                'total_observations': len(df)
            }
        
        else:
            if group_by not in df.columns:
                raise ValueError(f"Coluna '{group_by}' não encontrada no DataFrame")
            
            results = []
            
            for group_name, group_df in df.groupby(group_by):
                y_true = group_df[y_true_col].values
                y_pred = group_df[y_pred_col].values
                metrics = XGBoostService.calculate_metrics(y_true, y_pred)
                
                results.append({
                    group_by: group_name,
                    **metrics,
                    'n_observations': len(group_df)
                })
            
            results_df = pd.DataFrame(results).sort_values('WMAPE (%)', ascending=False)
            
            y_true_all = df[y_true_col].values
            y_pred_all = df[y_pred_col].values
            metrics_global = XGBoostService.calculate_metrics(y_true_all, y_pred_all)
            
            return {
                'metrics_by_group': results_df.to_dict('records'),
                'metrics_global': metrics_global,
                'group_column': group_by
            }

    @staticmethod
    def calculate_all_aggregations(df, y_true_col='y', y_pred_col='yhat', group_columns=None):
        if group_columns is None:
            group_columns = ['Familia', 'Processo', 'Classe_ABC']
        
        results = {}
        
        results['global'] = XGBoostService.calculate_metrics_aggregated(
            df, y_true_col, y_pred_col, group_by=None
        )
        
        for col in group_columns:
            if col in df.columns:
                results[col.lower()] = XGBoostService.calculate_metrics_aggregated(
                    df, y_true_col, y_pred_col, group_by=col
                )
        
        return results

    @staticmethod
    def calculate_trend(forecast_df):
        if len(forecast_df) < 2:
            return {
                'slope': 0,
                'direction': 'stable',
                'percentage_change': 0
            }
        
        y = forecast_df['yhat'].values
        X = np.arange(len(y))
        A = np.vstack([X, np.ones(len(X))]).T
        slope, intercept = np.linalg.lstsq(A, y, rcond=None)[0]
        
        first_value = y[0]
        last_value = y[-1]
        percentage_change = ((last_value - first_value) / first_value * 100) if first_value != 0 else 0
        
        if slope > 0.01:
            direction = 'crescente'
        elif slope < -0.01:
            direction = 'decrescente'
        else:
            direction = 'estável'
        
        return {
            'slope': round(float(slope), 4),
            'direction': direction,
            'percentage_change': round(float(percentage_change), 2),
            'first_value': round(float(first_value), 2),
            'last_value': round(float(last_value), 2)
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
            print(f"Previsão agregada para {len(df_filtered)} registros")

        if outlier_method != 'none':
            df_filtered = self._remove_outliers(df_filtered, method=outlier_method, threshold=outlier_threshold)
            
        print(f"📊 Dados preparados: {len(df_filtered)} pontos de dados")

        df_enriched = self.enrich_features(df_filtered, target='Quantidade', date_col='Data')
        df_enriched = self.add_external_regressors(df_enriched, date_col='Data')
        df_enriched = self.add_custom_features(df_enriched, date_col='Data')

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
            n_estimators=1500,
            learning_rate=0.03,
            max_depth=5,
            early_stopping_rounds=50,
            random_state=42,
        )

        model.fit(X_train, y_train, eval_set=[(X_train, y_train), (X_test, y_test)], verbose=False)

        y_pred_test = model.predict(X_test)
        metrics = self.calculate_metrics(y_test, y_pred_test)
        
        feature_importance = pd.DataFrame({
            'feature': feature_cols,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        feature_importance['importance_pct'] = (feature_importance['importance'] / feature_importance['importance'].sum() * 100).round(2)
        
        print("\n📊 Top 10 Features mais importantes:")
        for idx, row in feature_importance.head(10).iterrows():
            print(f"  {row['feature']}: {row['importance_pct']}%")

        last_date = df_enriched['Data'].max()
        future_dates = pd.date_range(start=last_date + pd.DateOffset(months=1), periods=periods, freq='MS')
        
        max_future_date = future_dates[-1]
        incc_future = get_incc_with_forecast(end_date=max_future_date, forecast_periods=730)
        selic_future = get_selic_with_forecast(end_date=max_future_date)
        
        incc_future['ds'] = pd.to_datetime(incc_future['ds'])
        selic_future['ds'] = pd.to_datetime(selic_future['ds'])
        incc_future['year_month'] = incc_future['ds'].dt.to_period('M')
        selic_future['year_month'] = selic_future['ds'].dt.to_period('M')
        
        incc_monthly = incc_future.groupby('year_month')['incc'].mean().to_dict()
        selic_monthly = selic_future.groupby('year_month')['selic'].mean().to_dict()
        
        historical_quantities = df_enriched['Quantidade'].tolist()
        future_predictions = []

        for i in range(periods):
            future_date = future_dates[i]
            year_month = future_date.to_period('M')
            
            lag_1 = historical_quantities[-1] if len(historical_quantities) >= 1 else 0
            lag_3 = historical_quantities[-3] if len(historical_quantities) >= 3 else 0
            lag_6 = historical_quantities[-6] if len(historical_quantities) >= 6 else 0
            lag_12 = historical_quantities[-12] if len(historical_quantities) >= 12 else 0
            
            recent_3 = historical_quantities[-3:] if len(historical_quantities) >= 3 else historical_quantities
            recent_6 = historical_quantities[-6:] if len(historical_quantities) >= 6 else historical_quantities
            recent_12 = historical_quantities[-12:] if len(historical_quantities) >= 12 else historical_quantities
            
            rolling_mean_3 = np.mean(recent_3) if len(recent_3) > 0 else 0
            rolling_mean_6 = np.mean(recent_6) if len(recent_6) > 0 else 0
            rolling_mean_12 = np.mean(recent_12) if len(recent_12) > 0 else 0
            
            rolling_std_3 = np.std(recent_3) if len(recent_3) > 1 else 0
            rolling_std_6 = np.std(recent_6) if len(recent_6) > 1 else 0
            rolling_std_12 = np.std(recent_12) if len(recent_12) > 1 else 0
            
            growth_rate_1 = (lag_1 - historical_quantities[-2]) / historical_quantities[-2] if len(historical_quantities) >= 2 and historical_quantities[-2] != 0 else 0
            growth_rate_3 = (lag_1 - historical_quantities[-4]) / historical_quantities[-4] if len(historical_quantities) >= 4 and historical_quantities[-4] != 0 else 0
            growth_rate_6 = (lag_1 - historical_quantities[-7]) / historical_quantities[-7] if len(historical_quantities) >= 7 and historical_quantities[-7] != 0 else 0
            
            if len(recent_6) >= 3:
                y = np.array(recent_6)
                X = np.arange(len(y))
                A = np.vstack([X, np.ones(len(X))]).T
                trend_6, _ = np.linalg.lstsq(A, y, rcond=None)[0]
            else:
                trend_6 = 0
            
            year = future_date.year
            month = future_date.month
            quarter = (month - 1) // 3 + 1
            day_of_year = future_date.dayofyear
            week_of_year = future_date.isocalendar()[1]
            
            month_sin = np.sin(2 * np.pi * month / 12)
            month_cos = np.cos(2 * np.pi * month / 12)
            quarter_sin = np.sin(2 * np.pi * quarter / 4)
            quarter_cos = np.cos(2 * np.pi * quarter / 4)
            
            feriados = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25']
            is_holiday = 1 if future_date.strftime('%m-%d') in feriados else 0
            
            incc_value = incc_monthly.get(year_month, df_enriched['incc'].iloc[-1])
            selic_value = selic_monthly.get(year_month, df_enriched['selic'].iloc[-1])

            # Busca valores das features customizadas para a data futura
            custom_features = self.get_future_custom_features(future_date, df_enriched)

            # Cria dicionário base com todas as features
            future_data = {
                'lag_1': lag_1,
                'lag_3': lag_3,
                'lag_6': lag_6,
                'lag_12': lag_12,
                'rolling_mean_3': rolling_mean_3,
                'rolling_mean_6': rolling_mean_6,
                'rolling_mean_12': rolling_mean_12,
                'rolling_std_3': rolling_std_3,
                'rolling_std_6': rolling_std_6,
                'rolling_std_12': rolling_std_12,
                'growth_rate_1': growth_rate_1,
                'growth_rate_3': growth_rate_3,
                'growth_rate_6': growth_rate_6,
                'year': year,
                'month': month,
                'quarter': quarter,
                'day_of_year': day_of_year,
                'week_of_year': week_of_year,
                'month_sin': month_sin,
                'month_cos': month_cos,
                'quarter_sin': quarter_sin,
                'quarter_cos': quarter_cos,
                'is_holiday': is_holiday,
                'trend_6': trend_6,
                'incc': incc_value,
                'selic': selic_value
            }

            # Adiciona as custom features ao dicionário
            future_data.update(custom_features)

            # Cria o DataFrame
            future_row = pd.DataFrame([future_data])
            
            X_future = future_row[feature_cols]
            pred = model.predict(X_future)[0]
            pred = max(0, pred)
            
            future_predictions.append({
                'ds': future_date,
                'yhat': pred
            })
            
            historical_quantities.append(pred)

        forecast_data = pd.DataFrame(future_predictions)
        
        trend_info = self.calculate_trend(forecast_data)

        identifier = sku if sku else "aggregated"
        if 'SKU' in df_filtered.columns:
            num_skus = int(df_filtered['SKU'].nunique())
        else:
            num_skus = 1
        run_id = self.saver.save_forecast_run("XGBoost", num_skus, identifier)
        
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
        else:
            test_df = test.copy()
            test_df['yhat'] = y_pred_test
            test_df['y'] = y_test.values
            
            aggregated_metrics = self.calculate_all_aggregations(
                test_df, 
                y_true_col='y', 
                y_pred_col='yhat',
                group_columns=['Familia', 'Processo', 'Classe_ABC'] if all(col in test_df.columns for col in ['Familia', 'Processo', 'Classe_ABC']) else None
            )
            
            print("\n📊 Métricas Agregadas:")
            print(f"Global WMAPE: {aggregated_metrics['global']['metrics_global']['WMAPE (%)']}%")
            
            for group_name, group_data in aggregated_metrics.items():
                if group_name != 'global' and 'metrics_by_group' in group_data:
                    print(f"\n{group_name.upper()}:")
                    for item in group_data['metrics_by_group'][:5]:
                        print(f"  {item[group_data['group_column']]}: WMAPE = {item['WMAPE (%)']}%")

        time_elapsed = time.obter_tempo()
        print(f"✅ Previsão concluída em {time_elapsed:.2f}s")
        
        result_metrics = metrics if sku else aggregated_metrics
        result_metrics['feature_importance'] = feature_importance.to_dict('records')
        result_metrics['trend'] = trend_info

        return run_id, forecast_data, time_elapsed, result_metrics

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
            std = df_clean['Quantidade'].std()
            if std == 0 or np.isnan(std):
                return df_clean
            z_scores = np.abs((df_clean['Quantidade'] - df_clean['Quantidade'].mean()) / std)
            df_clean = df_clean[z_scores < threshold]
            
        elif method == 'percentile':
            lower = df_clean['Quantidade'].quantile(threshold / 100)
            upper = df_clean['Quantidade'].quantile(1 - threshold / 100)
            df_clean = df_clean[(df_clean['Quantidade'] >= lower) & (df_clean['Quantidade'] <= upper)]
            
        elif method == 'mad':
            median = df_clean['Quantidade'].median()
            mad = np.median(np.abs(df_clean['Quantidade'] - median))
            if mad == 0:
                return df_clean
            modified_z_scores = 0.6745 * (df_clean['Quantidade'] - median) / mad
            df_clean = df_clean[np.abs(modified_z_scores) < threshold]
        
        print(f"🧹 Outliers removidos: {len(df) - len(df_clean)} pontos ({method})")
        return df_clean
    def apply_filters(self, df, familia=None, processo=None, abc_class=None):
        df_filtered = df.copy()
        
        if familia:
            df_filtered = df_filtered[df_filtered['Familia'].isin(familia)]
        
        if processo:
            df_filtered = df_filtered[df_filtered['Processo'].isin(processo)]
        
        if abc_class:
            df_filtered = df_filtered[df_filtered['Classe_ABC'].isin(abc_class)]
        
        return df_filtered