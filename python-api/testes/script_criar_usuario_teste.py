# script_criar_usuario_teste.py
from app.config.db_config import DatabaseConfig
from app.services.auth_service import AuthService
from app.schemas.usuario import UsuarioCreate
from app.utils.enums import UserRole

print("\n" + "="*70)
print("👤 CRIANDO USUÁRIO DE TESTE")
print("="*70 + "\n")

with DatabaseConfig.get_db_session() as db:
    auth_service = AuthService(db)
    
    # Cria usuário gestão
    try:
        usuario = auth_service.create_usuario(UsuarioCreate(
            nome="Admin Tigre",
            email="gestao@tigre.com",
            role=UserRole.GESTAO,
            senha="senha123",  # ✅ Campo correto (será hasheado)
            ativo=True
        ))
        print(f"✅ Usuário criado com sucesso!")
        print(f"   📧 Email: {usuario.email}")
        print(f"   🆔 ID: {usuario.id_usuario}")
        print(f"   👔 Role: {usuario.role.value}")
        print(f"   ✓  Ativo: {usuario.ativo}")
        print("\n" + "="*70 + "\n")
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário: {e}")
        print("\n💡 Verifique:")
        print("   - Se a tabela tbusuarios foi recriada")
        print("   - Se o email já existe")
        print("   - Se o schema UsuarioCreate está correto")
        print("\n" + "="*70 + "\n")
        import traceback
        traceback.print_exc()