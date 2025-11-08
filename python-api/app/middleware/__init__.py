from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.auth.jwt_handler import JWTHandler
from typing import List


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware global para validação de autenticação
    
    Rotas públicas (não requerem autenticação):
    - /
    - /docs
    - /openapi.json
    - /auth/login
    - /auth/register (se implementado)
    
    Todas as outras rotas requerem token JWT válido
    """

    # Rotas que não requerem autenticação
    PUBLIC_ROUTES = [
        "/",
        "/docs",
        "/openapi.json",
        "/redoc",
        "/auth/login",
    ]

    async def dispatch(self, request: Request, call_next):
        """
        Intercepta todas as requisições e valida autenticação
        
        Args:
            request: Requisição HTTP
            call_next: Próxima função na cadeia
            
        Returns:
            Response da requisição
        """
        # Verifica se é rota pública
        if self._is_public_route(request.url.path):
            return await call_next(request)
        
        # Extrai token do header
        authorization = request.headers.get("Authorization")
        
        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de autenticação não fornecido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Valida formato "Bearer <token>"
        try:
            scheme, token = authorization.split()
            if scheme.lower() != "bearer":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Esquema de autenticação inválido. Use 'Bearer <token>'",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Formato de token inválido. Use 'Bearer <token>'",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Valida token JWT
        token_data = JWTHandler.decode_token(token)
        
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Adiciona dados do usuário ao request (disponível nos endpoints)
        request.state.user = token_data
        
        # Continua processamento
        response = await call_next(request)
        return response

    def _is_public_route(self, path: str) -> bool:
        """
        Verifica se a rota é pública
        
        Args:
            path: Caminho da URL
            
        Returns:
            True se pública, False se protegida
        """
        # Verifica rotas exatas
        if path in self.PUBLIC_ROUTES:
            return True
        
        # Verifica rotas que começam com path público
        for public_route in self.PUBLIC_ROUTES:
            if path.startswith(public_route):
                return True
        
        return False