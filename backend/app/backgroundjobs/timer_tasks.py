"""Timer background tasks."""

import logging
from app.backgroundjobs.celery_app import celery_app
from app.core.database import get_sync_db

logger = logging.getLogger(__name__)


@celery_app.task
def check_timers():
    """Check for triggered timers and mark them as completed."""
    db = next(get_sync_db())
    
    try:
        # Get triggered timers (synchronous version)
        from sqlalchemy import select
        from app.models import Timer, TimerStatus
        from datetime import datetime
        
        query = select(Timer).where(
            Timer.status == TimerStatus.ACTIVE,
            Timer.trigger_time <= datetime.utcnow(),
            Timer.is_notified == False,
        )
        result = db.execute(query)
        timers = list(result.scalars().all())
        
        for timer in timers:
            timer.status = TimerStatus.COMPLETED
            timer.is_notified = True
            timer.completed_at = datetime.utcnow()
            
            # Create notification
            from app.models.notification import Notification
            notification_msg = f"⏰ Timer finished: {timer.label}" if timer.label else "⏰ Timer finished!"
            notification = Notification(
                user_id=timer.user_id,
                message=notification_msg,
            )
            db.add(notification)
            db.commit()
            
            # Send WebSocket notification
            from app.websockets.manager import manager
            import asyncio
            try:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(manager.send_notification(timer.user_id, notification_msg))
                loop.close()
            except Exception as e:
                logger.error(f"Failed to send WebSocket notification: {e}")
            
            logger.info(f"Timer {timer.id} triggered for user {timer.user_id}: {notification_msg}")
        
        if timers:
            logger.info(f"Processed {len(timers)} triggered timers")
        
        return len(timers)
    
    except Exception as e:
        logger.error(f"Error checking timers: {e}")
        db.rollback()
    finally:
        db.close()
