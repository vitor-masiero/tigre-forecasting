from app.services.prophet_service import ProphetService


class RedirectService:
    def model_direction(df, df_processed, periods=12, sku=None, db=None):
        if sku is None:
            raise ValueError("SKU deve ser fornecido para redirecionamento do modelo")

        mask = df["SKU"].astype(str).str.strip() == str(sku).strip()
        if not mask.any():
            raise ValueError(f"SKU '{sku}' não encontrado na classificação")

        classe_abc = df.loc[mask, "Classe_ABC"].astype(str).str.strip().str.upper()

        if (classe_abc == "A").any():
            prophet_service = ProphetService(db)

            run_id, forecast_df = prophet_service.make_prediction(
                df_processed, periods=periods, sku=sku
            )
            return run_id, forecast_df

        elif (classe_abc == "B").any():
            run_id, forecast_df = "modelo_b"

            return run_id, forecast_df
        else:
            return "modelo_c"
