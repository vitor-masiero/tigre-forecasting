# main.py
from app.config.db_config import DatabaseConfig  # Para criar tabelas
from app.controllers import (  # Importe seu arquivo de rotas
    prophet_controller,
    validation_controller,
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Tigre Forecast API",
    description="API para geração e gerenciamento de previsões de vendas para o segmento Predial da Tigre.",
    version="1.0.0",
)

origins = [
    "http://localhost",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir o roteador de previsões
app.include_router(prophet_controller.router)
app.include_router(validation_controller.router)


# Opcional: Evento de startup para criar tabelas no banco
@app.on_event("startup")
def on_startup():
    print("🚀 Iniciando aplicação...")

    DatabaseConfig.Base.metadata.create_all(bind=DatabaseConfig.get_engine())
    print("✅ Tabelas do banco de dados verificadas/criadas.")


@app.get("/")
async def root():
    return {"message": "Bem-vindo à API de Previsão da Tigre!"}


# Para rodar a aplicação, use: uvicorn main:app --reload
