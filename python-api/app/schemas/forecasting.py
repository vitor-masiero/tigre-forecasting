from typing import Optional, List, Any
from pydantic import BaseModel

class ForecastRequest(BaseModel):
    periods: int = 12
    sku: Optional[str] = None
    preview_rows: int = 10
    model: str = "Prophet"

class ForecastRunResponse(BaseModel):
    run_id: str
    status: str
    preview: Optional[List[Any]] = None
    time: float 
