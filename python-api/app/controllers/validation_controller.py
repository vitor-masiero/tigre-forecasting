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
        Endpoint para validação individual de SKU.
        
        Args:
            payload: Request contendo o SKU a ser validado
            db: Sessão do banco de dados (injetada automaticamente)
        
        Returns:
            Dict com cross-validation, métricas de performance e WMAPE
            
        Raises:
            HTTPException: Se o SKU não for encontrado ou dados insuficientes
        """
        try:
            # Instancia o service COM a sessão do banco
            validation_service = ValidationService(db)
            
            # Chama o método de INSTÂNCIA (não estático)
            df_cv, df_metrics, wmape = validation_service.cv_sku(sku=payload.sku)

            return {
                "sku": payload.sku,
                "cross_validation": df_cv.to_dict(orient="records"),
                "performance_metrics": df_metrics.to_dict(orient="records"),
                "wmape": float(wmape) if wmape is not None else None,
                "success": True
            }
            
        except ValueError as e:
            error_msg = str(e)
            if "less than 2 non-NaN rows" in error_msg:
                raise HTTPException(
                    status_code=400,
                    detail=f"SKU '{payload.sku}' não possui dados suficientes para validação. Mínimo de 2 registros necessários."
                )
            raise HTTPException(status_code=400, detail=error_msg)
            
        except Exception as e:
            print(f"❌ Erro ao validar SKU {payload.sku}: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Erro ao processar validação: {str(e)}"
            )