from app.services.prophet_service import ProphetService


class RedirectService:
    def model_direction(df=None, df_processed=None, periods=12, sku=None, db=None, model=None):
        if sku is None:
            if model is None:
                raise ValueError("Modelo deve ser especificado quando SKU não é fornecido")

        mask = df["SKU"].astype(str).str.strip() == str(sku).strip()
        if mask.any():
            classe_abc = df.loc[mask, "Classe_ABC"].astype(str).str.strip().str.upper()
        else:     
            print(f"SKU '{sku}' não encontrado na classificação")

        

        if ((model == "Prophet") | (classe_abc == "A")).any():
            prophet_service = ProphetService(db)

            run_id, forecast_df, time = prophet_service.make_prediction(
                df_processed, periods=periods, sku=sku
            )
            return run_id, forecast_df, time

        elif (classe_abc == "B").any():
            run_id, forecast_df = "modelo_b"

            return run_id, forecast_df
        else:
            return "modelo_c"
