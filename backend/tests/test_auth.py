"""Tests for authentication."""

import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_signup():
    """Test user signup."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/auth/signup",
            json={"email": "test@example.com", "password": "password123", "name": "Test User"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["email"] == "test@example.com"
        assert data["data"]["name"] == "Test User"
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]


@pytest.mark.asyncio
async def test_signup_duplicate_email():
    """Test signup with duplicate email."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        await client.post(
            "/auth/signup",
            json={"email": "duplicate@example.com", "password": "password123", "name": "User 1"}
        )
        response = await client.post(
            "/auth/signup",
            json={"email": "duplicate@example.com", "password": "password123", "name": "User 2"}
        )
        assert response.status_code == 400


@pytest.mark.asyncio
async def test_login():
    """Test user login."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Signup first
        await client.post(
            "/auth/signup",
            json={"email": "login@example.com", "password": "password123", "name": "Login User"}
        )
        
        # Login
        response = await client.post(
            "/auth/login",
            json={"email": "login@example.com", "password": "password123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]


@pytest.mark.asyncio
async def test_login_invalid_credentials():
    """Test login with invalid credentials."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/auth/login",
            json={"email": "nonexistent@example.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user():
    """Test getting current user info."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Signup
        signup_response = await client.post(
            "/auth/signup",
            json={"email": "current@example.com", "password": "password123", "name": "Current User"}
        )
        token = signup_response.json()["data"]["access_token"]
        
        # Get current user
        response = await client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["email"] == "current@example.com"
        assert data["data"]["name"] == "Current User"


@pytest.mark.asyncio
async def test_refresh_token():
    """Test token refresh."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Signup
        signup_response = await client.post(
            "/auth/signup",
            json={"email": "refresh@example.com", "password": "password123", "name": "Refresh User"}
        )
        refresh_token = signup_response.json()["data"]["refresh_token"]
        
        # Refresh
        response = await client.post(
            "/auth/refresh",
            json={"refresh_token": refresh_token}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]


@pytest.mark.asyncio
async def test_protected_route_without_token():
    """Test accessing protected route without token."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/tasks")
        assert response.status_code == 403
