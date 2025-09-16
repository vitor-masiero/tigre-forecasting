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
        lambda group: group[['SKU', 'Data', 'Quantidade']].rename(columns={
            'Data': 'ds',
            'Quantidade': 'y',
            'SKU' : 'sku'
        }).reset_index(drop=True)
    ).reset_index(drop=True)

def main():
    
    df_prediction = ProphetService.make_prediction(df_processed, "84110001")
    print(df_prediction)

def test_holiday():
    print(get_brazil_holidays().head(40))

def wmape_validation():
    results = ValidationService.wmape_individual_sku(
        df_for_validation,
        "84110001",
        initial_months=24, 
        horizon_months=12, 
        period_months=3
    )

    if results:
        print(f"WMAPE médio: {results['wmape_medio']:.2f}%")
        for fold in results['folds']:
            print(f"Fold {fold['fold']}: {fold['wmape']:.2f}%")

if __name__ == "__main__":
    wmape_validation()

