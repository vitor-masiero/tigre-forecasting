"""
Script ULTRA SEGURO para recriar APENAS tbusuarios
Verifica antes e depois que outras tabelas estão intactas
"""

from app.config.db_config import DatabaseConfig
from app.models.usuario import Usuario
from sqlalchemy import text, inspect
import sys

def contar_registros_tabela(engine, table_name):
    """Conta registros de uma tabela específica"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            return result.scalar()
    except Exception:
        return None

def verificar_tabelas_importantes(engine):
    """Verifica estado das tabelas importantes ANTES da operação"""
    print("\n" + "="*70)
    print("🔍 VERIFICANDO TABELAS IMPORTANTES (ANTES DA OPERAÇÃO)")
    print("="*70)
    
    tabelas_criticas = {
        'tbdadosbruto': 'Dados de vendas por mês',
        'tbprevisao': 'Previsões salvas',
        'tbpontosprevisao': 'Pontos de previsão'
    }
    
    contagens_antes = {}
    
    for tabela, descricao in tabelas_criticas.items():
        count = contar_registros_tabela(engine, tabela)
        contagens_antes[tabela] = count
        
        if count is not None:
            print(f"✅ {tabela}: {count:,} registros - {descricao}")
        else:
            print(f"⚠️  {tabela}: Não existe ainda - {descricao}")
    
    # Verifica tbusuarios
    count_usuarios = contar_registros_tabela(engine, 'tbusuarios')
    if count_usuarios is not None:
        print(f"🔧 tbusuarios: {count_usuarios} registros - SERÁ RECRIADA")
    else:
        print(f"🆕 tbusuarios: Não existe ainda - SERÁ CRIADA")
    
    print("="*70 + "\n")
    
    return contagens_antes

def recriar_apenas_tbusuarios():
    """Recria APENAS a tabela tbusuarios"""
    print("\n" + "🚀 INICIANDO RECRIAÇÃO DE tbusuarios")
    print("="*70 + "\n")
    
    engine = DatabaseConfig.get_engine()
    
    # 1. VERIFICAÇÃO ANTES
    contagens_antes = verificar_tabelas_importantes(engine)
    
    # 2. CONFIRMAÇÃO
    print("⚠️  ATENÇÃO:")
    print("   - A tabela tbusuarios será REMOVIDA e RECRIADA")
    print("   - Outras tabelas NÃO serão afetadas")
    print("   - Dados de vendas permanecerão INTACTOS\n")
    
    resposta = input("❓ Deseja continuar? Digite 'SIM' para confirmar: ").strip().upper()
    
    if resposta != "SIM":
        print("\n❌ Operação CANCELADA pelo usuário")
        sys.exit(0)
    
    # 3. REMOVE APENAS tbusuarios
    print("\n🗑️  Removendo tabela tbusuarios...")
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS tbusuarios CASCADE;"))
        conn.commit()
    print("✅ Tabela tbusuarios removida")
    
    # 4. RECRIA tbusuarios
    print("\n🏗️  Recriando tabela tbusuarios...")
    Usuario.__table__.create(bind=engine, checkfirst=True)
    print("✅ Tabela tbusuarios recriada com sucesso")
    
    # 5. VERIFICAÇÃO DEPOIS
    print("\n" + "="*70)
    print("🔍 VERIFICANDO TABELAS IMPORTANTES (DEPOIS DA OPERAÇÃO)")
    print("="*70)
    
    tabelas_criticas = {
        'tbdadosbruto': 'Dados de vendas por mês',
        'tbprevisao': 'Previsões salvas',
        'tbpontosprevisao': 'Pontos de previsão'
    }
    
    tudo_ok = True
    
    for tabela, descricao in tabelas_criticas.items():
        count_depois = contar_registros_tabela(engine, tabela)
        count_antes = contagens_antes.get(tabela)
        
        if count_antes is not None and count_depois is not None:
            if count_antes == count_depois:
                print(f"✅ {tabela}: {count_depois:,} registros - INTACTA")
            else:
                print(f"❌ {tabela}: {count_antes:,} → {count_depois:,} registros - ALTERADA!")
                tudo_ok = False
        elif count_antes is None and count_depois is None:
            print(f"⚠️  {tabela}: Não existia antes e continua não existindo")
        else:
            print(f"❌ {tabela}: Estado mudou inesperadamente!")
            tudo_ok = False
    
    # Verifica tbusuarios
    count_usuarios_depois = contar_registros_tabela(engine, 'tbusuarios')
    if count_usuarios_depois == 0:
        print(f"🔧 tbusuarios: 0 registros - RECRIADA (vazia)")
    else:
        print(f"⚠️  tbusuarios: {count_usuarios_depois} registros - Tem dados inesperados")
    
    print("="*70 + "\n")
    
    # 6. RESULTADO FINAL
    if tudo_ok:
        print("✅ SUCESSO! Operação concluída com segurança")
        print("   - tbusuarios foi recriada")
        print("   - Todas as outras tabelas estão INTACTAS")
        print("   - Dados de vendas preservados")
        print("\n📝 Próximo passo: Criar usuários com script_criar_usuarios.py\n")
    else:
        print("❌ ATENÇÃO! Algo inesperado aconteceu")
        print("   Verifique manualmente o estado do banco de dados\n")

def verificar_estrutura_tbusuarios():
    """Mostra a estrutura da nova tabela tbusuarios"""
    engine = DatabaseConfig.get_engine()
    inspector = inspect(engine)
    
    print("\n" + "="*70)
    print("📋 ESTRUTURA DA NOVA TABELA tbusuarios")
    print("="*70)
    
    if 'tbusuarios' in inspector.get_table_names():
        columns = inspector.get_columns('tbusuarios')
        for col in columns:
            print(f"   {col['name']:<20} {col['type']}")
        print("="*70 + "\n")
    else:
        print("❌ Tabela tbusuarios não foi criada!\n")

# EXECUTAR
if __name__ == "__main__":
    try:
        recriar_apenas_tbusuarios()
        verificar_estrutura_tbusuarios()
    except KeyboardInterrupt:
        print("\n\n❌ Operação CANCELADA pelo usuário (Ctrl+C)\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ ERRO INESPERADO: {e}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)