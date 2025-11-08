from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime


class LoginRequest(BaseModel):
    """
    Schema para requisição de login
    """
    email: EmailStr = Field(..., description="Email do usuário")
    senha: str = Field(..., min_length=6, description="Senha do usuário")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "usuario@tigre.com",
                "senha": "senha123"
            }
        }


class TokenResponse(BaseModel):
    """
    Schema para resposta de autenticação (token JWT)
    """
    access_token: str = Field(..., description="Token JWT de acesso")
    token_type: str = Field(default="bearer", description="Tipo do token")
    expires_in: int = Field(..., description="Tempo de expiração em segundos")
    user: dict = Field(..., description="Dados do usuário autenticado")

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 3600,
                "user": {
                    "id_usuario": "123e4567-e89b-12d3-a456-426614174000",
                    "nome": "João Silva",
                    "email": "joao@tigre.com",
                    "role": "analista",
                    "ativo": True
                }
            }
        }


class TokenData(BaseModel):
    """
    Schema para dados extraídos do token JWT
    (usado internamente para validação)
    """
    user_id: str = Field(..., description="ID do usuário")
    email: str = Field(..., description="Email do usuário")
    role: str = Field(..., description="Role do usuário")
    exp: Optional[datetime] = Field(None, description="Data de expiração do token")


class RefreshTokenRequest(BaseModel):
    """
    Schema para renovação de token (futuro)
    """
    refresh_token: str = Field(..., description="Token de refresh")


class ChangePasswordRequest(BaseModel):
    """
    Schema para alteração de senha
    """
    senha_atual: str = Field(..., min_length=6, description="Senha atual")
    senha_nova: str = Field(..., min_length=6, description="Nova senha")
    senha_nova_confirmacao: str = Field(..., min_length=6, description="Confirmação da nova senha")

    @validator('senha_nova_confirmacao')
    def senhas_devem_coincidir(cls, v, values):
        if 'senha_nova' in values and v != values['senha_nova']:
            raise ValueError('As senhas não coincidem')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "senha_atual": "senha123",
                "senha_nova": "novaSenha456",
                "senha_nova_confirmacao": "novaSenha456"
            }
        }


class PasswordResetRequest(BaseModel):
    """
    Schema para solicitação de reset de senha (futuro)
    """
    email: EmailStr = Field(..., description="Email para reset de senha")


class PasswordResetConfirm(BaseModel):
    """
    Schema para confirmação de reset de senha (futuro)
    """
    token: str = Field(..., description="Token de reset")
    senha_nova: str = Field(..., min_length=6, description="Nova senha")
    senha_nova_confirmacao: str = Field(..., min_length=6, description="Confirmação da nova senha")

    @validator('senha_nova_confirmacao')
    def senhas_devem_coincidir(cls, v, values):
        if 'senha_nova' in values and v != values['senha_nova']:
            raise ValueError('As senhas não coincidem')
        return v