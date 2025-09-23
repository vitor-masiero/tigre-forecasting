from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.config.db_config import Base
import uuid

def uuid_generator():
    return str(uuid.uuid4())

class Previsao(Base):
    __tablename__ = "tbprevisao"

    id_previsao = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dt_processamento = Column(DateTime, nullable=True)
    ds_modelo = Column(Text, nullable=True)
    qtd_total_skus = Column(Integer, nullable=False)
    num_wmape = Column(String, nullable=True)

    pontos_previsao = relationship("PontosPrevisao", back_populates="previsao")