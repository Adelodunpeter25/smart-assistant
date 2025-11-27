"""Celery starter utility."""

import logging
import subprocess

logger = logging.getLogger(__name__)

celery_worker = None
celery_beat = None


def start_celery():
    """Start Celery worker and beat."""
    global celery_worker, celery_beat
    
    try:
        celery_worker = subprocess.Popen(
            ["celery", "-A", "app.backgroundjobs.celery_app", "worker", "--loglevel=info"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        celery_beat = subprocess.Popen(
            ["celery", "-A", "app.backgroundjobs.celery_app", "beat", "--loglevel=info"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        logger.info("Celery worker and beat started")
    except Exception as e:
        logger.error(f"Failed to start Celery: {e}")


def stop_celery():
    """Stop Celery worker and beat."""
    global celery_worker, celery_beat
    
    if celery_worker:
        celery_worker.terminate()
        celery_worker.wait()
    if celery_beat:
        celery_beat.terminate()
        celery_beat.wait()
    
    logger.info("Celery stopped")
