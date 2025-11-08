from functools import wraps
from typing import List, Optional
from fastapi import HTTPException, status, Depends, Header
from app.auth.jwt_handler import JWTHandler
from app.utils.enums import UserRole, Permission, has_permission


def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Dependência FastAPI para extrair usuário do token JWT
    
    Args:
        authorization: Header "Authorization: Bearer <token>"
        
    Returns:
        TokenData com dados do usuário
        
    Raises:
        HTTPException 401: Token ausente ou inválido
        HTTPException 403: Token expirado
        
    Example:
        @router.get("/protected")
        def protected_route(current_user = Depends(get_current_user)):
            return {"user": current_user.email}
    """
    # Verifica se header existe
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação não fornecido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extrai token do formato "Bearer <token>"
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
    
    # Decodifica e valida token
    token_data = JWTHandler.decode_token(token)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token_data


def require_roles(allowed_roles: List[str]):
    """
    Decorador para proteger endpoints baseado em roles
    
    Args:
        allowed_roles: Lista de roles permitidos (ex: ["analista", "gestao"])
        
    Returns:
        Decorador que valida se usuário tem role permitido
        
    Raises:
        HTTPException 403: Usuário sem permissão
        
    Example:
        @router.post("/predict")
        @require_roles(["analista", "comercial", "gestao"])
        def predict(current_user = Depends(get_current_user)):
            return {"message": "Previsão gerada"}
        
        @router.post("/users/create")
        @require_roles(["gestao"])  # Apenas gestão pode criar usuários
        def create_user(current_user = Depends(get_current_user)):
            return {"message": "Usuário criado"}
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user = Depends(get_current_user), **kwargs):
            # Verifica se role do usuário está na lista permitida
            if current_user.role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Acesso negado. Perfil '{current_user.role}' não tem permissão para esta operação. Perfis permitidos: {', '.join(allowed_roles)}"
                )
            
            # Se autorizado, executa função
            return await func(*args, current_user=current_user, **kwargs)
        
        return wrapper
    return decorator


def require_permission(required_permission: Permission):
    """
    Decorador para proteger endpoints baseado em permissões granulares
    
    Args:
        required_permission: Permissão necessária (enum Permission)
        
    Returns:
        Decorador que valida se usuário tem permissão
        
    Raises:
        HTTPException 403: Usuário sem permissão
        
    Example:
        @router.post("/data/import")
        @require_permission(Permission.IMPORTAR_DADOS)
        def import_data(current_user = Depends(get_current_user)):
            return {"message": "Dados importados"}
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user = Depends(get_current_user), **kwargs):
            # Converte string do token para UserRole enum
            try:
                user_role = UserRole(current_user.role)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Role inválido: {current_user.role}"
                )
            
            # Verifica se usuário tem a permissão
            if not has_permission(user_role, required_permission):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Acesso negado. Seu perfil '{user_role.value}' não possui a permissão '{required_permission.value}'"
                )
            
            # Se autorizado, executa função
            return await func(*args, current_user=current_user, **kwargs)
        
        return wrapper
    return decorator


def optional_auth(authorization: Optional[str] = Header(None)):
    """
    Dependência para autenticação opcional
    Retorna dados do usuário se autenticado, None caso contrário
    
    Útil para endpoints que funcionam com ou sem autenticação
    
    Args:
        authorization: Header "Authorization: Bearer <token>"
        
    Returns:
        TokenData se autenticado, None caso contrário
        
    Example:
        @router.get("/public-or-private")
        def mixed_route(current_user = Depends(optional_auth)):
            if current_user:
                return {"message": f"Olá {current_user.email}"}
            return {"message": "Olá visitante"}
    """
    if not authorization:
        return None
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        
        token_data = JWTHandler.decode_token(token)
        return token_data
    
    except Exception:
        return None