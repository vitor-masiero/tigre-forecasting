
from app.data_processing.transformer import DataTransformer
from app.services.prophet_service import ProphetService
from app.utils.holiday import get_brazil_holidays
from app.services.validation_service import ValidationService
from app.repository.query_repository import QueryRepository
import pandas as pd
import numpy as np
import sqlalchemy

df_processed = DataTransformer().preprocess(
    QueryRepository.get_all_skus()
)

def main():
    df_prediction = ProphetService.predict_all_skus(
        df_processed, periods=12
    )
    print(df_prediction)

def test_holiday():
    print(get_brazil_holidays().head(40))

def wmape_validation():
    results = ValidationService.wmape_individual_sku(
        QueryRepository.get_validation_data(),
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
    from app.config.db_config import Base
    from app.config.db_config import DatabaseConfig
    
    from app.models.previsao import Previsao
    from app.models.sku import Sku
    from app.models.ponto_previsao import PontosPrevisao

    with DatabaseConfig.get_db_connection() as engine:
        Base.metadata.create_all(engine)
        inspector = sqlalchemy.inspect(engine)
        tables = inspector.get_table_names()
        print("Tabelas no banco:", tables)

