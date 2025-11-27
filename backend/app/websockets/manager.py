"""WebSocket connection manager."""

import logging
from typing import Dict
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manage WebSocket connections."""

    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        """Connect a user's websocket."""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"User {user_id} connected to WebSocket")

    def disconnect(self, user_id: int):
        """Disconnect a user's websocket."""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"User {user_id} disconnected from WebSocket")

    async def send_notification(self, user_id: int, message: str):
        """Send notification to specific user."""
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json({
                    "type": "notification",
                    "message": message
                })
            except Exception as e:
                logger.error(f"Error sending notification to user {user_id}: {e}")
                self.disconnect(user_id)


manager = ConnectionManager()
