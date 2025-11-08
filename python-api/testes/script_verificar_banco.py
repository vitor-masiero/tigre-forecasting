# script_verificar_banco.py
from app.config.db_config import DatabaseConfig
from sqlalchemy import text, inspect

engine = DatabaseConfig.get_engine()
inspector = inspect(engine)

print("\n📊 TABELAS NO BANCO:")
print("="*60)

for table in inspector.get_table_names():
    with engine.connect() as conn:
        result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
        count = result.scalar()
        print(f"✅ {table}: {count} registros")

print("="*60 + "\n")