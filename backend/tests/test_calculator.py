"""Tests for calculator service."""

import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_calculate():
    """Test mathematical calculation."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        calc_data = {
            "expression": "2 + 2 * 3",
        }
        response = await client.post("/calculator/compute", json=calc_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["result"] == 8.0


@pytest.mark.asyncio
async def test_calculate_complex():
    """Test complex calculation."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        calc_data = {
            "expression": "(10 + 5) * 2 - 8 / 4",
        }
        response = await client.post("/calculator/compute", json=calc_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["result"] == 28.0


@pytest.mark.asyncio
async def test_currency_conversion():
    """Test currency conversion."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        convert_data = {
            "amount": 100,
            "from_currency": "USD",
            "to_currency": "EUR",
        }
        response = await client.post("/calculator/convert", json=convert_data)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "converted_amount" in data["data"]
        assert "rate" in data["data"]
        assert data["data"]["amount"] == 100
