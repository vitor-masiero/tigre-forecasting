from sqlalchemy.orm import Session
from typing import Optional, Tuple
from app.repository.usuario_repository import UsuarioRepository
from app.auth.password_handler import PasswordHandler
from app.auth.jwt_handler import JWTHandler
from app.schemas.auth import LoginRequest, TokenResponse, ChangePasswordRequest
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.models.usuario import Usuario


class AuthService:
    """
    Service para lógica de autenticação e gestão de usuários
    """

    def __init__(self, db_session: Session):
        self.db = db_session
        self.usuario_repo = UsuarioRepository(db_session)

    def login(self, login_data: LoginRequest) -> TokenResponse:
        """
        Realiza login do usuário
        
        Args:
            login_data: Email e senha
            
        Returns:
            TokenResponse com token JWT e dados do usuário
            
        Raises:
            ValueError: Credenciais inválidas ou usuário inativo
        """
        # Busca usuário por email
        usuario = self.usuario_repo.get_by_email(login_data.email)
        
        if not usuario:
            raise ValueError("Email ou senha incorretos")
        
        # Verifica se usuário está ativo
        if not usuario.ativo:
            raise ValueError("Usuário desativado. Entre em contato com o administrador")
        
        # Verifica senha
        if not PasswordHandler.verify_password(login_data.senha, usuario.senha_hash):
            raise ValueError("Email ou senha incorretos")
        
        # Atualiza último acesso
        self.usuario_repo.update_last_access(str(usuario.id_usuario))
        
        # Gera token JWT
        token_data = {
            "user_id": str(usuario.id_usuario),
            "email": usuario.email,
            "role": usuario.role
        }
        
        access_token = JWTHandler.create_access_token(token_data)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=JWTHandler.get_token_expiration_time(),
            user=usuario.to_dict()
        )

    def create_usuario(self, usuario_data: UsuarioCreate) -> UsuarioResponse:
        """
        Cria novo usuário (apenas Gestão pode fazer isso)
        
        Args:
            usuario_data: Dados do novo usuário
            
        Returns:
            UsuarioResponse com dados do usuário criado
            
        Raises:
            ValueError: Email duplicado ou senha fraca
        """
        # Valida força da senha
        is_valid, message = PasswordHandler.validate_password_strength(usuario_data.senha)
        
        if not is_valid:
            raise ValueError(message)
        
        # Gera hash da senha
        senha_hash = PasswordHandler.hash_password(usuario_data.senha)
        
        # Cria usuário no banco
        usuario = self.usuario_repo.create(usuario_data, senha_hash)
        
        return UsuarioResponse.model_validate(usuario)

    def get_usuario_by_id(self, user_id: str) -> Optional[UsuarioResponse]:
        """Busca usuário por ID"""
        usuario = self.usuario_repo.get_by_id(user_id)
        
        if not usuario:
            return None
        
        return UsuarioResponse.model_validate(usuario)

    def get_all_usuarios(self, include_inactive: bool = False) -> list[UsuarioResponse]:
        """Lista todos os usuários"""
        usuarios = self.usuario_repo.get_all(include_inactive)
        return [UsuarioResponse.model_validate(u) for u in usuarios]

    def update_usuario(self, user_id: str, usuario_data: UsuarioUpdate) -> Optional[UsuarioResponse]:
        """
        Atualiza dados do usuário
        
        Args:
            user_id: ID do usuário
            usuario_data: Dados a serem atualizados
            
        Returns:
            UsuarioResponse atualizado ou None
        """
        usuario = self.usuario_repo.update(user_id, usuario_data)
        
        if not usuario:
            return None
        
        return UsuarioResponse.model_validate(usuario)

    def deactivate_usuario(self, user_id: str) -> bool:
        """Desativa usuário (soft delete)"""
        return self.usuario_repo.deactivate(user_id)

    def delete_usuario(self, user_id: str) -> bool:
        """Deleta usuário permanentemente"""
        return self.usuario_repo.delete(user_id)

    def change_password(
        self, 
        user_id: str, 
        change_data: ChangePasswordRequest
    ) -> Tuple[bool, str]:
        """
        Altera senha do usuário
        
        Args:
            user_id: ID do usuário
            change_data: Senha atual e nova senha
            
        Returns:
            Tupla (sucesso, mensagem)
        """
        # Busca usuário
        usuario = self.usuario_repo.get_by_id(user_id)
        
        if not usuario:
            return False, "Usuário não encontrado"
        
        # Verifica senha atual
        if not PasswordHandler.verify_password(change_data.senha_atual, usuario.senha_hash):
            return False, "Senha atual incorreta"
        
        # Valida força da nova senha
        is_valid, message = PasswordHandler.validate_password_strength(change_data.senha_nova)
        
        if not is_valid:
            return False, message
        
        # Gera hash da nova senha
        new_password_hash = PasswordHandler.hash_password(change_data.senha_nova)
        
        # Atualiza no banco
        success = self.usuario_repo.update_password(user_id, new_password_hash)
        
        if success:
            return True, "Senha alterada com sucesso"
        
        return False, "Erro ao alterar senha"

    def verify_token(self, token: str) -> Optional[dict]:
        """
        Verifica token e retorna dados do usuário
        
        Args:
            token: Token JWT
            
        Returns:
            Dict com dados do usuário ou None
        """
        token_data = JWTHandler.decode_token(token)
        
        if not token_data:
            return None
        
        # Verifica se usuário ainda existe e está ativo
        usuario = self.usuario_repo.get_by_id(token_data.user_id)
        
        if not usuario or not usuario.ativo:
            return None
        
        return {
            "user_id": str(usuario.id_usuario),
            "email": usuario.email,
            "role": usuario.role,
            "nome": usuario.nome
        }

    def get_statistics(self) -> dict:
        """
        Retorna estatísticas de usuários (para dashboard de Gestão)
        
        Returns:
            Dict com estatísticas
        """
        total_usuarios = len(self.usuario_repo.get_all(include_inactive=False))
        total_inativos = len(self.usuario_repo.get_all(include_inactive=True)) - total_usuarios
        
        analistas = self.usuario_repo.count_by_role("analista")
        comerciais = self.usuario_repo.count_by_role("comercial")
        gestores = self.usuario_repo.count_by_role("gestao")
        
        return {
            "total_ativos": total_usuarios,
            "total_inativos": total_inativos,
            "por_role": {
                "analista": analistas,
                "comercial": comerciais,
                "gestao": gestores
            }
        }