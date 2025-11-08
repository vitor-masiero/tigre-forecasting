from pydantic import BaseModel


class IndividualValidationRequest(BaseModel):
    sku: str
    outlier_method: str 
