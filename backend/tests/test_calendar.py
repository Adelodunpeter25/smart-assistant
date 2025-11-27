"""Tests for calendar service."""

import pytest
from datetime import datetime, timedelta
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_create_event():
    """Test creating a calendar event."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        event_data = {
            "title": "Test Meeting",
            "start_time": (datetime.now() + timedelta(days=1)).isoformat(),
            "end_time": (datetime.now() + timedelta(days=1, hours=1)).isoformat(),
            "description": "Test description",
        }
        response = await client.post("/calendar/events", json=event_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["title"] == "Test Meeting"


@pytest.mark.asyncio
async def test_get_events():
    """Test getting calendar events."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/calendar/events")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert isinstance(data["data"], list)


@pytest.mark.asyncio
async def test_create_reminder():
    """Test creating a reminder."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reminder_data = {
            "message": "Test reminder",
            "reminder_time": (datetime.now() + timedelta(hours=2)).isoformat(),
        }
        response = await client.post("/calendar/reminders", json=reminder_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["message"] == "Test reminder"
