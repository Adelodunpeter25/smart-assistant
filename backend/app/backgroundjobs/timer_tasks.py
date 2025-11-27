"""Timer background tasks."""

import logging
from app.backgroundjobs.celery_app import celery_app
from app.core.database import get_sync_db
from app.services.timer import TimerService

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
            db.commit()
            
            logger.info(f"Timer {timer.id} triggered: {timer.label or 'No label'}")
            # TODO: Send notification to user (websocket, email, etc.)
        
        if timers:
            logger.info(f"Processed {len(timers)} triggered timers")
    
    except Exception as e:
        logger.error(f"Error checking timers: {e}")
        db.rollback()
    finally:
        db.close()
