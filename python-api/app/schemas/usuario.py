from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from app.utils.enums import UserRole


class UsuarioBase(BaseModel):
    """
    Schema base de usuário (campos comuns)
    """
    nome: str = Field(..., min_length=3, max_length=100, description="Nome completo do usuário")
    email: EmailStr = Field(..., description="Email único do usuário")
    role: UserRole = Field(..., description="Perfil do usuário (analista, comercial, gestao)")


class UsuarioCreate(UsuarioBase):
    """
    Schema para criação de usuário (usado por Gestão)
    """
    senha: str = Field(..., min_length=6, max_length=50, description="Senha do usuário")
    ativo: bool = Field(default=True, description="Usuário ativo no sistema")

    @validator('role')
    def validate_role(cls, v):
        if not UserRole.has_value(v):
            raise ValueError(f"Role inválido. Use um dos seguintes: {', '.join(UserRole.list_values())}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "nome": "Admin Tigre",
                "email": "gestao@tigre.com",
                "role": "gestao",
                "senha": "senha123",
                "ativo": True
            }
        }


class UsuarioUpdate(BaseModel):
    """
    Schema para atualização de usuário (campos opcionais)
    """
    nome: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    ativo: Optional[bool] = None

    @validator('role')
    def validate_role(cls, v):
        if v is not None and not UserRole.has_value(v):
            raise ValueError(f"Role inválido. Use um dos seguintes: {', '.join(UserRole.list_values())}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "nome": "Admin Tigre Atualizado",
                "role": "gestao",
                "ativo": True
            }
        }


class UsuarioResponse(UsuarioBase):
    """
    Schema para resposta de usuário (sem senha)
    """
    id_usuario: str = Field(..., description="ID único do usuário")
    ativo: bool = Field(..., description="Status de ativação")
    is_base_admin: bool = Field(default=False, description="Usuário base protegido")
    dt_criacao: datetime = Field(..., description="Data de criação")
    dt_ultimo_acesso: Optional[datetime] = Field(None, description="Último acesso")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id_usuario": "123e4567-e89b-12d3-a456-426614174000",
                "nome": "Admin Tigre",
                "email": "gestao@tigre.com",
                "role": "gestao",
                "ativo": True,
                "is_base_admin": True,
                "dt_criacao": "2025-01-15T10:30:00",
                "dt_ultimo_acesso": "2025-01-20T14:22:00"
            }
        }


class UsuarioListResponse(BaseModel):
    """
    Schema para listagem de usuários
    """
    total: int = Field(..., description="Total de usuários")
    usuarios: list[UsuarioResponse] = Field(..., description="Lista de usuários")
    base_admin: Optional[dict] = Field(None, description="Informações do usuário base protegido")

    class Config:
        json_schema_extra = {
            "example": {
                "total": 1,
                "base_admin": {
                    "email": "gestao@tigre.com",
                    "nome": "Admin Tigre",
                    "protected": True
                },
                "usuarios": [
                    {
                        "id_usuario": "123e4567-e89b-12d3-a456-426614174000",
                        "nome": "Admin Tigre",
                        "email": "gestao@tigre.com",
                        "role": "gestao",
                        "ativo": True,
                        "is_base_admin": True,
                        "dt_criacao": "2025-01-10T08:00:00",
                        "dt_ultimo_acesso": "2025-01-21T10:30:00"
                    }
                ]
            }
        }


class UsuarioDeleteResponse(BaseModel):
    """
    Schema para resposta de deleção de usuário
    """
    message: str = Field(..., description="Mensagem de confirmação")
    usuario_id: str = Field(..., description="ID do usuário deletado")
    protected_warning: Optional[str] = Field(None, description="Aviso se houver proteção")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Usuário desativado com sucesso",
                "usuario_id": "123e4567-e89b-12d3-a456-426614174000",
                "protected_warning": None
            }
        }