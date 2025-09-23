from app.services.prophet_service import ProphetService
from fastapi import APIRouter, Depends
from app.deps import get_db
from sqlalchemy.orm import Session

router = APIRouter()

class ProphetController:

    @router.post("/predict")
    def predict(df, sku=None, periods=12, db: Session = Depends(get_db)):
        return ProphetService.make_prediction(df, sku, periods)