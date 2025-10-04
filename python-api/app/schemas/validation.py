from pydantic import BaseModel


class IndividualValidationRequest(BaseModel):
    sku: str
