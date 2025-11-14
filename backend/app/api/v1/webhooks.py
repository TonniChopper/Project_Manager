"""API endpoints for webhook monitoring and administration."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.dependencies import get_db
from ...core.security import get_current_user
from ...schemas.webhook import (
    WebhookEventPublic,
    WebhookEventSummary,
    WebhookStatsResponse
)
from ...services.webhooks import WebhookService

router = APIRouter()


@router.get("/events", response_model=List[WebhookEventSummary], summary="List webhook events")
def list_webhook_events(
    limit: int = Query(100, le=500),
    event_type: Optional[str] = Query(None),
    success_only: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    List recent webhook events (admin only).

    - **limit**: Max number of events (default 100, max 500)
    - **event_type**: Filter by event type (e.g., "project.created")
    - **success_only**: Filter by success status
    """
    # Check admin permission
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    service = WebhookService(db)
    events = service.get_recent_events(
        limit=limit,
        event_type=event_type,
        success_only=success_only
    )

    return events


@router.get("/events/{event_id}", response_model=WebhookEventPublic, summary="Get webhook event details")
def get_webhook_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get detailed webhook event information (admin only).

    Includes full payload, response, and error details.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    from ...db.models import WebhookEvent
    event = db.get(WebhookEvent, event_id)

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook event not found"
        )

    return event


@router.get("/events/failed/recent", response_model=List[WebhookEventSummary], summary="Get failed webhook events")
def get_failed_webhook_events(
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get recent failed webhook events for debugging (admin only).

    - **limit**: Max number of failed events to return
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    service = WebhookService(db)
    failed_events = service.get_failed_events(limit=limit)

    return failed_events


@router.get("/stats", response_model=WebhookStatsResponse, summary="Get webhook statistics")
def get_webhook_stats(
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get webhook statistics and recent events (admin only).

    Returns success rate, total events, and recent event summaries.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    from ...db.models import WebhookEvent
    from sqlalchemy import func

    # Calculate statistics
    total = db.query(func.count(WebhookEvent.id)).scalar() or 0
    successful = db.query(func.count(WebhookEvent.id)).filter(WebhookEvent.success == True).scalar() or 0
    failed = total - successful
    success_rate = (successful / total * 100) if total > 0 else 0.0

    # Get recent events
    service = WebhookService(db)
    recent = service.get_recent_events(limit=limit)

    return WebhookStatsResponse(
        total_events=total,
        successful=successful,
        failed=failed,
        success_rate=round(success_rate, 2),
        recent_events=recent
    )

