from app.schemas.validation import IndividualValidationRequest
from app.services.validation_service import ValidationService
from fastapi import APIRouter, Depends, HTTPException
from app.deps import get_db
from sqlalchemy.orm import Session

router = APIRouter()


class ValidationController:
    @router.post("/validation/individual")
    def get_model_metrics(
        payload: IndividualValidationRequest, 
        db: Session = Depends(get_db)
    ):
        """
        Endpoint para validação individual de SKU com tratamento de outliers.
        
        Query params opcionais:
        - outlier_method: 'iqr' (padrão), 'mad', 'percentile', 'zscore', 'none'
        - outlier_threshold: 1.5 (padrão para IQR), 3.0 (para zscore)
        """
        try:
            validation_service = ValidationService(db)
            
            # Usa método padrão ou customizado
            outlier_method = getattr(payload, 'outlier_method', 'iqr')
            outlier_threshold = getattr(payload, 'outlier_threshold', 1.5)
            
            df_cv, df_metrics, wmape = validation_service.cv_sku(
                sku=payload.sku,
                outlier_method=outlier_method,
                outlier_threshold=outlier_threshold
            )

            return {
                "sku": payload.sku,
                "cross_validation": df_cv.to_dict(orient="records"),
                "performance_metrics": df_metrics.to_dict(orient="records"),
                "wmape": float(wmape) if wmape is not None else None,
                "outlier_method": outlier_method,
                "success": True
            }
            
        except ValueError as e:
            error_msg = str(e)
            if "less than 2 non-NaN rows" in error_msg:
                raise HTTPException(
                    status_code=400,
                    detail=f"SKU '{payload.sku}' sem dados suficientes"
                )
            raise HTTPException(status_code=400, detail=error_msg)
            
        except Exception as e:
            print(f"❌ Erro ao validar SKU {payload.sku}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")