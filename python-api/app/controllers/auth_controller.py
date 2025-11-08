from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.deps import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest, TokenResponse, ChangePasswordRequest
from app.schemas.usuario import (
    UsuarioCreate,
    UsuarioUpdate,
    UsuarioResponse,
    UsuarioListResponse,
    UsuarioDeleteResponse,
)
from app.auth.permissions import get_current_user, require_roles
from app.schemas.auth import TokenData

router = APIRouter(prefix="/auth", tags=["Autenticação"])
users_router = APIRouter(prefix="/users", tags=["Gestão de Usuários"])


class AuthController:
    @router.post("/login", response_model=TokenResponse)
    def login(payload: LoginRequest, db: Session = Depends(get_db)):
        """
        Endpoint de login
        
        Retorna token JWT se credenciais válidas
        """
        try:
            auth_service = AuthService(db)
            token_response = auth_service.login(payload)
            return token_response
        
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(e)
            )
        except Exception as e:
            print(f"❌ Erro no login: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro interno no servidor"
            )

    @router.get("/me", response_model=UsuarioResponse)
    def get_current_user_info(
        current_user: TokenData = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """
        Retorna dados do usuário autenticado
        """
        try:
            auth_service = AuthService(db)
            usuario = auth_service.get_usuario_by_id(current_user.user_id)
            
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuário não encontrado"
                )
            
            return usuario
        
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Erro ao buscar usuário: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao buscar dados do usuário"
            )

    @router.post("/change-password")
    def change_password(
        payload: ChangePasswordRequest,
        current_user: TokenData = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """
        Altera senha do usuário autenticado
        """
        try:
            auth_service = AuthService(db)
            success, message = auth_service.change_password(
                current_user.user_id,
                payload
            )
            
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=message
                )
            
            return {"message": message}
        
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Erro ao alterar senha: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao alterar senha"
            )


class UserManagementController:
    """
    Controller para gestão de usuários (apenas Gestão)
    """

    @users_router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
    @require_roles(["gestao"])
    async def create_usuario(
        payload: UsuarioCreate,
        current_user: TokenData = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """
        Cria novo usuário (apenas Gestão)
        """
        try:
            auth_service = AuthService(db)
            usuario = auth_service.create_usuario(payload)
            
            print(f"👤 Usuário criado por {current_user.email}: {usuario.email}")
            return usuario
        
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            print(f"❌ Erro ao criar usuário: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao criar usuário"
            )

    @users_router.get("/", response_model=UsuarioListResponse)
    @require_roles(["gestao"])
    async def list_usuarios(
        include_inactive: bool = False,
        current_user: TokenData = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """
        Lista todos os usuários (apenas Gestão)
        """
        try:
            auth_service = AuthService(db)
            usuarios = auth_service.get_all_usuarios(include_inactive)
            
            return UsuarioListResponse(
                total=len(usuarios),
                usuarios=usuarios
            )
        
        except Exception as e:
            print(f"❌ Erro ao listar usuários: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao listar usuários"
            )

    @users_router.get("/{user_id}", response_model=UsuarioResponse)
    @require_roles(["gestao"])
    async def get_usuario(
        user_id: str,
        current_user: TokenData = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """
        Busca usuário por ID (apenas Gestão)
        """
        try:
            auth_service = AuthService(db)
            usuario = auth_service.get_usuario_by_id(user_id)
            
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuário {user_id} não encontrado"
                )
            
            return usuario
        
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Erro ao buscar usuário: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao buscar usuário"
            )

    @users_router.put("/{user_id}", response_model=UsuarioResponse)
    @require_roles(["gestao"])
    async def update_usuario(
        user_id: str,
        payload: UsuarioUpdate,
        current_user: TokenData = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """
        Atualiza dados do usuário (apenas Gestão)
        """
        try:
            auth_service = AuthService(db)
            usuario = auth_service.update_usuario(user_id, payload)
            
            if not usuario:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuário {user_id} não encontrado"
                )
            
            print(f"👤 Usuário atualizado por {current_user.email}: {usuario.email}")
            return usuario
        
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Erro ao atualizar usuário: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao atualizar usuário"
            )

    @users_router.delete("/{user_id}", response_model=UsuarioDeleteResponse)
    @require_roles(["gestao"])
    async def deactivate_usuario(
        user_id: str,
        current_user: TokenData = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """
        Desativa usuário (soft delete) - apenas Gestão
        """
        try:
            auth_service = AuthService(db)
            success = auth_service.deactivate_usuario(user_id)
            
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuário {user_id} não encontrado"
                )
            
            print(f"👤 Usuário desativado por {current_user.email}: {user_id}")
            return UsuarioDeleteResponse(
                message="Usuário desativado com sucesso",
                usuario_id=user_id
            )
        
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Erro ao desativar usuário: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao desativar usuário"
            )

    @users_router.get("/statistics/overview")
    @require_roles(["gestao"])
    async def get_statistics(
        current_user: TokenData = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        """
        Retorna estatísticas de usuários (apenas Gestão)
        """
        try:
            auth_service = AuthService(db)
            stats = auth_service.get_statistics()
            return stats
        
        except Exception as e:
            print(f"❌ Erro ao buscar estatísticas: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao buscar estatísticas"
            )