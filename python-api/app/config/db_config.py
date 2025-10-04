import pandas as pd
from sqlalchemy import create_engine
from contextlib import contextmanager
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
class DatabaseConfig:
    Base = declarative_base()
    # --- 1. CONFIGURAÇÃO DO BANCO DE DADOS ---
    DB_CONFIG = {
        "user": "neondb_owner",
        "password": "npg_aTf3l2ZjBkvt",
        "host": "ep-soft-pond-aceqyd5s-pooler.sa-east-1.aws.neon.tech",
        "port": "5432",
        "database": "neondb"
    }

    @classmethod
    def get_connection_string(cls):
        """Retorna a string de conexão do banco de dados"""
        return f"postgresql://{cls.DB_CONFIG['user']}:{cls.DB_CONFIG['password']}@{cls.DB_CONFIG['host']}:{cls.DB_CONFIG['port']}/{cls.DB_CONFIG['database']}"

    # lazy singletons
    _engine = None
    _SessionLocal = None

    @classmethod
    def get_engine(cls):
        if cls._engine is None:
            cls._engine = create_engine(
                cls.get_connection_string(),
                pool_pre_ping=True,   # evita conexões "stale"
                # echo=True  # habilite para debugging de DDL/SQL
            )
        return cls._engine

    @classmethod
    def get_session_factory(cls):
        if cls._SessionLocal is None:
            cls._SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=cls.get_engine())
        return cls._SessionLocal

    @classmethod
    @contextmanager
    def get_db_connection(cls):
        """Context manager que fornece a engine (útil para read_sql etc)."""
        engine = cls.get_engine()
        try:
            yield engine
        finally:
            # não dispose aqui — o engine permanece vivo para reuse
            pass

    @classmethod
    @contextmanager
    def get_db_session(cls):
        """Context manager que fornece uma sessão ORM (recomendado)."""
        SessionLocal = cls.get_session_factory()
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    @classmethod
    def load_data_from_db(cls, query):
        try:
            with cls.get_db_connection() as engine:
                df = pd.read_sql_query(query, engine)
                
            print(f"✅ Dados carregados com sucesso! DataFrame tem {df.shape[0]} linhas e {df.shape[1]} colunas.")
            return df
            
        except Exception as error:
            print(f"❌ Erro ao carregar dados: {error}")
            raise error
