# script_criar_usuario_base.py
"""
Script para criar o PRIMEIRO usuário gestor (BASE) com proteção permanente.

⚠️ IMPORTANTE:
- Este usuário NUNCA poderá ser excluído ou desativado
- Use para criar o administrador principal do sistema
- Execute apenas UMA VEZ após criar o banco
"""

import sys

from app.auth.password_handler import PasswordHandler
from app.config.db_config import DatabaseConfig
from app.repository.usuario_repository import UsuarioRepository
from app.schemas.usuario import UsuarioCreate
from app.utils.enums import UserRole


def criar_usuario_base():
    """Cria o usuário gestor base protegido"""

    print("\n" + "=" * 70)
    print("🔒 CRIAÇÃO DE USUÁRIO GESTOR BASE (PROTEGIDO)")
    print("=" * 70)
    print("\n⚠️  ATENÇÃO:")
    print("   - Este usuário será PERMANENTEMENTE PROTEGIDO")
    print("   - NÃO poderá ser excluído ou desativado")
    print("   - Use para o administrador principal do sistema")
    print("   - Execute apenas UMA VEZ\n")

    with DatabaseConfig.get_db_session() as db:
        repo = UsuarioRepository(db)

        # Verifica se já existe usuário base
        if repo.has_base_admin():
            base_admin = repo.get_base_admin()
            print("⚠️  JÁ EXISTE UM USUÁRIO BASE:")
            print(f"   📧 Email: {base_admin.email}")
            print(f"   👤 Nome: {base_admin.nome}")
            print(f"   🆔 ID: {base_admin.id_usuario}")
            print("\n❌ Não é possível criar outro usuário base.")
            print("   Use o script normal para criar usuários adicionais.\n")
            print("=" * 70 + "\n")
            return False

        # Confirmação do usuário
        print("📝 Configure o usuário gestor base:\n")

        nome = input("   Nome completo: ").strip()
        if not nome:
            print("\n❌ Nome não pode estar vazio\n")
            return False

        email = input("   Email: ").strip().lower()
        if not email or "@" not in email:
            print("\n❌ Email inválido\n")
            return False

        senha = input("   Senha (mínimo 6 caracteres): ").strip()

        # Valida senha
        is_valid, message = PasswordHandler.validate_password_strength(senha)
        if not is_valid:
            print(f"\n❌ {message}\n")
            return False

        senha_confirmacao = input("   Confirme a senha: ").strip()
        if senha != senha_confirmacao:
            print("\n❌ As senhas não coincidem\n")
            return False

        print("\n" + "-" * 70)
        print("📋 RESUMO DO USUÁRIO BASE:")
        print("-" * 70)
        print(f"   Nome: {nome}")
        print(f"   Email: {email}")
        print("   Role: gestao (Gestor)")
        print("   Status: Ativo")
        print("   Proteção: SIM (não pode ser excluído/desativado)")
        print("-" * 70 + "\n")

        confirmacao = (
            input("❓ Confirma a criação? Digite 'SIM' para continuar: ")
            .strip()
            .upper()
        )

        if confirmacao != "SIM":
            print("\n❌ Operação cancelada\n")
            return False

        # Cria usuário
        try:
            senha_hash = PasswordHandler.hash_password(senha)

            # Cria com flag is_base_admin=True
            usuario = repo.create(
                usuario_data=UsuarioCreate(
                    nome=nome,
                    email=email,
                    role=UserRole.GESTAO,
                    senha=senha,  # Não é usado diretamente, mas schema exige
                    ativo=True,
                ),
                senha_hash=senha_hash,
                is_base_admin=True,  # ← MARCA COMO USUÁRIO BASE PROTEGIDO
            )

            print("\n" + "=" * 70)
            print("✅ USUÁRIO GESTOR BASE CRIADO COM SUCESSO!")
            print("=" * 70)
            print(f"   🆔 ID: {usuario.id_usuario}")
            print(f"   📧 Email: {usuario.email}")
            print(f"   👤 Nome: {usuario.nome}")
            print(f"   👔 Role: {usuario.role}")
            print(f"   ✓  Ativo: {usuario.ativo}")
            print("   🔒 Protegido: SIM (não pode ser excluído/desativado)")
            print("=" * 70)
            print("\n💡 Use este login para acessar o sistema.")
            print("   Você pode criar outros usuários através da API.\n")
            print("=" * 70 + "\n")

            return True

        except ValueError as e:
            print(f"\n❌ Erro de validação: {e}\n")
            return False
        except Exception as e:
            print(f"\n❌ Erro ao criar usuário: {e}\n")
            import traceback

            traceback.print_exc()
            return False


def verificar_usuario_base():
    """Verifica se existe usuário base e mostra informações"""

    print("\n" + "=" * 70)
    print("🔍 VERIFICANDO USUÁRIO BASE")
    print("=" * 70 + "\n")

    with DatabaseConfig.get_db_session() as db:
        repo = UsuarioRepository(db)

        if repo.has_base_admin():
            base_admin = repo.get_base_admin()
            print("✅ Usuário base encontrado:")
            print(f"   🆔 ID: {base_admin.id_usuario}")
            print(f"   📧 Email: {base_admin.email}")
            print(f"   👤 Nome: {base_admin.nome}")
            print(f"   👔 Role: {base_admin.role}")
            print(f"   ✓  Ativo: {base_admin.ativo}")
            print("   🔒 Protegido: SIM")
            print(f"   📅 Criado em: {base_admin.dt_criacao}")
        else:
            print("⚠️  Nenhum usuário base encontrado")
            print("   Execute este script para criar o administrador principal")

        print("\n" + "=" * 70 + "\n")


if __name__ == "__main__":
    try:
        # Menu
        print("\n" + "=" * 70)
        print("GERENCIAMENTO DE USUÁRIO BASE")
        print("=" * 70)
        print("\n1 - Criar usuário gestor base")
        print("2 - Verificar usuário base existente")
        print("0 - Sair\n")

        opcao = input("Escolha uma opção: ").strip()

        if opcao == "1":
            criar_usuario_base()
        elif opcao == "2":
            verificar_usuario_base()
        elif opcao == "0":
            print("\n👋 Saindo...\n")
        else:
            print("\n❌ Opção inválida\n")

    except KeyboardInterrupt:
        print("\n\n❌ Operação cancelada (Ctrl+C)\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}\n")
        import traceback

        traceback.print_exc()
        sys.exit(1)
