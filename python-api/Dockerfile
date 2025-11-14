# Etapa 1 — Builder
FROM python:3.12-slim AS builder

RUN apt-get update && apt-get install -y build-essential && \
    pip install --no-cache-dir uv

WORKDIR /app

# Copia apenas arquivos de dependência
COPY pyproject.toml uv.lock ./
ENV UV_INDEX_URL=https://pypi.uv.pkgs.dev/simple
ENV UV_HTTP_TIMEOUT=300

RUN uv sync --frozen

# Copia o restante do projeto
COPY . .

# Etapa 2 — Runtime
FROM python:3.12-slim

WORKDIR /app

# Instala UV também no runtime
RUN pip install --no-cache-dir uv && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia tudo do builder
COPY --from=builder /app /app

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
