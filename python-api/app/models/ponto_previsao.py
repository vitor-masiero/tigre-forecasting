import uuid
from sqlalchemy import Column, Integer, Numeric, Date, DateTime, Text, ForeignKey, String as VarChar
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.config.db_config import Base  # ajuste o import conforme seu projeto


def uuid_generator():
    return str(uuid.uuid4())

class PontosPrevisao(Base):
    __tablename__ = "tbpontosprevisao"

    id_previsao = Column(UUID(as_uuid=True), ForeignKey("tbprevisao.id_previsao"), primary_key=True)
    cd_sku = Column(VarChar(20), nullable=False)
    dt_previsao = Column(Date, nullable=True)
    data_gerado = Column(DateTime, nullable=False)
    num_horizonte = Column(Integer, nullable=False)
    num_valor_estimado = Column(Numeric(16, 7), nullable=False)
    num_valor_inferior = Column(Numeric(16, 7), nullable=True)
    num_valor_superior = Column(Numeric(16, 7), nullable=True)
    dt_inicio_treino = Column(Date, nullable=True)
    dt_fim_treino = Column(Date, nullable=True)
    qtd_meses_treino = Column(Integer, nullable=True)
    ds_modelo = Column(Text, nullable=True)

    previsao = relationship("Previsao", back_populates="pontos_previsao")
