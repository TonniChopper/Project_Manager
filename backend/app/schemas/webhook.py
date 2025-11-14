"""Pydantic schemas for webhook events and audit logs."""
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Dict, Any


class WebhookEventBase(BaseModel):
    """Base webhook event schema."""
    event_type: str
    entity_type: str
    entity_id: int
    webhook_url: str
    success: bool


class WebhookEventCreate(BaseModel):
    """Schema for creating webhook event audit record."""
    event_type: str
    entity_type: str
    entity_id: int
    user_id: Optional[int] = None
    webhook_url: str
    payload: str
    status_code: Optional[int] = None
    response_body: Optional[str] = None
    error_message: Optional[str] = None
    retry_count: int = 0
    success: bool = False


class WebhookEventPublic(WebhookEventBase):
    """Public webhook event schema with full details."""
    id: int
    user_id: Optional[int]
    payload: str
    status_code: Optional[int]
    response_body: Optional[str]
    error_message: Optional[str]
    retry_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WebhookEventSummary(BaseModel):
    """Summary schema for webhook event listing."""
    id: int
    event_type: str
    entity_type: str
    entity_id: int
    webhook_url: str
    success: bool
    status_code: Optional[int]
    retry_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WebhookPayloadSchema(BaseModel):
    """Schema for standardized webhook payload."""
    event: Dict[str, Any]  # type, timestamp, source
    entity: Dict[str, Any]  # type, id, data
    user: Optional[Dict[str, Any]] = None  # id, data
    metadata: Dict[str, Any] = {}


class WebhookStatsResponse(BaseModel):
    """Response schema for webhook statistics."""
    total_events: int
    successful: int
    failed: int
    success_rate: float
    recent_events: list[WebhookEventSummary]

