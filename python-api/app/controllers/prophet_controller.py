from app.services.prophet_service import ProphetService
from app.schemas.forecasting import ForecastRequest, ForecastRunResponse
from app.repository.query_repository import QueryRepository
from app.data_processing.transformer import DataTransformer
from fastapi import APIRouter, Depends
from app.deps import get_db
from sqlalchemy.orm import Session

router = APIRouter()

class ProphetController:

    @router.post("/predict", response_model=ForecastRunResponse)
    def predict(
        payload: ForecastRequest,
        db: Session = Depends(get_db)
        ):

        df_processed = DataTransformer().preprocess(
            QueryRepository.get_all_skus()
        )

        prophet_service = ProphetService(db)

        run_id, forecast_df = prophet_service.make_prediction(
            df_processed, 
            periods=payload.periods, 
            sku=payload.sku
        )

        preview = forecast_df.head(payload.preview_rows).to_dict(orient="records")

        return ForecastRunResponse(
            run_id=str(run_id),
            status="completed",
            preview=preview
        )