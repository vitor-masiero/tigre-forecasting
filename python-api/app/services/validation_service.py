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