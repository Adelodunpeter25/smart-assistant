"""Tests for note service."""

import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_create_note():
    """Test creating a note."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        note_data = {
            "content": "Test note content",
            "tags": "test,python",
        }
        response = await client.post("/notes", json=note_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["content"] == "Test note content"


@pytest.mark.asyncio
async def test_get_notes():
    """Test getting notes."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/notes")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)


@pytest.mark.asyncio
async def test_search_notes():
    """Test searching notes."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/notes/search?q=test")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)
