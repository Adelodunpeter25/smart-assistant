"""Search routes."""

from fastapi import APIRouter, Depends
from app.core.deps import get_current_user
from app.services.search import SearchService
from app.schemas import SuccessResponse
from app.schemas.search import (
    SearchRequest,
    SearchResponse,
    SummarizeRequest,
    SummarizeResponse,
)
from app.models.user import User

router = APIRouter(prefix="/search", tags=["Search"])


@router.post("", response_model=SuccessResponse[SearchResponse])
async def search_web(
    search_request: SearchRequest,
    current_user: User = Depends(get_current_user),
):
    """Search the web."""
    results = await SearchService.search_web(
        search_request.query,
        search_request.max_results,
    )
    response = SearchResponse(query=search_request.query, results=results)
    return SuccessResponse(data=response)


@router.post("/summarize", response_model=SuccessResponse[SummarizeResponse])
async def search_and_summarize(
    summarize_request: SummarizeRequest,
    current_user: User = Depends(get_current_user),
):
    """Search the web and summarize results."""
    results = await SearchService.search_web(
        summarize_request.query,
        summarize_request.max_results,
    )
    summary = SearchService.summarize_results(summarize_request.query, results)
    return SuccessResponse(data=summary)
