"""Calculator schemas."""

from pydantic import BaseModel


class CalculateRequest(BaseModel):
    """Schema for calculation request."""
    expression: str


class CalculateResponse(BaseModel):
    """Schema for calculation response."""
    expression: str
    result: float


class ConvertCurrencyRequest(BaseModel):
    """Schema for currency conversion request."""
    amount: float
    from_currency: str
    to_currency: str


class ConvertCurrencyResponse(BaseModel):
    """Schema for currency conversion response."""
    amount: float
    from_currency: str
    to_currency: str
    converted_amount: float
    rate: float
