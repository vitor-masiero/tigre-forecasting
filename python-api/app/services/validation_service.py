import numpy as np
import pandas as pd
from app.data_processing.transformer import preprocess_data
from app.repository.query_repository import QueryRepository
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics


class ValidationService:
    @staticmethod
    def cv_sku(sku=None):
        # Busca dados apenas uma vez
        df_bruto = QueryRepository.get_unique_sku(sku)
        
        print("\n" + "🔍 DADOS BRUTOS DO BANCO")
        print("="*60)
        print(df_bruto.head(10))
        print(f"\nShape: {df_bruto.shape}")
        print(f"\nEstatísticas da coluna 'valor':")
        print(df_bruto["valor"].describe())
        print("="*60)

        # Preprocessa os dados
        df = preprocess_data(df_bruto)
        
        print("\n" + "✨ DADOS APÓS PREPROCESSAMENTO")
        print("="*60)
        print(df.head(10))
        print(f"\nShape: {df.shape}")
        print("="*60)
        
        # Comparação lado a lado
        print("\n" + "📊 COMPARAÇÃO: ANTES vs DEPOIS")
        print("="*60)
        comparison = pd.DataFrame({
            'Data': df['Data'].head(10),
            'Quantidade_Original': df_bruto['valor'].head(10).values,
            'Quantidade_Tratada': df['Quantidade'].head(10).values,
            'Diferença': df['Quantidade'].head(10).values - df_bruto['valor'].head(10).values
        })
        print(comparison)
        print("="*60)

        # Prepara para Prophet
        df_prophet = df[["Data", "Quantidade"]].copy()
        df_prophet = df_prophet.rename(columns={"Data": "ds", "Quantidade": "y"})
        
        # Verifica dados
        if df_prophet["y"].isna().any():
            print(f"⚠️  Aviso: {df_prophet['y'].isna().sum()} valores NaN encontrados")
            df_prophet = df_prophet.dropna()
        
        if (df_prophet["y"] < 0).any():
            print(f"⚠️  Aviso: Valores negativos encontrados. Convertendo para 0.")
            df_prophet["y"] = df_prophet["y"].clip(lower=0)

        print(f"\n📈 Treinando modelo Prophet...")
        print(f"   Período de dados: {df_prophet['ds'].min()} até {df_prophet['ds'].max()}")
        print(f"   Total de pontos: {len(df_prophet)}")

        # Treina modelo
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode="multiplicative",
            changepoint_prior_scale=0.05,
        )

        model.fit(df_prophet)

        print(f"\n🔄 Executando cross-validation...")
        
        # Cross-validation
        df_cv = cross_validation(
            model,
            initial="720 days",
            period="90 days",
            horizon="180 days",
            parallel="processes",
        )

        # Métricas
        df_metrics = performance_metrics(df_cv, rolling_window=1)
        
        # Calcula WMAPE
        wmape = ValidationService.calcular_wmape(df_cv)
        
        print(f"\n" + "="*60)
        print(f"📊 RESULTADO FINAL")
        print(f"="*60)
        print(f"WMAPE: {wmape:.2f}%")
        print(f"MAE: {df_metrics['mae'].mean():.2f}")
        print(f"RMSE: {df_metrics['rmse'].mean():.2f}")
        print(f"MAPE: {df_metrics['mape'].mean()*100:.2f}%")
        print("="*60 + "\n")

        return df_cv, df_metrics, wmape
    @staticmethod
    def calcular_wmape(df_cv):
        print('Wmape')
        """
        WMAPE = Σ|y_real - y_pred| / Σ|y_real| × 100
        """
        y_real = df_cv["y"].values
        y_pred = df_cv["yhat"].values
        
        # Remove zeros para evitar problemas
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