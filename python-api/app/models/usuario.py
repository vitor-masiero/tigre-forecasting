import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from app.config.db_config import Base


class Usuario(Base):
    """
    Model de usuário do sistema - CORRIGIDO para UUID como String
    
    Tabela: tbusuarios
    
    Roles disponíveis:
    - analista: Acesso completo exceto gestão de usuários
    - comercial: Gera previsões (sem editar), adiciona variáveis
    - gestao: Gerencia usuários, vê KPIs gerais, não edita previsões
    """
    __tablename__ = "tbusuarios"

    # ✅ CORREÇÃO: UUID como String para compatibilidade com PostgreSQL
    id_usuario = Column(
        String(36),  # ← Mudança aqui: String ao invés de UUID
        primary_key=True, 
        default=lambda: str(uuid.uuid4()),  # ← Retorna string
        comment="ID único do usuário"
    )
    
    nome = Column(
        String(100), 
        nullable=False,
        comment="Nome completo do usuário"
    )
    
    email = Column(
        String(100), 
        unique=True, 
        nullable=False,
        index=True,
        comment="Email único para login"
    )
    
    senha_hash = Column(
        String(255), 
        nullable=False,
        comment="Hash bcrypt da senha"
    )
    
    role = Column(
        String(20), 
        nullable=False,
        comment="Perfil do usuário: analista, comercial, gestao"
    )
    
    ativo = Column(
        Boolean, 
        default=True,
        nullable=False,
        comment="Usuário ativo no sistema"
    )
    
    dt_criacao = Column(
        DateTime, 
        default=datetime.utcnow,
        nullable=False,
        comment="Data de criação do usuário"
    )
    
    dt_ultimo_acesso = Column(
        DateTime,
        nullable=True,
        comment="Último acesso ao sistema"
    )

    def __repr__(self):
        return f"<Usuario(id={self.id_usuario}, email={self.email}, role={self.role}, ativo={self.ativo})>"

    def to_dict(self):
        """Converte o model para dicionário (sem senha)"""
        return {
            "id_usuario": str(self.id_usuario),
            "nome": self.nome,
            "email": self.email,
            "role": self.role,
            "ativo": self.ativo,
            "dt_criacao": self.dt_criacao.isoformat() if self.dt_criacao else None,
            "dt_ultimo_acesso": self.dt_ultimo_acesso.isoformat() if self.dt_ultimo_acesso else None,
        }