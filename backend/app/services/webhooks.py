"""
Webhook service for sending events to n8n and other external automation tools.
Implements reliable HTTP POST with retry logic, audit logging, and error handling.
"""
import json
import httpx
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from ..core.settings import get_settings
from ..core.logging import logger
from ..db.models import WebhookEvent

settings = get_settings()


class WebhookEventType:
    """Standard webhook event types."""
    PROJECT_CREATED = "project.created"
    PROJECT_UPDATED = "project.updated"
    PROJECT_DELETED = "project.deleted"
    TASK_CREATED = "task.created"
    TASK_UPDATED = "task.updated"
    TASK_DELETED = "task.deleted"
    TASK_ASSIGNED = "task.assigned"
    TASK_COMPLETED = "task.completed"


class WebhookPayload:
    """Standardized webhook payload structure."""

    @staticmethod
    def create_payload(
        event_type: str,
        entity_type: str,
        entity_id: int,
        entity_data: Dict[str, Any],
        user_id: Optional[int] = None,
        user_data: Optional[Dict[str, Any]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create standardized webhook payload.

        Args:
            event_type: Event type (e.g., "project.created")
            entity_type: Entity type ("project", "task", etc.)
            entity_id: Entity ID
            entity_data: Entity details (name, status, etc.)
            user_id: User who triggered the event
            user_data: User details (username, email)
            metadata: Additional context

        Returns:
            Standardized payload dictionary
        """
        return {
            "event": {
                "type": event_type,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "project_manager_api"
            },
            "entity": {
                "type": entity_type,
                "id": entity_id,
                "data": entity_data
            },
            "user": {
                "id": user_id,
                "data": user_data or {}
            } if user_id else None,
            "metadata": metadata or {}
        }


class WebhookService:
    """Service for sending webhook events to external endpoints."""

    def __init__(self, db: Session):
        self.db = db
        self.timeout = 10.0  # seconds
        self.max_retries = 3
        self.retry_delay = 1.0  # seconds

    async def send_webhook(
        self,
        event_type: str,
        entity_type: str,
        entity_id: int,
        entity_data: Dict[str, Any],
        user_id: Optional[int] = None,
        user_data: Optional[Dict[str, Any]] = None,
        webhook_url: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> WebhookEvent:
        """
        Send webhook event to configured endpoint with retry logic.

        Args:
            event_type: Event type constant
            entity_type: Entity type
            entity_id: Entity ID
            entity_data: Entity details
            user_id: User ID who triggered event
            user_data: User details
            webhook_url: Override URL (defaults to N8N_URL from settings)
            metadata: Additional metadata

        Returns:
            WebhookEvent audit record
        """
        # Determine webhook URL
        target_url = webhook_url or self._get_default_webhook_url()
        if not target_url:
            logger.warning(f"No webhook URL configured for event {event_type}")
            return self._create_audit_record(
                event_type=event_type,
                entity_type=entity_type,
                entity_id=entity_id,
                user_id=user_id,
                webhook_url="",
                payload_dict={},
                success=False,
                error_message="No webhook URL configured"
            )

        # Create payload
        payload = WebhookPayload.create_payload(
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            entity_data=entity_data,
            user_id=user_id,
            user_data=user_data,
            metadata=metadata
        )

        payload_json = json.dumps(payload)

        # Attempt send with retries
        retry_count = 0
        last_error = None

        for attempt in range(self.max_retries):
            try:
                logger.info(f"Sending webhook {event_type} to {target_url} (attempt {attempt + 1}/{self.max_retries})")

                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(
                        target_url,
                        json=payload,
                        headers={
                            "Content-Type": "application/json",
                            "X-Event-Type": event_type,
                            "X-Source": "project_manager_api",
                            "User-Agent": "ProjectManager-Webhook/1.0"
                        }
                    )

                    success = response.status_code < 400

                    audit_record = self._create_audit_record(
                        event_type=event_type,
                        entity_type=entity_type,
                        entity_id=entity_id,
                        user_id=user_id,
                        webhook_url=target_url,
                        payload_dict=payload,
                        status_code=response.status_code,
                        response_body=response.text[:1000],  # Limit response size
                        success=success,
                        retry_count=retry_count
                    )

                    if success:
                        logger.info(f"Webhook {event_type} sent successfully: {response.status_code}")
                        return audit_record
                    else:
                        logger.warning(f"Webhook {event_type} failed: {response.status_code} - {response.text[:200]}")
                        retry_count += 1
                        last_error = f"HTTP {response.status_code}: {response.text[:200]}"

                        if attempt < self.max_retries - 1:
                            import asyncio
                            await asyncio.sleep(self.retry_delay * (attempt + 1))
                        continue

            except httpx.TimeoutException as e:
                logger.error(f"Webhook {event_type} timeout: {e}")
                retry_count += 1
                last_error = f"Timeout: {str(e)}"

                if attempt < self.max_retries - 1:
                    import asyncio
                    await asyncio.sleep(self.retry_delay * (attempt + 1))
                continue

            except Exception as e:
                logger.error(f"Webhook {event_type} error: {e}")
                retry_count += 1
                last_error = f"Error: {str(e)}"

                if attempt < self.max_retries - 1:
                    import asyncio
                    await asyncio.sleep(self.retry_delay * (attempt + 1))
                continue

        # All retries failed
        return self._create_audit_record(
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            webhook_url=target_url,
            payload_dict=payload,
            success=False,
            error_message=last_error or "All retries failed",
            retry_count=retry_count
        )

    def _get_default_webhook_url(self) -> Optional[str]:
        """Get default webhook URL from settings (N8N_URL)."""
        if settings.N8N_URL:
            # If N8N_URL is set, append webhook path if not present
            url = str(settings.N8N_URL)
            if not url.endswith("/webhook"):
                url = url.rstrip("/") + "/webhook/project-manager"
            return url
        return None

    def _create_audit_record(
        self,
        event_type: str,
        entity_type: str,
        entity_id: int,
        user_id: Optional[int],
        webhook_url: str,
        payload_dict: Dict[str, Any],
        status_code: Optional[int] = None,
        response_body: Optional[str] = None,
        success: bool = False,
        error_message: Optional[str] = None,
        retry_count: int = 0
    ) -> WebhookEvent:
        """Create and persist webhook audit record."""
        audit = WebhookEvent(
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            webhook_url=webhook_url,
            payload=json.dumps(payload_dict),
            status_code=status_code,
            response_body=response_body,
            success=success,
            error_message=error_message,
            retry_count=retry_count
        )

        self.db.add(audit)
        self.db.commit()
        self.db.refresh(audit)

        return audit

    def get_recent_events(
        self,
        limit: int = 100,
        event_type: Optional[str] = None,
        success_only: Optional[bool] = None
    ) -> List[WebhookEvent]:
        """
        Retrieve recent webhook events for monitoring.

        Args:
            limit: Max number of events to return
            event_type: Filter by event type
            success_only: Filter by success status

        Returns:
            List of WebhookEvent records
        """
        query = self.db.query(WebhookEvent)

        if event_type:
            query = query.filter(WebhookEvent.event_type == event_type)

        if success_only is not None:
            query = query.filter(WebhookEvent.success == success_only)

        return query.order_by(WebhookEvent.created_at.desc()).limit(limit).all()

    def get_failed_events(self, limit: int = 50) -> List[WebhookEvent]:
        """Get recent failed webhook events for debugging."""
        return self.get_recent_events(limit=limit, success_only=False)


# Convenience function for synchronous calls
def send_webhook_sync(
    db: Session,
    event_type: str,
    entity_type: str,
    entity_id: int,
    entity_data: Dict[str, Any],
    user_id: Optional[int] = None,
    user_data: Optional[Dict[str, Any]] = None,
    webhook_url: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> WebhookEvent:
    """
    Synchronous wrapper for sending webhooks (runs in background).
    Use this in non-async contexts like FastAPI route handlers.
    """
    import asyncio

    service = WebhookService(db)

    try:
        # Try to get existing event loop
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # Create task in background
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(
                    asyncio.run,
                    service.send_webhook(
                        event_type=event_type,
                        entity_type=entity_type,
                        entity_id=entity_id,
                        entity_data=entity_data,
                        user_id=user_id,
                        user_data=user_data,
                        webhook_url=webhook_url,
                        metadata=metadata
                    )
                )
                return future.result(timeout=30)
        else:
            # Run directly
            return asyncio.run(
                service.send_webhook(
                    event_type=event_type,
                    entity_type=entity_type,
                    entity_id=entity_id,
                    entity_data=entity_data,
                    user_id=user_id,
                    user_data=user_data,
                    webhook_url=webhook_url,
                    metadata=metadata
                )
            )
    except Exception as e:
        logger.error(f"Failed to send webhook: {e}")
        # Create failed audit record
        return service._create_audit_record(
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            user_id=user_id,
            webhook_url=webhook_url or "",
            payload_dict={},
            success=False,
            error_message=str(e)
        )

