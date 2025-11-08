from enum import Enum


class UserRole(str, Enum):
    """
    Define os perfis de usuário do sistema
    """
    ANALISTA = "analista"
    COMERCIAL = "comercial"
    GESTAO = "gestao"

    @classmethod
    def has_value(cls, value: str) -> bool:
        """Verifica se o valor é um role válido"""
        return value in cls._value2member_map_

    @classmethod
    def list_values(cls) -> list:
        """Retorna lista de todos os roles disponíveis"""
        return [role.value for role in cls]


class Permission(str, Enum):
    """
    Define as permissões granulares do sistema
    """
    # Previsões
    GERAR_PREVISAO = "gerar_previsao"
    EDITAR_PREVISAO = "editar_previsao"
    VISUALIZAR_PREVISAO = "visualizar_previsao"
    
    # Relatórios
    VER_RELATORIOS = "ver_relatorios"
    EXPORTAR_RELATORIOS = "exportar_relatorios"
    
    # Dados
    IMPORTAR_DADOS = "importar_dados"
    EXPORTAR_DADOS = "exportar_dados"
    
    # Automação
    CONFIGURAR_AUTOMACAO = "configurar_automacao"
    
    # Métricas
    VER_METRICAS_INDIVIDUAIS = "ver_metricas_individuais"
    VER_METRICAS_GERAIS = "ver_metricas_gerais"
    VER_KPI_EMPRESA = "ver_kpi_empresa"
    
    # Variáveis
    ADICIONAR_VARIAVEIS = "adicionar_variaveis"
    
    # Usuários
    GERENCIAR_USUARIOS = "gerenciar_usuarios"
    VISUALIZAR_USUARIOS = "visualizar_usuarios"


# Mapeamento de Roles para Permissões
ROLE_PERMISSIONS = {
    UserRole.ANALISTA: [
        Permission.GERAR_PREVISAO,
        Permission.EDITAR_PREVISAO,
        Permission.VISUALIZAR_PREVISAO,
        Permission.VER_RELATORIOS,
        Permission.EXPORTAR_RELATORIOS,
        Permission.IMPORTAR_DADOS,
        Permission.EXPORTAR_DADOS,
        Permission.CONFIGURAR_AUTOMACAO,
        Permission.VER_METRICAS_INDIVIDUAIS,
        Permission.ADICIONAR_VARIAVEIS,
    ],
    UserRole.COMERCIAL: [
        Permission.GERAR_PREVISAO,
        Permission.VISUALIZAR_PREVISAO,
        Permission.VER_RELATORIOS,
        Permission.EXPORTAR_RELATORIOS,
        Permission.VER_METRICAS_INDIVIDUAIS,
        Permission.ADICIONAR_VARIAVEIS,
    ],
    UserRole.GESTAO: [
        Permission.GERAR_PREVISAO,
        Permission.VISUALIZAR_PREVISAO,
        Permission.VER_RELATORIOS,
        Permission.EXPORTAR_RELATORIOS,
        Permission.VER_METRICAS_GERAIS,
        Permission.VER_KPI_EMPRESA,
        Permission.GERENCIAR_USUARIOS,
        Permission.VISUALIZAR_USUARIOS,
    ],
}


def get_role_permissions(role: UserRole) -> list[Permission]:
    """
    Retorna lista de permissões para um determinado role
    
    Args:
        role: Role do usuário (UserRole)
    
    Returns:
        Lista de permissões (Permission)
    """
    return ROLE_PERMISSIONS.get(role, [])


def has_permission(role: UserRole, permission: Permission) -> bool:
    """
    Verifica se um role possui determinada permissão
    
    Args:
        role: Role do usuário
        permission: Permissão a ser verificada
    
    Returns:
        True se o role possui a permissão, False caso contrário
    """
    role_perms = get_role_permissions(role)
    return permission in role_perms