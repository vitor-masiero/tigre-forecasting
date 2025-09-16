from app.config.db_config import load_data_from_db
from app.data_processing.transformer import DataTransformer
from app.services.prophet_service import ProphetService
from app.utils.holiday import get_brazil_holidays
from app.services.validation_service import ValidationService
import pandas as pd
import numpy as np


df_raw = load_data_from_db()
df_processed = DataTransformer().preprocess(df_raw)

df_for_validation = df_processed.groupby('SKU').apply(
        lambda group: group[['Data', 'Quantidade']].rename(columns={
            'Data': 'ds',
            'Quantidade': 'y'
        }).reset_index(drop=True)
    ).reset_index(drop=True)

def main():
    
    df_prediction = ProphetService.make_prediction(df_processed, "84110001")
    print(df_prediction)

def test_holiday():
    print(get_brazil_holidays().head(40))

def wmape_validation():
    results = ValidationService.wmape_monthly_cv(df_for_validation, initial_months=24, horizon_months=6, period_months=3)
    if results and results['wmape']:
        print("📊 RESUMO ESTATÍSTICO:")
        print(f"WMAPE médio: {np.mean(results['wmape']):.2f}% ± {np.std(results['wmape']):.2f}%")
        print(f"WMAPE mínimo: {np.min(results['wmape']):.2f}%")
        print(f"WMAPE máximo: {np.max(results['wmape']):.2f}%")
        print(f"MAE médio: {np.mean(results['mae']):.2f}")
        print(f"RMSE médio: {np.mean(results['rmse']):.2f}")

if __name__ == "__main__":
    wmape_validation()

