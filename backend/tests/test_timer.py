"""Tests for timer functionality."""

import pytest
from datetime import datetime, timedelta
from httpx import AsyncClient, ASGITransport
from main import app


async def get_auth_token():
    """Helper to get auth token."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={"email": f"timer{datetime.utcnow().timestamp()}@example.com", "password": "password123", "name": "Timer User"}
        )
        return response.json()["access_token"]


@pytest.mark.asyncio
async def test_set_timer():
    """Test setting a timer."""
    token = await get_auth_token()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/timers/timer",
            headers={"Authorization": f"Bearer {token}"},
            json={"duration_seconds": 60, "label": "Test timer"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["duration_seconds"] == 60
        assert data["data"]["label"] == "Test timer"
        assert data["data"]["type"] == "timer"
        assert data["data"]["status"] == "active"


@pytest.mark.asyncio
async def test_set_alarm():
    """Test setting an alarm."""
    token = await get_auth_token()
    trigger_time = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/timers/alarm",
            headers={"Authorization": f"Bearer {token}"},
            json={"trigger_time": trigger_time, "label": "Test alarm"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["label"] == "Test alarm"
        assert data["data"]["type"] == "alarm"
        assert data["data"]["status"] == "active"


@pytest.mark.asyncio
async def test_list_timers():
    """Test listing timers."""
    token = await get_auth_token()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Create timer
        await client.post(
            "/timers/timer",
            headers={"Authorization": f"Bearer {token}"},
            json={"duration_seconds": 30}
        )
        
        # List timers
        response = await client.get(
            "/timers",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) >= 1


@pytest.mark.asyncio
async def test_cancel_timer():
    """Test cancelling a timer."""
    token = await get_auth_token()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Create timer
        create_response = await client.post(
            "/timers/timer",
            headers={"Authorization": f"Bearer {token}"},
            json={"duration_seconds": 120}
        )
        timer_id = create_response.json()["data"]["id"]
        
        # Cancel timer
        response = await client.delete(
            f"/timers/{timer_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["status"] == "cancelled"


@pytest.mark.asyncio
async def test_timer_isolation():
    """Test that users can only see their own timers."""
    token1 = await get_auth_token()
    token2 = await get_auth_token()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # User 1 creates timer
        create_response = await client.post(
            "/timers/timer",
            headers={"Authorization": f"Bearer {token1}"},
            json={"duration_seconds": 60}
        )
        timer_id = create_response.json()["data"]["id"]
        
        # User 2 tries to access User 1's timer
        response = await client.get(
            f"/timers/{timer_id}",
            headers={"Authorization": f"Bearer {token2}"}
        )
        assert response.status_code == 404
