from app.config.db_config import load_data_from_db
from app.data_processing.transformer import DataTransformer
from app.services.prophet_service import make_prediction
from app.utils.holiday import get_brazil_holidays
import pandas as pd

transformer = DataTransformer()

def main():
    # Carregar dados
    df_raw = load_data_from_db()
    df_processed = transformer.preprocess(df_raw)
    df_prediction = make_prediction(df_processed, "84110001")
    print(df_prediction)

def test_holiday():
    print(get_brazil_holidays().head(40))


if __name__ == "__main__":
    main()