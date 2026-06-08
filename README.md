# Tigre Forecasting

Sistema full-stack para previsão de demanda/vendas, combinando API em Python/FastAPI, modelos estatísticos/ML e dashboard web em React.

## Objetivo

Explorar dados históricos e gerar previsões para apoiar decisões de planejamento, estoque e análise comercial.

## Arquitetura

```text
frontend/   -> dashboard React
python-api/ -> API FastAPI, processamento de dados e modelos de previsão
```

## Stack

**Backend e dados**
- Python 3.12+
- FastAPI
- pandas
- scikit-learn
- statsmodels
- XGBoost
- SQLAlchemy
- PostgreSQL/psycopg2

**Frontend**
- React
- TypeScript
- Bootstrap
- Chart.js
- Axios

## Funcionalidades previstas

- Upload/consulta de dados históricos
- Processamento de séries temporais
- Geração de previsões
- Visualização em dashboard
- Autenticação e API REST

## Como rodar

### API

```bash
cd python-api
uv sync
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Status

Projeto acadêmico/protótipo em desenvolvimento para estudo de previsão de demanda e integração full-stack.
