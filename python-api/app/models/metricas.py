from app.config.db_config import DatabaseConfig
from sqlalchemy import Column, Float, Integer, String


class MetricasPrevisao(DatabaseConfig.Base):
    __tablename__ = "tbmetricas"

    id_metrica = Column(Integer, primary_key=True, autoincrement=True)

    ds_sku = Column(String, nullable=True)
    ds_modelo = Column(String, nullable=True)

    num_media = Column(Float, nullable=True)
    num_coeficiente_variacao = Column(Float, nullable=True)
    num_forca_sazonalidade = Column(Float, nullable=True)
    num_tendencia = Column(Float, nullable=True)
    num_proporcao_zeros = Column(Float, nullable=True)

    num_seasonality_prior_scale = Column(Float, nullable=True)
    num_changepoint_prior_scale = Column(Float, nullable=True)
    ds_seasonality_mode = Column(String, nullable=True)

    num_wmape = Column(String, nullable=True)

    num_bias = Column(Float, nullable=True)
    num_bias_pct = Column(Float, nullable=True)
    num_fva = Column(Float, nullable=True)
    num_mae = Column(Float, nullable=True)
    num_rmse = Column(Float, nullable=True)
    num_mape = Column(Float, nullable=True)
    num_n_estimators = Column(Integer, nullable=True)
    num_learning_rate = Column(Float, nullable=True)
