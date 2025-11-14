from typing import Any, List, Literal, Optional

from pydantic import BaseModel, Field, model_validator, validator


class ForecastRequest(BaseModel):
    periods: int = Field(
        default=12, ge=1, description="Número de períodos para previsão"
    )

    sku: Optional[str] = Field(
        default=None, description="SKU específico para previsão individual"
    )

    preview_rows: int = Field(
        default=10, ge=1, le=100, description="Número de linhas para preview"
    )

    model: Optional[str] = Field(
        default=None,
        description="Modelo específico (Prophet, TSB, XGBoost). Se None, usa redirecionamento ABC para SKU individual",
    )

    aggregation_type: Literal[
        "sku", "familia", "processo", "abc", "all", "combined"
    ] = Field(
        default="sku",
        description="Tipo de agregação: sku (individual), familia, processo, abc (classe ABC), all (todos), combined (combinados)",
    )

    familia: Optional[List[str]] = Field(
        default=None,
        description="Filtro por família/linha específica (pode conter múltiplos valores)",
    )

    processo: Optional[List[str]] = Field(
        default=None,
        description="Filtro por processo específico (pode conter múltiplos valores)",
    )

    abc_class: Optional[List[str]] = Field(
        default=None,
        description="Filtro por classe ABC (A, B ou C) (pode conter múltiplos valores)",
    )

    @validator("model")
    def validate_model(cls, v):
        if v is not None:
            valid_models = ["Prophet", "TSB", "XGBoost"]
            if v not in valid_models:
                raise ValueError(
                    f"Modelo inválido. Use um dos seguintes: {', '.join(valid_models)}"
                )
        return v

    @validator("abc_class")
    def validate_abc_class(cls, v):
        if v is not None:
            validated = []
            for item in v:
                item_upper = item.upper().strip()
                if item_upper not in ["A", "B", "C"]:
                    raise ValueError(
                        f"Classe ABC '{item}' inválida. Deve ser A, B ou C"
                    )
                validated.append(item_upper)
            return validated
        return v

    @model_validator(mode="after")
    def validate_aggregation_requirements(self) -> "ForecastRequest":
        if self.aggregation_type == "sku":
            if not self.sku:
                raise ValueError(
                    "Campo 'sku' é obrigatório quando aggregation_type='sku'. "
                    'Exemplo: {"aggregation_type": "sku", "sku": "PROD123"}'
                )
        elif self.aggregation_type == "familia":
            if not self.familia:
                raise ValueError(
                    "Campo 'familia' é obrigatório quando aggregation_type='familia'. "
                    'Exemplo: {"aggregation_type": "familia", "familia": ["LINHA_A", "LINHA_B"]}'
                )
        elif self.aggregation_type == "processo":
            if not self.processo:
                raise ValueError(
                    "Campo 'processo' é obrigatório quando aggregation_type='processo'. "
                    'Exemplo: {"aggregation_type": "processo", "processo": ["PROC_X", "PROC_Y"]}'
                )
        elif self.aggregation_type == "abc":
            if not self.abc_class:
                raise ValueError(
                    "Campo 'abc_class' é obrigatório quando aggregation_type='abc'. "
                    'Exemplo: {"aggregation_type": "abc", "abc_class": ["A", "B"]}'
                )
        elif self.aggregation_type == "combined":
            has_filter = any([self.familia, self.processo, self.abc_class])

            if not has_filter:
                raise ValueError(
                    "Para aggregation_type='combined', forneça pelo menos um filtro: "
                    "familia, processo ou abc_class. "
                    'Exemplo: {"aggregation_type": "combined", "familia": ["LINHA_A"], "processo": ["PROC_X"]}'
                )

        elif self.aggregation_type == "all":
            pass

        else:
            raise ValueError(
                f"Tipo de agregação inválido: '{self.aggregation_type}'. "
                f"Use: sku, familia, processo, abc, all ou combined"
            )

        return self


class ForecastRunResponse(BaseModel):
    run_id: str
    status: str
    preview: Optional[List[Any]] = None
    time: float
    aggregation_info: Optional[dict] = Field(
        default=None, description="Informações sobre a agregação realizada"
    )
    model_used: str = Field(description="Modelo utilizado para a previsão")
    auto_selected: bool = Field(
        default=False,
        description="Indica se o modelo foi selecionado automaticamente por ABC",
    )
    metrics: Optional[dict] = Field(
        default=None, description="Métricas do modelo (WMAPE, MAE, RMSE, etc.)"
    )
