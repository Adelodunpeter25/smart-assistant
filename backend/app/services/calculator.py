"""Calculator service for computations and conversions."""

import httpx
from app.core.config import get_settings

settings = get_settings()


class CalculatorService:
    """Service for calculator operations."""

    @staticmethod
    def calculate(expression: str) -> float:
        """Evaluate mathematical expression safely."""
        try:
            # Safe evaluation using eval with restricted namespace
            allowed_names = {
                "abs": abs,
                "round": round,
                "min": min,
                "max": max,
                "sum": sum,
                "pow": pow,
            }
            result = eval(expression, {"__builtins__": {}}, allowed_names)
            return float(result)
        except Exception as e:
            raise ValueError(f"Invalid expression: {str(e)}")

    @staticmethod
    async def convert_currency(amount: float, from_currency: str, to_currency: str) -> dict:
        """Convert currency using ExchangeRate API."""
        url = f"https://v6.exchangerate-api.com/v6/{settings.EXCHANGERATE_API_KEY}/pair/{from_currency}/{to_currency}/{amount}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            data = response.json()
            
            if data.get("result") != "success":
                raise ValueError("Currency conversion failed")
            
            return {
                "amount": amount,
                "from_currency": from_currency,
                "to_currency": to_currency,
                "converted_amount": data["conversion_result"],
                "rate": data["conversion_rate"],
            }
