"""Search schemas."""

from pydantic import BaseModel


class SearchRequest(BaseModel):
    """Schema for search request."""
    query: str
    max_results: int = 5


class SearchResult(BaseModel):
    """Schema for single search result."""
    title: str
    snippet: str
    url: str


class SearchResponse(BaseModel):
    """Schema for search response."""
    query: str
    results: list[SearchResult]


class SummarizeRequest(BaseModel):
    """Schema for search and summarize request."""
    query: str
    max_results: int = 5


class SummarizeResponse(BaseModel):
    """Schema for summarize response."""
    query: str
    summary: str
    sources: list[str]
