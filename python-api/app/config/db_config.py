import pandas as pd
from sqlalchemy import create_engine

# --- 1. CONFIGURAÇÃO DO BANCO DE DADOS ---
db_config = {
    "user": "neondb_owner",
    "password": "npg_aTf3l2ZjBkvt",
    "host": "ep-soft-pond-aceqyd5s-pooler.sa-east-1.aws.neon.tech",
    "port": "5432",
    "database": "neondb"
}

def load_data_from_db(query="SELECT cdfamilia, cdproduto, cdprocesso, periodo, valor FROM tbdadosbruto WHERE cdproduto = '84110001' AND periodo BETWEEN '2022-08-01' AND '2025-07-01' ORDER BY periodo;"):

    """
    Carrega dados do banco de dados PostgreSQL.
    
    Args:
        query (str): Query SQL para executar. Default carrega todos os dados da tabela tbdadosbruto.
    
    Returns:
        pd.DataFrame: DataFrame com os dados carregados
        
    Raises:
        Exception: Se houver erro na conexão ou execução da query
    """
    try:
        # Criar a string de conexão
        connection_uri = f"postgresql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
        
        # Criar engine de conexão
        engine = create_engine(connection_uri)
        
        print("Conectando ao banco de dados...")
        print("Executando a query e carregando dados para o DataFrame...")
        
        # Executar query e carregar dados
        df = pd.read_sql_query(query, engine)
        
        print(f"✅ Dados carregados com sucesso! DataFrame tem {df.shape[0]} linhas e {df.shape[1]} colunas.")
        
        return df
        
    except Exception as error:
        print(f"❌ Erro ao carregar dados: {error}")
        raise error

# Função para visualizar amostra dos dados
def preview_data(df, n_rows=5):
    """
    Exibe uma prévia dos dados carregados.
    
    Args:
        df (pd.DataFrame): DataFrame para visualizar
        n_rows (int): Número de linhas para mostrar
    """
    print(f"\n📊 Primeiras {n_rows} linhas do DataFrame:")
    print(df.head(n_rows))
    
    print(f"\n📈 Informações do DataFrame:")
    print(f"- Dimensões: {df.shape[0]} linhas x {df.shape[1]} colunas")
    print(f"- Colunas: {list(df.columns)}")
    print(f"- Tipos de dados:")
    for col, dtype in df.dtypes.items():
        print(f"  • {col}: {dtype}")

# Código de teste (executado apenas se o arquivo for rodado diretamente)
if __name__ == "__main__":
    try:
        df = load_data_from_db()
        preview_data(df)
    except Exception as e:
        print(f"Falha no teste: {e}")