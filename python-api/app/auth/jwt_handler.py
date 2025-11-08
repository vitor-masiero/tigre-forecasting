import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.schemas.auth import TokenData


class JWTHandler:
    """
    Handler para criação e validação de tokens JWT
    
    IMPORTANTE: Em produção, mova SECRET_KEY para variáveis de ambiente!
    """
    
    # ⚠️ ATENÇÃO: Em produção, use variável de ambiente ou secrets manager
    SECRET_KEY = "sua-chave-secreta-super-segura-tigre-2025"  # Alterar em produção!
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hora

    @classmethod
    def create_access_token(cls, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Cria token JWT de acesso
        
        Args:
            data: Dados a serem incluídos no token (user_id, email, role)
            expires_delta: Tempo de expiração customizado (opcional)
            
        Returns:
            Token JWT como string
            
        Example:
            >>> payload = {
            ...     "user_id": "123e4567-e89b-12d3-a456-426614174000",
            ...     "email": "joao@tigre.com",
            ...     "role": "analista"
            ... }
            >>> token = JWTHandler.create_access_token(payload)
            >>> print(token)
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        """
        to_encode = data.copy()
        
        # Define tempo de expiração
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=cls.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # Adiciona expiração ao payload
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        
        # Gera token
        encoded_jwt = jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)
        
        return encoded_jwt

    @classmethod
    def decode_token(cls, token: str) -> Optional[TokenData]:
        """
        Decodifica e valida token JWT
        
        Args:
            token: Token JWT a ser decodificado
            
        Returns:
            TokenData se válido, None se inválido
            
        Raises:
            jwt.ExpiredSignatureError: Token expirado
            jwt.InvalidTokenError: Token inválido
            
        Example:
            >>> token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            >>> token_data = JWTHandler.decode_token(token)
            >>> print(token_data.email)
            joao@tigre.com
        """
        try:
            # Decodifica token
            payload = jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
            
            # Extrai dados
            user_id: str = payload.get("user_id")
            email: str = payload.get("email")
            role: str = payload.get("role")
            exp: int = payload.get("exp")
            
            # Valida campos obrigatórios
            if user_id is None or email is None or role is None:
                return None
            
            # Converte timestamp de expiração
            exp_datetime = datetime.fromtimestamp(exp) if exp else None
            
            return TokenData(
                user_id=user_id,
                email=email,
                role=role,
                exp=exp_datetime
            )
        
        except jwt.ExpiredSignatureError:
            print("⚠️ Token expirado")
            return None
        
        except jwt.InvalidTokenError as e:
            print(f"❌ Token inválido: {e}")
            return None
        
        except Exception as e:
            print(f"❌ Erro ao decodificar token: {e}")
            return None

    @classmethod
    def verify_token(cls, token: str) -> bool:
        """
        Verifica se o token é válido (simplificado)
        
        Args:
            token: Token JWT a ser verificado
            
        Returns:
            True se válido, False caso contrário
            
        Example:
            >>> token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            >>> JWTHandler.verify_token(token)
            True
        """
        token_data = cls.decode_token(token)
        return token_data is not None

    @classmethod
    def get_token_expiration_time(cls) -> int:
        """
        Retorna tempo de expiração do token em segundos
        
        Returns:
            Segundos até expiração
            
        Example:
            >>> JWTHandler.get_token_expiration_time()
            3600  # 1 hora em segundos
        """
        return cls.ACCESS_TOKEN_EXPIRE_MINUTES * 60