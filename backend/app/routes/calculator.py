"""Calculator routes."""

from fastapi import APIRouter, HTTPException
from app.services.calculator import CalculatorService
from app.schemas import SuccessResponse
from app.schemas.calculator import (
    CalculateRequest,
    CalculateResponse,
    ConvertCurrencyRequest,
    ConvertCurrencyResponse,
)

router = APIRouter(prefix="/calculator", tags=["Calculator"])


@router.post("/compute", response_model=SuccessResponse[CalculateResponse])
async def compute(calculate_request: CalculateRequest):
    """Perform mathematical calculation."""
    try:
        result = CalculatorService.calculate(calculate_request.expression)
        response = CalculateResponse(
            expression=calculate_request.expression,
            result=result,
        )
        return SuccessResponse(data=response)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/convert", response_model=SuccessResponse[ConvertCurrencyResponse])
async def convert_currency(convert_request: ConvertCurrencyRequest):
    """Convert currency."""
    try:
        result = await CalculatorService.convert_currency(
            convert_request.amount,
            convert_request.from_currency,
            convert_request.to_currency,
        )
        return SuccessResponse(data=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
