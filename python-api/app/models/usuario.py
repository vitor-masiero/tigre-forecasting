import uuid
from datetime import datetime

from app.config.db_config import Base
from sqlalchemy import Boolean, Column, DateTime, String


class Usuario(Base):
    """
    Model de usuário do sistema - COM PROTEÇÃO PARA USUÁRIO BASE

    Tabela: tbusuarios

    Roles disponíveis:
    - analista: Acesso completo exceto gestão de usuários
    - comercial: Gera previsões (sem editar), adiciona variáveis
    - gestao: Gerencia usuários, vê KPIs gerais, não edita previsões

    PROTEÇÃO: O primeiro usuário gestor (is_base_admin=True) NÃO pode ser excluído/desativado
    """

    __tablename__ = "tbusuarios"

    id_usuario = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        comment="ID único do usuário",
    )

    nome = Column(String(100), nullable=False, comment="Nome completo do usuário")

    email = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
        comment="Email único para login",
    )

    senha_hash = Column(String(255), nullable=False, comment="Hash bcrypt da senha")

    role = Column(
        String(20),
        nullable=False,
        comment="Perfil do usuário: analista, comercial, gestao",
    )

    ativo = Column(
        Boolean, default=True, nullable=False, comment="Usuário ativo no sistema"
    )

    # 🔒 NOVO: Flag para identificar usuário base (protegido)
    is_base_admin = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Usuário gestor base (não pode ser excluído/desativado)",
    )

    dt_criacao = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        comment="Data de criação do usuário",
    )

    dt_ultimo_acesso = Column(
        DateTime, nullable=True, comment="Último acesso ao sistema"
    )

    def __repr__(self):
        base_flag = " [BASE]" if self.is_base_admin else ""
        return f"<Usuario(id={self.id_usuario}, email={self.email}, role={self.role}, ativo={self.ativo}{base_flag})>"

    def to_dict(self):
        """Converte o model para dicionário (sem senha)"""
        return {
            "id_usuario": str(self.id_usuario),
            "nome": self.nome,
            "email": self.email,
            "role": self.role,
            "ativo": self.ativo,
            "is_base_admin": self.is_base_admin,  # ← Inclui flag de proteção
            "dt_criacao": self.dt_criacao.isoformat() if self.dt_criacao else None,
            "dt_ultimo_acesso": self.dt_ultimo_acesso.isoformat()
            if self.dt_ultimo_acesso
            else None,
        }

    def is_protected(self) -> bool:
        """Verifica se o usuário está protegido contra exclusão/desativação"""
        return self.is_base_admin and self.role == "gestao"
