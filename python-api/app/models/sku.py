from sqlalchemy import Column, Numeric, Integer, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.config.db_config import Base
import uuid

def uuid_generator():
    return str(uuid.uuid4())


class Sku(Base):
    __tablename__ = "tbsku"

    cd_sku = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cd_linha = Column(Integer, nullable=True)
    cd_processo = Column(Integer, nullable=True)
    num_valor = Column(Numeric(precision=7, scale=5), nullable=True)
    dt_mes = Column(Date, nullable=True)

    pontos_previsao = relationship("TbPontosPrevisao", back_populates="sku")