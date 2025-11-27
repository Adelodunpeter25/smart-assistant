"""Search service for web search."""

import httpx
from bs4 import BeautifulSoup


class SearchService:
    """Service for web search operations."""

    @staticmethod
    async def search_web(query: str, max_results: int = 5) -> list[dict]:
        """Search the web using DuckDuckGo HTML."""
        url = "https://html.duckduckgo.com/html/"
        params = {"q": query}
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=params, headers=headers, follow_redirects=True)
            soup = BeautifulSoup(response.text, "html.parser")
            
            results = []
            for result in soup.select(".result")[:max_results]:
                title_elem = result.select_one(".result__title")
                snippet_elem = result.select_one(".result__snippet")
                url_elem = result.select_one(".result__url")
                
                if title_elem and snippet_elem and url_elem:
                    results.append({
                        "title": title_elem.get_text(strip=True),
                        "snippet": snippet_elem.get_text(strip=True),
                        "url": url_elem.get("href", ""),
                    })
            
            return results

    @staticmethod
    def summarize_results(query: str, results: list[dict]) -> dict:
        """Summarize search results (basic implementation)."""
        # Simple concatenation (will be replaced with LLM later)
        snippets = [r["snippet"] for r in results]
        summary = " ".join(snippets[:3])
        sources = [r["url"] for r in results]
        
        return {
            "query": query,
            "summary": summary[:500] + "..." if len(summary) > 500 else summary,
            "sources": sources,
        }
