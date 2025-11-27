"""Tests for multi-user data isolation."""

import pytest
from datetime import datetime
from httpx import AsyncClient, ASGITransport
from main import app


async def create_user(email_prefix: str):
    """Helper to create user and return token."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={
                "email": f"{email_prefix}{datetime.utcnow().timestamp()}@example.com",
                "password": "password123",
                "name": f"User {email_prefix}"
            }
        )
        return response.json()["access_token"]


@pytest.mark.asyncio
async def test_task_isolation():
    """Test that users can only see their own tasks."""
    token1 = await create_user("task1")
    token2 = await create_user("task2")
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # User 1 creates task
        await client.post(
            "/tasks",
            headers={"Authorization": f"Bearer {token1}"},
            json={"title": "User 1 task"}
        )
        
        # User 2 creates task
        await client.post(
            "/tasks",
            headers={"Authorization": f"Bearer {token2}"},
            json={"title": "User 2 task"}
        )
        
        # User 1 lists tasks
        response1 = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {token1}"}
        )
        tasks1 = response1.json()["data"]
        assert len(tasks1) == 1
        assert tasks1[0]["title"] == "User 1 task"
        
        # User 2 lists tasks
        response2 = await client.get(
            "/tasks",
            headers={"Authorization": f"Bearer {token2}"}
        )
        tasks2 = response2.json()["data"]
        assert len(tasks2) == 1
        assert tasks2[0]["title"] == "User 2 task"


@pytest.mark.asyncio
async def test_note_isolation():
    """Test that users can only see their own notes."""
    token1 = await create_user("note1")
    token2 = await create_user("note2")
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # User 1 creates note
        await client.post(
            "/notes",
            headers={"Authorization": f"Bearer {token1}"},
            json={"content": "User 1 note"}
        )
        
        # User 2 creates note
        await client.post(
            "/notes",
            headers={"Authorization": f"Bearer {token2}"},
            json={"content": "User 2 note"}
        )
        
        # User 1 lists notes
        response1 = await client.get(
            "/notes",
            headers={"Authorization": f"Bearer {token1}"}
        )
        notes1 = response1.json()["data"]
        assert len(notes1) == 1
        assert notes1[0]["content"] == "User 1 note"
        
        # User 2 lists notes
        response2 = await client.get(
            "/notes",
            headers={"Authorization": f"Bearer {token2}"}
        )
        notes2 = response2.json()["data"]
        assert len(notes2) == 1
        assert notes2[0]["content"] == "User 2 note"


@pytest.mark.asyncio
async def test_calendar_isolation():
    """Test that users can only see their own calendar events."""
    token1 = await create_user("cal1")
    token2 = await create_user("cal2")
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # User 1 creates event
        await client.post(
            "/calendar/events",
            headers={"Authorization": f"Bearer {token1}"},
            json={
                "title": "User 1 meeting",
                "start_time": "2025-01-01T10:00:00",
                "end_time": "2025-01-01T11:00:00"
            }
        )
        
        # User 2 creates event
        await client.post(
            "/calendar/events",
            headers={"Authorization": f"Bearer {token2}"},
            json={
                "title": "User 2 meeting",
                "start_time": "2025-01-01T14:00:00",
                "end_time": "2025-01-01T15:00:00"
            }
        )
        
        # User 1 lists events
        response1 = await client.get(
            "/calendar/events",
            headers={"Authorization": f"Bearer {token1}"}
        )
        events1 = response1.json()["data"]
        assert len(events1) == 1
        assert events1[0]["title"] == "User 1 meeting"
        
        # User 2 lists events
        response2 = await client.get(
            "/calendar/events",
            headers={"Authorization": f"Bearer {token2}"}
        )
        events2 = response2.json()["data"]
        assert len(events2) == 1
        assert events2[0]["title"] == "User 2 meeting"


@pytest.mark.asyncio
async def test_unauthorized_access():
    """Test that users cannot access other users' resources."""
    token1 = await create_user("unauth1")
    token2 = await create_user("unauth2")
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # User 1 creates task
        create_response = await client.post(
            "/tasks",
            headers={"Authorization": f"Bearer {token1}"},
            json={"title": "Private task"}
        )
        task_id = create_response.json()["data"]["id"]
        
        # User 2 tries to access User 1's task
        response = await client.get(
            f"/tasks/{task_id}",
            headers={"Authorization": f"Bearer {token2}"}
        )
        assert response.status_code == 404
        
        # User 2 tries to delete User 1's task
        response = await client.delete(
            f"/tasks/{task_id}",
            headers={"Authorization": f"Bearer {token2}"}
        )
        assert response.status_code == 404
