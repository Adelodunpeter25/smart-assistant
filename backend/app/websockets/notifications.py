"""WebSocket notification endpoint."""

import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from app.websockets.manager import manager
from app.utils.auth import verify_access_token

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, token: str = Query(...)):
    """WebSocket endpoint for real-time notifications."""
    try:
        # Verify token and get user_id
        user_id = verify_access_token(token)
        
        if not user_id:
            await websocket.close(code=1008)
            return
        
        # Connect user
        await manager.connect(user_id, websocket)
        
        try:
            # Keep connection alive
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            manager.disconnect(user_id)
    
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close(code=1011)
