from fastapi import Depends
from sqlalchemy.orm import Session
from app.config.db_config import DatabaseConfig

def get_db() -> Session:
    with DatabaseConfig.get_db_session() as db:
        yield db