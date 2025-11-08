# main.py
from app.config.db_config import DatabaseConfig
from app.controllers import (
    prophet_controller,
    validation_controller,
)
from app.controllers.auth_controller import router as auth_router, users_router
# from app.middleware.auth_middleware import AuthMiddleware  # Descomente para ativar middleware global
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⚠️ MIDDLEWARE DE AUTENTICAÇÃO GLOBAL (Descomente para ativar)
# Quando ativo, TODAS as rotas exceto públicas requerem autenticação
# Rotas públicas: /, /docs, /openapi.json, /auth/login
# app.add_middleware(AuthMiddleware)

# Incluir routers
app.include_router(prophet_controller.router)
app.include_router(validation_controller.router)
app.include_router(auth_router)  # Rotas de autenticação (/auth/*)
app.include_router(users_router)  # Rotas de gestão de usuários (/users/*)


@app.on_event("startup")
def on_startup():
    print("🚀 Iniciando aplicação...")

    # Cria todas as tabelas (incluindo tbusuarios)
    DatabaseConfig.Base.metadata.create_all(bind=DatabaseConfig.get_engine())
    print("✅ Tabelas do banco de dados verificadas/criadas.")
    print("   - tbprevisao")
    print("   - tbpontosprevisao")
    print("   - tbusuarios")


@app.get("/")
async def root():
    return {
        "message": "Bem-vindo à API de Previsão da Tigre!",
        "version": "1.0.0",
        "auth": {
            "login": "/auth/login",
            "me": "/auth/me",
            "change_password": "/auth/change-password"
        },
        "users": {
            "create": "/users/ (POST) - Apenas Gestão",
            "list": "/users/ (GET) - Apenas Gestão",
            "get": "/users/{user_id} - Apenas Gestão",
            "update": "/users/{user_id} (PUT) - Apenas Gestão",
            "delete": "/users/{user_id} (DELETE) - Apenas Gestão",
            "stats": "/users/statistics/overview - Apenas Gestão"
        },
        "docs": "/docs"
    }


# Para rodar: uvicorn app.main:app --reload