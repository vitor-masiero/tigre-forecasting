from app.services.prophet_service import ProphetService
from fastapi import FastAPI



class ProphetController:

    def predict(df, sku=None, periods=12):
        return ProphetService.make_prediction(df, sku, periods)