FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install uv with retry logic
RUN pip install --upgrade pip --no-cache-dir && \
    pip install uv --no-cache-dir

# Copy uv files and install dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run migrations and start server
CMD uv run uvicorn main:app --host 0.0.0.0 --port 8000
