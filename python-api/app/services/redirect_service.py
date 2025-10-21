from app.services.prophet_service import ProphetService


class RedirectService:
    def model_direction(df=None, df_processed=None, periods=12, sku=None, db=None, model=None):
        if sku is None:
            if model is None:
                raise ValueError("Modelo deve ser especificado quando SKU não é fornecido")

        model = (model or "").strip()
        mask = df["SKU"].astype(str).str.strip().str.upper() == str(sku).strip().upper()

        if mask.any():
            classe_abc = (
                df.loc[mask, "Classe_ABC"]
                .astype(str)
                .str.strip()
                .str.upper()
                .iloc[0]
            )
        else:
            print(f"SKU '{sku}' não encontrado na classificação")
            classe_abc = None 

        if model: 
            modelo_final = model
        else:
            if classe_abc == "A":
                modelo_final = "Prophet" 
            elif classe_abc == "B":
                modelo_final = "ARIMA" #TSB
            elif classe_abc == "C":
                modelo_final = "XGBoost" #TSB
            else:
                # fallback caso não haja ABC ou valor não mapeado
                modelo_final = "Prophet"

        if modelo_final == "Prophet":
            prophet_service = ProphetService(db)
            run_id, forecast_df, time = prophet_service.make_prediction(
                df_processed, periods=periods, sku=sku
            )
            return run_id, forecast_df, time

        elif modelo_final == "ARIMA":
            return None

        elif modelo_final == "XGBoost":
            return None

        else:
            #fallback
            prophet_service = ProphetService(db)
            run_id, forecast_df, time = prophet_service.make_prediction(
                df_processed, periods=periods, sku=sku
            )
            return run_id, forecast_df, time
