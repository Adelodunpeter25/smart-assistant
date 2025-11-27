"""Tests for search service."""

import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_web_search():
    """Test web search."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        search_data = {
            "query": "Python programming",
            "max_results": 3,
        }
        response = await client.post("/search", json=search_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "results" in data["data"]
        assert isinstance(data["data"]["results"], list)


@pytest.mark.asyncio
async def test_search_and_summarize():
    """Test search and summarize."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        search_data = {
            "query": "FastAPI framework",
            "max_results": 3,
        }
        response = await client.post("/search/summarize", json=search_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "summary" in data["data"]
        assert "sources" in data["data"]
