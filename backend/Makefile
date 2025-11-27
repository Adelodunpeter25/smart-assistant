.PHONY: install dev db-up db-down db-reset migrate-init migrate-make migrate migrate-status migrate-history run test clean

install:
	uv sync

dev:
	uv sync --dev

db-up:
	docker-compose up -d

db-down:
	docker-compose down

db-reset:
	docker-compose down -v
	docker-compose up -d

migrate-init:
	uv run migrator init

migrate-make:
	uv run migrator makemigrations "$(msg)"

migrate:
	uv run migrator migrate

migrate-status:
	uv run migrator status

migrate-history:
	uv run migrator history

run:
	uv run uvicorn main:app --reload --port 8000

celery-worker:
	uv run celery -A app.backgroundjobs.celery_app worker --loglevel=info

celery-beat:
	uv run celery -A app.backgroundjobs.celery_app beat --loglevel=info

test:
	uv run pytest

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf backend/.pytest_cache
	rm -rf backend/logs/*.log
