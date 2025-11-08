from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from typing import Optional, List
from datetime import datetime
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate


class UsuarioRepository:
    """
    Repository para operações de banco de dados com usuários
    """

    def __init__(self, db_session: Session):
        self.db = db_session

    def create(self, usuario_data: UsuarioCreate, senha_hash: str) -> Usuario:
        """
        Cria novo usuário no banco
        
        Args:
            usuario_data: Dados do usuário (UsuarioCreate schema)
            senha_hash: Hash bcrypt da senha
            
        Returns:
            Usuario criado
            
        Raises:
            IntegrityError: Email duplicado
            SQLAlchemyError: Erro de banco
        """
        try:
            new_usuario = Usuario(
                nome=usuario_data.nome,
                email=usuario_data.email.lower(),  # Normaliza email
                senha_hash=senha_hash,
                role=usuario_data.role.value,
                ativo=usuario_data.ativo,
                dt_criacao=datetime.utcnow()
            )
            
            self.db.add(new_usuario)
            self.db.commit()
            self.db.refresh(new_usuario)
            
            print(f"✅ Usuário criado: {new_usuario.email} (Role: {new_usuario.role})")
            return new_usuario
        
        except IntegrityError:
            self.db.rollback()
            print(f"❌ Email já cadastrado: {usuario_data.email}")
            raise ValueError(f"Email '{usuario_data.email}' já está cadastrado")
        
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao criar usuário: {str(e)}")
            raise e

    def get_by_id(self, user_id: str) -> Optional[Usuario]:
        """Busca usuário por ID"""
        try:
            return self.db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
        except SQLAlchemyError as e:
            print(f"❌ Erro ao buscar usuário por ID: {str(e)}")
            return None

    def get_by_email(self, email: str) -> Optional[Usuario]:
        """Busca usuário por email (usado no login)"""
        try:
            return self.db.query(Usuario).filter(Usuario.email == email.lower()).first()
        except SQLAlchemyError as e:
            print(f"❌ Erro ao buscar usuário por email: {str(e)}")
            return None

    def get_all(self, include_inactive: bool = False) -> List[Usuario]:
        """
        Lista todos os usuários
        
        Args:
            include_inactive: Se True, inclui usuários desativados
        """
        try:
            query = self.db.query(Usuario)
            
            if not include_inactive:
                query = query.filter(Usuario.ativo == True)
            
            return query.order_by(Usuario.dt_criacao.desc()).all()
        
        except SQLAlchemyError as e:
            print(f"❌ Erro ao listar usuários: {str(e)}")
            return []

    def update(self, user_id: str, usuario_data: UsuarioUpdate) -> Optional[Usuario]:
        """
        Atualiza dados do usuário
        
        Args:
            user_id: ID do usuário
            usuario_data: Dados a serem atualizados
            
        Returns:
            Usuario atualizado ou None
        """
        try:
            usuario = self.get_by_id(user_id)
            
            if not usuario:
                print(f"⚠️ Usuário não encontrado: {user_id}")
                return None
            
            # Atualiza apenas campos fornecidos
            if usuario_data.nome is not None:
                usuario.nome = usuario_data.nome
            
            if usuario_data.email is not None:
                usuario.email = usuario_data.email.lower()
            
            if usuario_data.role is not None:
                usuario.role = usuario_data.role.value
            
            if usuario_data.ativo is not None:
                usuario.ativo = usuario_data.ativo
            
            self.db.commit()
            self.db.refresh(usuario)
            
            print(f"✅ Usuário atualizado: {usuario.email}")
            return usuario
        
        except IntegrityError:
            self.db.rollback()
            print(f"❌ Email já cadastrado: {usuario_data.email}")
            raise ValueError(f"Email '{usuario_data.email}' já está cadastrado")
        
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao atualizar usuário: {str(e)}")
            raise e

    def deactivate(self, user_id: str) -> bool:
        """
        Desativa usuário (soft delete)
        
        Args:
            user_id: ID do usuário
            
        Returns:
            True se desativado, False se não encontrado
        """
        try:
            usuario = self.get_by_id(user_id)
            
            if not usuario:
                print(f"⚠️ Usuário não encontrado: {user_id}")
                return False
            
            usuario.ativo = False
            self.db.commit()
            
            print(f"✅ Usuário desativado: {usuario.email}")
            return True
        
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao desativar usuário: {str(e)}")
            raise e

    def delete(self, user_id: str) -> bool:
        """
        Deleta usuário permanentemente (use com cuidado!)
        
        Args:
            user_id: ID do usuário
            
        Returns:
            True se deletado, False se não encontrado
        """
        try:
            usuario = self.get_by_id(user_id)
            
            if not usuario:
                print(f"⚠️ Usuário não encontrado: {user_id}")
                return False
            
            self.db.delete(usuario)
            self.db.commit()
            
            print(f"✅ Usuário deletado permanentemente: {usuario.email}")
            return True
        
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao deletar usuário: {str(e)}")
            raise e

    def update_last_access(self, user_id: str) -> None:
        """Atualiza timestamp de último acesso"""
        try:
            usuario = self.get_by_id(user_id)
            
            if usuario:
                usuario.dt_ultimo_acesso = datetime.utcnow()
                self.db.commit()
        
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao atualizar último acesso: {str(e)}")

    def update_password(self, user_id: str, new_password_hash: str) -> bool:
        """
        Atualiza senha do usuário
        
        Args:
            user_id: ID do usuário
            new_password_hash: Novo hash bcrypt da senha
            
        Returns:
            True se atualizado, False se não encontrado
        """
        try:
            usuario = self.get_by_id(user_id)
            
            if not usuario:
                print(f"⚠️ Usuário não encontrado: {user_id}")
                return False
            
            usuario.senha_hash = new_password_hash
            self.db.commit()
            
            print(f"✅ Senha atualizada para: {usuario.email}")
            return True
        
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"❌ Erro ao atualizar senha: {str(e)}")
            raise e

    def count_by_role(self, role: str) -> int:
        """Conta quantos usuários ativos de um determinado role"""
        try:
            return (
                self.db.query(Usuario)
                .filter(Usuario.role == role, Usuario.ativo == True)
                .count()
            )
        except SQLAlchemyError as e:
            print(f"❌ Erro ao contar usuários por role: {str(e)}")
            return 0