from app.data_processing.clusterization import DataClusterization
from app.data_processing.transformer import DataTransformer
from app.deps import get_db
from app.repository.query_repository import QueryRepository
from app.schemas.forecasting import ForecastRequest, ForecastRunResponse
from app.services.classification_service import ClassificationService
from app.services.redirect_service import RedirectService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
import pandas as pd
import numpy as np

router = APIRouter()
logger = logging.getLogger(__name__)


class ProphetController:
    @router.get("/outliers")
    def get_data(db: Session = Depends(get_db)):
        try:
            df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
            df_processed = df_processed.replace({np.nan: None})
            return "OK", df_processed.to_dict(orient="records")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao processar dados de outliers: {str(e)}"
            )

    @router.get("/previsoes")
    def get_previsoes(db: Session = Depends(get_db)):
        """
        Endpoint para listar todas as previsões salvas no banco de dados.
        """
        try:
            df_previsoes = QueryRepository.get_previsoes_data()
            if df_previsoes.empty:
                return []
            
            df_previsoes = df_previsoes.rename(columns={"num_wmape": "SKU/Tipo"})
            df_previsoes = df_previsoes.replace({np.nan: None})
            return df_previsoes.to_dict(orient="records")
        except Exception as e:
            logger.error(f"Erro ao buscar previsões: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Não foi possível recuperar a lista de previsões. Motivo: {str(e)}"
            )

    @router.post("/predict", response_model=ForecastRunResponse)
    def predict(payload: ForecastRequest, db: Session = Depends(get_db)):
        """
        Endpoint principal para fazer previsões.
        
        Realiza previsões individuais por SKU ou agregadas por Família, Processo, ABC ou Total.
        O sistema seleciona automaticamente o melhor modelo baseado na curva ABC se não for especificado.
        """
        try:
            # 1. Pré-processamento e Classificação
            try:
                skus = QueryRepository.get_all_skus()
                if skus is None or skus.empty:
                    raise ValueError("Nenhum dado de vendas encontrado na base de dados para gerar previsões.")
                
                df_processed = DataTransformer().preprocess(skus)
                df_classified = ClassificationService.classificar_abc_segmentado(
                    ClassificationService.somar_quantidade_por_segmento(df_processed)
                )
            except Exception as e:
                logger.exception("Erro na preparação dos dados históricos")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Erro na preparação dos dados históricos: {str(e)}"
                )

            # 2. Validações de entrada
            if payload.aggregation_type == "sku" and not payload.sku:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Para o tipo de agregação 'sku', o campo 'sku' é obrigatório."
                )

            if payload.aggregation_type == "abc" and not payload.abc_class:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Para o tipo de agregação 'abc', a classe ABC ('A', 'B' ou 'C') deve ser informada."
                )

            # 3. Execução da Previsão via RedirectService
            try:
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
                    abc_class=payload.abc_class,
                )
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Erro de validação nos parâmetros da previsão: {str(e)}"
                )
            except NotImplementedError as e:
                raise HTTPException(
                    status_code=status.HTTP_501_NOT_IMPLEMENTED,
                    detail=f"O modelo ou agregação solicitada ainda não está disponível: {str(e)}"
                )
            except Exception as e:
                logger.exception("Erro na execução do modelo de previsão")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Erro interno durante a execução do modelo de previsão: {str(e)}"
                )

            # 4. Formatação do Resultado
            (
                run_id,
                forecast_df,
                time,
                aggregation_info,
                model_used,
                auto_selected,
                metrics,
            ) = result

            if forecast_df is None or forecast_df.empty:
                raise HTTPException(
                    status_code=status.HTTP_204_NO_CONTENT,
                    detail="O modelo executou com sucesso, mas não retornou dados de previsão."
                )

            forecast_df = forecast_df.replace({np.nan: None})
            preview = forecast_df.head(payload.preview_rows).to_dict(orient="records")

            return ForecastRunResponse(
                run_id=str(run_id),
                status="completed",
                preview=preview,
                time=time,
                aggregation_info=aggregation_info,
                model_used=model_used,
                auto_selected=auto_selected,
                metrics=metrics,
            )

        except HTTPException:
            raise
        except Exception as e:
            logger.exception("Erro crítico não tratado no endpoint /predict")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Ocorreu um erro inesperado ao processar sua solicitação de previsão: {str(e)}"
            )

    @router.get("/classifier")
    def classify(db: Session = Depends(get_db)):
        try:
            df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
            df_classified = ClassificationService.classificar_abc_segmentado(
                ClassificationService.somar_quantidade_por_segmento(df_processed)
            )
            df_classified = df_classified.replace({np.nan: None})
            return df_classified.to_dict(orient="records")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao classificar curva ABC: {str(e)}"
            )

    @router.get("/metrics")
    def get_model_metrics():
        try:
            df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
            df_clustered = DataClusterization.obter_metricas_todos_skus(df_processed)
            df_clustered = df_clustered.replace({np.nan: None})
            return df_clustered.to_dict(orient="records")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao buscar métricas globais: {str(e)}"
            )

    @router.get("/metrics/{sku}")
    def get_sku_metrics(sku: str):
        try:
            df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
            df_clustered = DataClusterization.obter_metricas(df_processed, sku)
            
            # Se for um dicionário, precisamos tratar NaNs nele
            if isinstance(df_clustered, dict):
                return {k: (None if isinstance(v, float) and np.isnan(v) else v) for k, v in df_clustered.items()}
            
            return df_clustered
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao buscar métricas para o SKU {sku}: {str(e)}"
            )

    @router.get("/clusters")
    def get_sku_clusters():
        try:
            df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())
            df_metrics = DataClusterization.clusterizar_skus(df_processed)
            return df_metrics
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao processar clusterização de SKUs: {str(e)}"
            )
