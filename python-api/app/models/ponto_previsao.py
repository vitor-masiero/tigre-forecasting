import uuid
from sqlalchemy import Column, Integer, Numeric, Date, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.config.db_config import Base  # ajuste o import conforme seu projeto


def uuid_generator():
    return str(uuid.uuid4())

class PontosPrevisao(Base):
    __tablename__ = "tbpontosprevisao"

    id_previsao = Column(UUID(as_uuid=True), ForeignKey("tbprevisao.id_previsao"), primary_key=True)
    cd_sku = Column(UUID(as_uuid=True), ForeignKey("tbsku.cd_sku"), primary_key=True)
    dt_previsao = Column(Date, nullable=True)
    data_gerado = Column(DateTime, nullable=False)
    num_horizonte = Column(Integer, nullable=False)
    num_valor_estimado = Column(Numeric, nullable=False)
    num_valor_inferior = Column(Numeric, nullable=True)
    num_valor_superior = Column(Numeric, nullable=True)
    dt_inicio_treino = Column(Date, nullable=True)
    dt_fim_treino = Column(Date, nullable=True)
    qtd_meses_treino = Column(Integer, nullable=True)
    ds_modelo = Column(Text, nullable=True)

    previsao = relationship("Previsao", back_populates="pontos_previsao")
    sku = relationship("Sku", back_populates="pontos_previsao")
