import holidays
import pandas as pd
from datetime import timedelta
from dateutil.easter import easter

def get_brazil_holidays(start_year=2020, end_year=2030):
    """
    Gera DataFrame de feriados brasileiros p/ Prophet 
    (incluindo janelas para feriadões).
    """
    holiday = pd.DataFrame([])

    # Gera dicionário de feriados nacionais brasileiros
    br_holidays = holidays.country_holidays("BR", years=range(start_year, end_year + 1), language="pt_BR")

    for year in range(start_year, end_year + 1):
        pascoa = easter(year)
        carnaval_seg = pascoa - timedelta(days=48)
        carnaval_ter = pascoa - timedelta(days=47)
        cinzas = pascoa - timedelta(days=46)
        corpus_christi = pascoa + timedelta(days=60)

        extras = {
            carnaval_seg: "Carnaval (Segunda-feira)",
            carnaval_ter: "Carnaval (Terça-feira)",
            cinzas: "Quarta-feira de Cinzas",
            corpus_christi: "Corpus Christi"
        }

        for data, name in extras.items():
            if data not in br_holidays:
                br_holidays[data] = name
    
    for date, name in sorted(br_holidays.items()):
        # Valores default de janela (sem prolongamento)
        lower, upper = 0, 0

        # Regras especiais (pode calibrar)
        if "Sexta" in name:  # sexta-feira santa
            lower, upper = 0, 2
        elif "Natal" in name or "Confraternização Universal" in name:
            lower, upper = 0, 3
        elif "Corpus Christi" in name:
            lower, upper = -1, 1

        # Adiciona feriado ao DF
        holiday = pd.concat([
            holiday,
            pd.DataFrame({
                'ds': [pd.to_datetime(date)],
                'holiday': [name],
                'lower_window': [lower],
                'upper_window': [upper]
            })
        ], ignore_index=True)

    return holiday