from app.data_processing.transformer import DataTransformer
from app.deps import get_db
from app.repository.query_repository import QueryRepository
from app.schemas.forecasting import ForecastRequest, ForecastRunResponse
from app.services.classification_service import ClassificationService
from app.services.prophet_service import ProphetService
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()


class ProphetController:
    @router.post("/predict", response_model=ForecastRunResponse)
    def predict(payload: ForecastRequest, db: Session = Depends(get_db)):
        df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())

        prophet_service = ProphetService(db)

        run_id, forecast_df = prophet_service.make_prediction(
            df_processed, periods=payload.periods, sku=payload.sku
        )

        preview = forecast_df.head(payload.preview_rows).to_dict(orient="records")

        return ForecastRunResponse(
            run_id=str(run_id), status="completed", preview=preview
        )

    @router.get("/classifier")
    def classify(db: Session = Depends(get_db)):
        df_processed = DataTransformer().preprocess(QueryRepository.get_all_skus())

        df_classified = ClassificationService.classificar_abc_segmentado(
            ClassificationService.somar_quantidade_por_segmento(df_processed)
        )

        return df_classified.to_dict(orient="records")
