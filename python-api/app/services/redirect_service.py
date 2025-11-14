from app.services.aggregation_service import AggregationService
from app.services.xgboost_service import XGBoostService


class RedirectService:
    def model_direction(
        df=None,
        df_processed=None,
        periods=12,
        sku=None,
        db=None,
        model=None,
        aggregation_type="sku",
        familia=None,
        processo=None,
        abc_class=None,
    ):
        aggregation_info = None
        auto_selected = False

        if aggregation_type != "sku":
            if model:
                modelo_final = model.strip()
            else:
                modelo_final = "Prophet"

            if aggregation_type == "familia":
                df_aggregated, aggregation_info = AggregationService.aggregate_familia(
                    df_processed, familia
                )

            elif aggregation_type == "processo":
                df_aggregated, aggregation_info = (
                    AggregationService.aggregate_by_processo(df_processed, processo)
                )

            elif aggregation_type == "abc":
                if not abc_class:
                    raise ValueError(
                        "Classe ABC deve ser especificada para agregação por ABC"
                    )
                df_aggregated, aggregation_info = AggregationService.aggregate_by_abc(
                    df_processed, df, abc_class
                )

            elif aggregation_type == "all":
                df_aggregated, aggregation_info = AggregationService.aggregate_all(
                    df_processed
                )

            elif aggregation_type == "combined":
                df_aggregated, aggregation_info = AggregationService.aggregate_combined(
                    df_processed,
                    df_classified=df,
                    familia=familia,
                    processo=processo,
                    abc_class=abc_class,
                )

            else:
                raise ValueError(f"Tipo de agregação inválido: {aggregation_type}")

            run_id, forecast_df, time, metrics = RedirectService._execute_model(
                modelo_final, db, df_aggregated, None, periods
            )

            return (
                run_id,
                forecast_df,
                time,
                aggregation_info,
                modelo_final,
                auto_selected,
                metrics,
            )

        else:
            if sku is None:
                raise ValueError("SKU deve ser fornecido para previsão individual")

            if model:
                modelo_final = model.strip()
                auto_selected = False
            else:
                auto_selected = True
                mask = (
                    df["SKU"].astype(str).str.strip().str.upper()
                    == str(sku).strip().upper()
                )

                if mask.any():
                    classe_abc = (
                        df.loc[mask, "Classe_ABC"]
                        .astype(str)
                        .str.strip()
                        .str.upper()
                        .iloc[0]
                    )
                else:
                    print(f"⚠️ SKU '{sku}' não encontrado na classificação ABC")
                    classe_abc = None

                if classe_abc == "A":
                    modelo_final = "Prophet"
                elif classe_abc == "B":
                    modelo_final = "TSB"
                elif classe_abc == "C":
                    modelo_final = "XGBoost"
                else:
                    modelo_final = "Prophet"

            run_id, forecast_df, time, metrics = RedirectService._execute_model(
                modelo_final, db, df_processed, sku, periods
            )

            return run_id, forecast_df, time, None, modelo_final, auto_selected, metrics

    @staticmethod
    def _execute_model(model_name, db, df, sku, periods):
        if model_name == "Prophet":
            return "TSB", None, 0, None
        elif model_name == "TSB":
            return "TSB", None, 0, None
        elif model_name == "XGBoost":
            xgboost_service = XGBoostService(db)
            return xgboost_service.make_prediction(df, periods=periods, sku=sku)
        else:
            raise ValueError(f"Modelo desconhecido: {model_name}")
