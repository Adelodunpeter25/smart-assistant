.PHONY: install dev db-up db-down db-reset run test clean

install:
	cd backend && uv sync

dev:
	cd backend && uv sync --dev

db-up:
	docker-compose up -d

db-down:
	docker-compose down

db-reset:
	docker-compose down -v
	docker-compose up -d

run:
	cd backend && uv run uvicorn main:app --reload --port 8000

test:
	cd backend && uv run pytest

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf backend/.pytest_cache
	rm -rf backend/logs/*.log
