from app.schemas.validation import IndividualValidationRequest
from app.services.validation_service import ValidationService
from fastapi import APIRouter

router = APIRouter()


class ValidationController:
    @router.post("/validation/individual")
    def get_model_metrics(payload: IndividualValidationRequest):
        df_cv, df_metrics = ValidationService.cv_sku(payload.sku)
        wmape = ValidationService.calcular_wmape(df_cv)

        return {
            "cross_validation": df_cv.to_dict(orient="records"),
            "performance_metrics": df_metrics.to_dict(orient="records"),
            "wmape": wmape,
        }
