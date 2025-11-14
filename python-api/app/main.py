from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.db_config import DatabaseConfig
from app.controllers import (
    import_controller,
    prophet_controller,
    xgboost_controller,
)
from app.controllers.auth_controller import router as auth_router
from app.controllers.auth_controller import users_router

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

app.include_router(prophet_controller.router)
app.include_router(xgboost_controller.router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(import_controller.router)


@app.on_event("startup")
def on_startup():
    print("🚀 Iniciando aplicação...")

    DatabaseConfig.Base.metadata.create_all(bind=DatabaseConfig.get_engine())
    print("✅ Tabelas do banco de dados verificadas/criadas.")
    print("   - tbprevisao")
    print("   - tbpontosprevisao")
    print("   - tbusuarios")
    print("   - tbmetricas")


@app.get("/")
async def root():
    return {
        "message": "Bem-vindo à API de Previsão da Tigre!",
        "version": "1.0.0",
        "auth": {
            "login": "/auth/login",
            "me": "/auth/me",
            "change_password": "/auth/change-password",
        },
        "users": {
            "create": "/users/ (POST) - Apenas Gestão",
            "list": "/users/ (GET) - Apenas Gestão",
            "get": "/users/{user_id} - Apenas Gestão",
            "update": "/users/{user_id} (PUT) - Apenas Gestão",
            "delete": "/users/{user_id} (DELETE) - Apenas Gestão",
            "stats": "/users/statistics/overview - Apenas Gestão",
        },
        "xgboost": {
            "general_metrics": "/xgboost/metrics/general",
            "metrics_by_sku": "/xgboost/metrics/by-sku?sku=SKU123",
            "top_worst": "/xgboost/metrics/top-worst?limit=10",
        },
        "docs": "/docs",
    }
