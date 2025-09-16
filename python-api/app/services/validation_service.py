from app.services.prophet_service import ProphetService
import numpy as np
import pandas as pd

class ValidationService:

    def wmape(y_true, y_pred):
        """
        Weighted Mean Absolute Percentage Error
        """
        y_true, y_pred = np.array(y_true), np.array(y_pred)
        return np.sum(np.abs(y_true - y_pred)) / np.sum(y_true) * 100
    
    def wmape_monthly_cv(df, initial_months=24, horizon_months=12, period_months=3):

        df = df.sort_values('ds').reset_index(drop=True)
        total_months = len(df)

        min_required = initial_months + horizon_months
        if total_months < min_required:
            print(f"❌ ERRO: Precisa de pelo menos {min_required} meses, mas só tem {total_months}")
            return None

        remaining_months = total_months - initial_months
        max_folds = max(0, (remaining_months - horizon_months) // period_months + 1)
        
        if max_folds == 0:
            print(f"❌ ERRO: Não é possível criar nenhum fold com os parâmetros atuais")
            return None
        
        print(f"✅ Número de folds possíveis: {max_folds}")
        print()

        results = {
            'fold': [],
            'train_start': [],
            'train_end': [],
            'test_start': [],
            'test_end': [],
            'train_months': [],
            'test_months': [],
            'wmape': [],
            'mae': [],
            'rmse': [],
            'mape': []
        }

        # Executar folds
        for fold in range(max_folds):
            try:
                # Calcular índices
                train_start_idx = 0
                train_end_idx = initial_months + (fold * period_months) - 1
                test_start_idx = train_end_idx + 1
                test_end_idx = test_start_idx + horizon_months - 1
                
                # Verificar se ainda temos dados suficientes
                if test_end_idx >= total_months:
                    print(f"⚠️  Fold {fold + 1}: Não há dados suficientes para teste completo")
                    break
                
                # Dividir dados
                train_data = df.iloc[train_start_idx:train_end_idx + 1].copy()
                test_data = df.iloc[test_start_idx:test_end_idx + 1].copy()

                forecast = ProphetService.make_prediction(test_data, periods=len(test_data))

                # Pegar apenas as previsões do período de teste
                test_predictions = forecast.iloc[-len(test_data):]['yhat'].values
                test_actual = test_data['y'].values
                
                # Calcular métricas
                fold_wmape = ValidationService.wmape(test_actual, test_predictions)
                fold_mae = np.mean(np.abs(test_actual - test_predictions))
                fold_rmse = np.sqrt(np.mean((test_actual - test_predictions) ** 2))
                
                # MAPE tradicional (cuidado com divisão por zero)
                mape_values = np.abs((test_actual - test_predictions) / np.where(test_actual == 0, 1, test_actual))
                fold_mape = np.mean(mape_values) * 100


                results['fold'].append(fold + 1)
                results['train_start'].append(train_data['ds'].iloc[0])
                results['train_end'].append(train_data['ds'].iloc[-1])
                results['test_start'].append(test_data['ds'].iloc[0])
                results['test_end'].append(test_data['ds'].iloc[-1])
                results['train_months'].append(len(train_data))
                results['test_months'].append(len(test_data))
                results['wmape'].append(fold_wmape)
                results['mae'].append(fold_mae)
                results['rmse'].append(fold_rmse)
                results['mape'].append(fold_mape)
                
                # Mostrar resultados do fold
                print(f"✅ Fold {fold + 1}:")
                print(f"   Treino: {train_data['ds'].iloc[0].strftime('%b/%Y')} a {train_data['ds'].iloc[-1].strftime('%b/%Y')} ({len(train_data)} meses)")
                print(f"   Teste:  {test_data['ds'].iloc[0].strftime('%b/%Y')} a {test_data['ds'].iloc[-1].strftime('%b/%Y')} ({len(test_data)} meses)")
                print(f"   WMAPE: {fold_wmape:.2f}%")
                print(f"   MAE: {fold_mae:.2f}")
                print(f"   RMSE: {fold_rmse:.2f}")
                print(f"   MAPE: {fold_mape:.2f}%")
                print()
                
            except Exception as e:
                print(f"❌ Erro no Fold {fold + 1}: {str(e)}")
                continue
        
        return results
    
    def wmape_individual_sku(df, sku_code, initial_months=24, horizon_months=12, period_months=3):
        """
        Calcula WMAPE para um SKU específico usando Time Series Cross Validation
        """
        
        # Filtrar apenas o SKU específico
        df_sku = df[df['sku'] == sku_code].copy()
        
        if df_sku.empty:
            print(f"❌ SKU '{sku_code}' não encontrado")
            return None
        
        # Preparar dados
        df_sku = df_sku.sort_values('ds').reset_index(drop=True)
        total_months = len(df_sku)
        
        print(f"📊 SKU {sku_code}: {total_months} meses de dados")
        
        # Validar se temos dados suficientes
        min_required = initial_months + horizon_months
        if total_months < min_required:
            print(f"❌ Precisa de {min_required} meses, tem apenas {total_months}")
            return None
        
        # Calcular folds possíveis
        remaining_months = total_months - initial_months
        max_folds = max(0, (remaining_months - horizon_months) // period_months + 1)
        
        if max_folds == 0:
            print(f"❌ Não é possível criar folds com os parâmetros atuais")
            return None
        
        # Estrutura de resultados
        results = {
            'sku': sku_code,
            'total_months': total_months,
            'folds': [],
            'wmape_medio': 0,
            'mae_medio': 0,
            'rmse_medio': 0
        }
        
        # Executar folds
        for fold in range(max_folds):
            try:
                # Calcular índices
                train_end_idx = initial_months + (fold * period_months) - 1
                test_start_idx = train_end_idx + 1
                test_end_idx = test_start_idx + horizon_months - 1
                
                if test_end_idx >= total_months:
                    break
                
                # Dividir dados
                train_data = df_sku.iloc[:train_end_idx + 1].copy()
                test_data = df_sku.iloc[test_start_idx:test_end_idx + 1].copy()
                
                # Fazer previsão
                forecast = ProphetService.make_prediction(train_data, periods=len(test_data))
                
                # ✅ CORREÇÃO 1: Extrair previsões ANTES de qualquer manipulação
                # Pegar apenas as previsões futuras (últimas len(test_data) linhas)
                forecast_future = forecast.tail(len(test_data)).copy()
                
                # ✅ CORREÇÃO 2: Validar alinhamento de datas
                expected_dates = test_data['ds'].tolist()
                actual_dates = forecast_future['ds'].tolist()
                
                if expected_dates != actual_dates:
                    print(f"⚠️  AVISO Fold {fold + 1}: Datas não batem perfeitamente")
                    print(f"   Esperado: {expected_dates[:3]} ... {expected_dates[-3:]}")
                    print(f"   Forecast: {actual_dates[:3]} ... {actual_dates[-3:]}")
                    
                    # Forçar alinhamento por índice de data
                    forecast_future = forecast_future.set_index('ds').reindex(test_data['ds']).reset_index()
                    
                    # Verificar se há NaNs após reindex
                    if forecast_future['yhat'].isna().any():
                        print(f"❌ Erro Fold {fold + 1}: Datas não conseguem ser alinhadas")
                        continue
                
                # ✅ CORREÇÃO 3: Aplicar floor apenas nas previsões de teste
                test_predictions = forecast_future['yhat'].clip(lower=0).values
                test_actual = test_data['y'].values
                
                # ✅ CORREÇÃO 4: Validar se não há NaNs
                if np.isnan(test_predictions).any() or np.isnan(test_actual).any():
                    print(f"❌ Erro Fold {fold + 1}: Valores NaN encontrados")
                    continue
                
                # Calcular métricas
                fold_wmape = ValidationService.wmape(test_actual, test_predictions)
                fold_mae = np.mean(np.abs(test_actual - test_predictions))
                fold_rmse = np.sqrt(np.mean((test_actual - test_predictions) ** 2))
                
                # Debug (opcional - remover em produção)
                print(f"🔍 DEBUG Fold {fold + 1}:")
                print(f"   Volume real: {test_actual.sum():.1f}")
                print(f"   Volume previsto: {test_predictions.sum():.1f}")
                print(f"   Primeiros 3 reais: {test_actual[:3]}")
                print(f"   Primeiros 3 previstos: {test_predictions[:3]}")
                
                # Armazenar resultado do fold
                fold_result = {
                    'fold': fold + 1,
                    'train_period': f"{train_data['ds'].iloc[0].strftime('%b/%Y')} - {train_data['ds'].iloc[-1].strftime('%b/%Y')}",
                    'test_period': f"{test_data['ds'].iloc[0].strftime('%b/%Y')} - {test_data['ds'].iloc[-1].strftime('%b/%Y')}",
                    'wmape': fold_wmape,
                    'mae': fold_mae,
                    'rmse': fold_rmse,
                    'volume_real': test_actual.sum(),
                    'volume_previsto': test_predictions.sum()
                }
                
                results['folds'].append(fold_result)
                
                print(f"✅ Fold {fold + 1}: WMAPE {fold_wmape:.2f}% | MAE {fold_mae:.2f}")
                
            except Exception as e:
                print(f"❌ Erro no Fold {fold + 1}: {str(e)}")
                continue
        
        # Calcular médias
        if results['folds']:
            results['wmape_medio'] = np.mean([f['wmape'] for f in results['folds']])
            results['mae_medio'] = np.mean([f['mae'] for f in results['folds']])
            results['rmse_medio'] = np.mean([f['rmse'] for f in results['folds']])
            
            print(f"\n📊 RESUMO SKU {sku_code}:")
            print(f"   WMAPE médio: {results['wmape_medio']:.2f}%")
            print(f"   MAE médio: {results['mae_medio']:.2f}")
            print(f"   RMSE médio: {results['rmse_medio']:.2f}")
        
        return results