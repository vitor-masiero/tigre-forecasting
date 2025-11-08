from app.data_processing.transformer import DataTransformer
from app.deps import get_db
from app.repository.query_repository import QueryRepository
from app.schemas.forecasting import ForecastRequest, ForecastRunResponse
from app.services.classification_service import ClassificationService
from app.services.redirect_service import RedirectService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.data_processing.clusterization import DataClusterization

router = APIRouter()


class ProphetController:
    @router.get("/outliers")
    def get_data(db: Session = Depends(get_db)):
        df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())

        return "OK", df_processed.to_dict(orient="records")

    @router.post("/predict", response_model=ForecastRunResponse)
    def predict(payload: ForecastRequest, db: Session = Depends(get_db)):
        """


        Endpoint principal para fazer previsões
        
        FUNCIONALIDADES:
        
        1. Previsão Individual (aggregation_type="sku"):
           - Com modelo especificado: usa o modelo especificado
           - Sem modelo especificado: redirecionamento automático por ABC
             * Classe A -> Prophet
             * Classe B -> ARIMA
             * Classe C -> XGBoost
        
        2. Previsões Agregadas (familia, processo, abc, all):
           - Sempre requer modelo especificado manualmente
           - Não faz redirecionamento automático por ABC
           - Padrão: Prophet se não especificado
        
        EXEMPLOS DE USO:
        
        # Previsão individual com redirecionamento ABC automático
        {
            "aggregation_type": "sku",
            "sku": "PROD123",
            "periods": 12
            # model não especificado -> usa ABC
        }
        
        # Previsão individual com modelo específico
        {
            "aggreg

ation_type": "sku",
            "sku": "PROD123",
            "model": "ARIMA",
            "periods": 12
        }
        
        # Previsão agregada por família com Prophet
        {
            "aggregation_type": "familia",
            "familia": "LINHA_A",
            "model": "Prophet",
            "periods": 12
        }
        
        # Previsão agregada por processo com XGBoost
        {
            "aggregation_type": "processo",
            "processo": "PROC_X",
            "model": "XGBoost",
            "periods": 12
        }
        
        # Previsão agregada por classe ABC com ARIMA
        {
            "aggregation_type": "abc",
            "abc_class": "A",
            "model": "ARIMA",
            "periods": 12
        }
        
        # Previsão total (todos os produtos)
        {
            "aggregation_type": "all",
            "model": "Prophet",
            "periods": 12
        }
        """
        try:
            df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
            df_classified = ClassificationService.classificar_abc_segmentado(
                ClassificationService.somar_quantidade_por_segmento(df_processed)
            )

            # Validações específicas por tipo de agregação
            if payload.aggregation_type == "sku" and not payload.sku:
                raise HTTPException(
                    status_code=400, 
                    detail="SKU deve ser fornecido para previsão individual (aggregation_type='sku')"
                )
            
            if payload.aggregation_type == "abc" and not payload.abc_class:
                raise HTTPException(
                    status_code=400,
                    detail="Classe ABC deve ser fornecida para agregação por ABC (abc_class='A', 'B' ou 'C')"
                )
            
            # Validação: agregações devem ter modelo especificado (ou usa padrão)
            if payload.aggregation_type != "sku" and not payload.model:
                print("⚠️ Modelo não especificado para agregação. Usando Prophet como padrão.")

            result = RedirectService.model_direction(
                df=df_classified,
                df_processed=df_processed,
                periods=payload.periods,
                sku=payload.sku,
                db=db,
                model=payload.model,
                aggregation_type=payload.aggregation_type,
                familia=payload.familia,
                processo=payload.processo,
                abc_class=payload.abc_class
            )

            run_id, forecast_df, time, aggregation_info, model_used, auto_selected, metrics = result

            preview = forecast_df.head(payload.preview_rows).to_dict(orient="records")

            return ForecastRunResponse(
                run_id=str(run_id),
                status="completed",
                preview=preview,
                time=time,
                aggregation_info=aggregation_info,
                model_used=model_used,
                auto_selected=auto_selected,
                metrics=metrics
            )

        except ValueError as e:
            print(f"\n❌ Erro de validação: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except NotImplementedError as e:
            print(f"\n⚠️ Funcionalidade não implementada: {str(e)}")
            raise HTTPException(status_code=501, detail=str(e))
        except Exception as e:
            print(f"\n❌ Erro inesperado: {str(e)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

    @router.get("/classifier")
    def classify(db: Session = Depends(get_db)):
        df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())

        df_classified = ClassificationService.classificar_abc_segmentado(
            ClassificationService.somar_quantidade_por_segmento(df_processed)
        )

        return df_classified.to_dict(orient="records")

    @router.get("/metrics")
    def get_model_metrics():
        df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
        df_clustered = DataClusterization.obter_metricas_todos_skus(df_processed)
        return df_clustered
    
    @router.get("/metrics/{sku}")
    def get_sku_metrics(sku: str):
        df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
        df_clustered = DataClusterization.obter_metricas(df_processed, sku)
        return df_clustered

    @router.get("/clusters")
    def get_sku_clusters():
        df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
        df_metrics = DataClusterization.clusterizar_skus(df_processed)
        return df_metrics
