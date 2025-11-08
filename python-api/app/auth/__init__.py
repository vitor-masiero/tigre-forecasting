"""
Módulo de autenticação e segurança

Componentes:
- password_handler: Hash e verificação de senhas (bcrypt)
- jwt_handler: Geração e validação de tokens JWT
- permissions: Decoradores de controle de acesso
"""

from app.auth.password_handler import PasswordHandler
from app.auth.jwt_handler import JWTHandler

__all__ = [
    "PasswordHandler",
    "JWTHandler",
]