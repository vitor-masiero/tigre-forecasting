# app/utils/selic.py
import pandas as pd
from pathlib import Path
def get_selic_with_forecast(end_date=None):
    """
    Carrega a planilha da SELIC e retorna um DataFrame com projeção mensal até end_date.
    A coluna principal é 'selic', com data em 'ds'.
    """
    selic_df = pd.read_excel('SELIC.xlsx')

    selic_df["ds"] = pd.to_datetime(selic_df["ds"])
    selic_df["selic"] = selic_df["SELIC"]

    if end_date:
        max_date = pd.to_datetime(end_date)
        last_date = selic_df["ds"].max()
        if last_date < max_date:
            # Extende o último valor caso precise prever além do dataset
            last_value = selic_df["selic"].iloc[-1]
            new_dates = pd.date_range(start=last_date + pd.offsets.MonthBegin(), end=max_date, freq="MS")
            future = pd.DataFrame({"ds": new_dates, "selic": last_value})
            selic_df = pd.concat([selic_df, future], ignore_index=True)

    return selic_df[["ds", "selic"]]
