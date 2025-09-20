import pandas as pd
from sqlalchemy import create_engine
from contextlib import contextmanager
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DatabaseConfig:
    
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

    @classmethod
    @contextmanager
    def get_db_connection(cls):
        engine = None
        try:
            connection_string = cls.get_connection_string()
            engine = create_engine(connection_string)
            yield engine
        except Exception as error:
            print(f"❌ Erro na conexão com o banco: {error}")
            raise error
        finally:
            if engine:
                engine.dispose()

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
