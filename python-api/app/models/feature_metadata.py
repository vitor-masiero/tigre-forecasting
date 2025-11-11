# backend/models/feature_metadata.py
from sqlalchemy import Column, Integer, String, DateTime, JSON, Date
from datetime import datetime
from app.config.db_config import DatabaseConfig

class FeatureMetadata(DatabaseConfig.Base):
    __tablename__ = "feature_metadata"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    feature_name = Column(String(100), unique=True, nullable=False)
    table_name = Column(String(150), unique=True, nullable=False)
    version = Column(Integer, default=1)
    row_count = Column(Integer)
    columns = Column(JSON)
    date_range_start = Column(Date)
    date_range_end = Column(Date)
    uploaded_at = Column(DateTime, default=datetime.utcnow)