"""Tests for webhook service functionality."""
import pytest
import json
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime
import httpx

from backend.app.services.webhooks import (
    WebhookService,
    WebhookEventType,
    WebhookPayload,
    send_webhook_sync
)
from backend.app.db.models import WebhookEvent


@pytest.fixture
def mock_db():
    """Mock database session."""
    db = Mock()
    db.add = Mock()
    db.commit = Mock()
    db.refresh = Mock()
    db.query = Mock()
    db.get = Mock()
    return db


@pytest.fixture
def webhook_service(mock_db):
    """Create webhook service instance."""
    return WebhookService(mock_db)


class TestWebhookPayload:
    """Test webhook payload generation."""

    def test_create_payload_minimal(self):
        """Test creating minimal payload."""
        payload = WebhookPayload.create_payload(
            event_type="test.event",
            entity_type="test",
            entity_id=123,
            entity_data={"name": "Test Entity"}
        )

        assert payload["event"]["type"] == "test.event"
        assert payload["event"]["source"] == "project_manager_api"
        assert "timestamp" in payload["event"]
        assert payload["entity"]["type"] == "test"
        assert payload["entity"]["id"] == 123
        assert payload["entity"]["data"]["name"] == "Test Entity"
        assert payload["user"] is None
        assert payload["metadata"] == {}

    def test_create_payload_with_user(self):
        """Test creating payload with user data."""
        payload = WebhookPayload.create_payload(
            event_type="test.event",
            entity_type="test",
            entity_id=123,
            entity_data={"name": "Test"},
            user_id=456,
            user_data={"username": "testuser", "email": "test@example.com"}
        )

        assert payload["user"]["id"] == 456
        assert payload["user"]["data"]["username"] == "testuser"
        assert payload["user"]["data"]["email"] == "test@example.com"

    def test_create_payload_with_metadata(self):
        """Test creating payload with metadata."""
        payload = WebhookPayload.create_payload(
            event_type="test.event",
            entity_type="test",
            entity_id=123,
            entity_data={},
            metadata={"project_name": "Test Project", "priority": "high"}
        )

        assert payload["metadata"]["project_name"] == "Test Project"
        assert payload["metadata"]["priority"] == "high"


class TestWebhookService:
    """Test webhook service."""

    @pytest.mark.asyncio
    async def test_send_webhook_success(self, webhook_service, mock_db):
        """Test successful webhook delivery."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = '{"success": true}'

        with patch('httpx.AsyncClient') as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.post = AsyncMock(return_value=mock_response)
            mock_client.return_value.__aenter__.return_value = mock_client_instance

            result = await webhook_service.send_webhook(
                event_type=WebhookEventType.PROJECT_CREATED,
                entity_type="project",
                entity_id=1,
                entity_data={"name": "Test Project"},
                user_id=1,
                user_data={"username": "testuser"},
                webhook_url="http://test.com/webhook"
            )

            # Verify HTTP call was made
            mock_client_instance.post.assert_called_once()
            call_args = mock_client_instance.post.call_args
            assert call_args[0][0] == "http://test.com/webhook"
            assert call_args[1]["headers"]["X-Event-Type"] == WebhookEventType.PROJECT_CREATED

            # Verify audit record was created
            mock_db.add.assert_called_once()
            mock_db.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_send_webhook_failure_with_retry(self, webhook_service, mock_db):
        """Test webhook failure triggers retries."""
        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.text = "Internal Server Error"

        with patch('httpx.AsyncClient') as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.post = AsyncMock(return_value=mock_response)
            mock_client.return_value.__aenter__.return_value = mock_client_instance

            with patch('asyncio.sleep', new=AsyncMock()):  # Speed up test
                result = await webhook_service.send_webhook(
                    event_type=WebhookEventType.TASK_CREATED,
                    entity_type="task",
                    entity_id=1,
                    entity_data={"title": "Test Task"},
                    webhook_url="http://test.com/webhook"
                )

            # Should retry 3 times
            assert mock_client_instance.post.call_count == 3

            # Verify audit record shows failure
            audit_call = mock_db.add.call_args[0][0]
            assert isinstance(audit_call, WebhookEvent)
            assert audit_call.success is False
            assert audit_call.retry_count == 3

    @pytest.mark.asyncio
    async def test_send_webhook_timeout(self, webhook_service, mock_db):
        """Test webhook timeout handling."""
        with patch('httpx.AsyncClient') as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.post = AsyncMock(side_effect=httpx.TimeoutException("Timeout"))
            mock_client.return_value.__aenter__.return_value = mock_client_instance

            with patch('asyncio.sleep', new=AsyncMock()):
                result = await webhook_service.send_webhook(
                    event_type=WebhookEventType.PROJECT_UPDATED,
                    entity_type="project",
                    entity_id=1,
                    entity_data={},
                    webhook_url="http://test.com/webhook"
                )

            # Verify timeout was logged
            audit_call = mock_db.add.call_args[0][0]
            assert "Timeout" in audit_call.error_message
            assert audit_call.success is False

    @pytest.mark.asyncio
    async def test_send_webhook_no_url_configured(self, webhook_service, mock_db):
        """Test handling when no webhook URL is configured."""
        result = await webhook_service.send_webhook(
            event_type=WebhookEventType.TASK_COMPLETED,
            entity_type="task",
            entity_id=1,
            entity_data={},
            webhook_url=None
        )

        audit_call = mock_db.add.call_args[0][0]
        assert audit_call.success is False
        assert "No webhook URL configured" in audit_call.error_message

    @pytest.mark.asyncio
    async def test_send_webhook_with_default_url(self, webhook_service, mock_db):
        """Test using default N8N URL from settings."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = "OK"

        with patch('backend.app.services.webhooks.settings') as mock_settings:
            mock_settings.N8N_URL = "http://n8n.local"

            with patch('httpx.AsyncClient') as mock_client:
                mock_client_instance = AsyncMock()
                mock_client_instance.post = AsyncMock(return_value=mock_response)
                mock_client.return_value.__aenter__.return_value = mock_client_instance

                result = await webhook_service.send_webhook(
                    event_type=WebhookEventType.PROJECT_CREATED,
                    entity_type="project",
                    entity_id=1,
                    entity_data={}
                )

                # Verify default URL was used with webhook path appended
                call_args = mock_client_instance.post.call_args
                assert "n8n.local" in call_args[0][0]
                assert "webhook" in call_args[0][0]

    def test_get_recent_events(self, webhook_service, mock_db):
        """Test retrieving recent webhook events."""
        mock_query = Mock()
        mock_db.query.return_value = mock_query
        mock_query.filter.return_value = mock_query
        mock_query.order_by.return_value = mock_query
        mock_query.limit.return_value = mock_query
        mock_query.all.return_value = []

        result = webhook_service.get_recent_events(limit=50)

        mock_db.query.assert_called_once()
        mock_query.limit.assert_called_with(50)

    def test_get_recent_events_with_filters(self, webhook_service, mock_db):
        """Test filtering recent events."""
        mock_query = Mock()
        mock_db.query.return_value = mock_query
        mock_query.filter.return_value = mock_query
        mock_query.order_by.return_value = mock_query
        mock_query.limit.return_value = mock_query
        mock_query.all.return_value = []

        result = webhook_service.get_recent_events(
            limit=10,
            event_type="project.created",
            success_only=True
        )

        # Should call filter twice (event_type and success)
        assert mock_query.filter.call_count == 2

    def test_get_failed_events(self, webhook_service, mock_db):
        """Test retrieving failed events."""
        mock_query = Mock()
        mock_db.query.return_value = mock_query
        mock_query.filter.return_value = mock_query
        mock_query.order_by.return_value = mock_query
        mock_query.limit.return_value = mock_query
        mock_query.all.return_value = []

        result = webhook_service.get_failed_events(limit=25)

        mock_query.limit.assert_called_with(25)


class TestWebhookEventTypes:
    """Test webhook event type constants."""

    def test_event_type_constants(self):
        """Verify event type constants are properly defined."""
        assert WebhookEventType.PROJECT_CREATED == "project.created"
        assert WebhookEventType.PROJECT_UPDATED == "project.updated"
        assert WebhookEventType.PROJECT_DELETED == "project.deleted"
        assert WebhookEventType.TASK_CREATED == "task.created"
        assert WebhookEventType.TASK_UPDATED == "task.updated"
        assert WebhookEventType.TASK_DELETED == "task.deleted"
        assert WebhookEventType.TASK_ASSIGNED == "task.assigned"
        assert WebhookEventType.TASK_COMPLETED == "task.completed"


class TestWebhookEdgeCases:
    """Test edge cases and error scenarios."""

    @pytest.mark.asyncio
    async def test_invalid_json_payload(self, webhook_service, mock_db):
        """Test handling of invalid entity data."""
        # Entity data with non-serializable content should be handled
        result = await webhook_service.send_webhook(
            event_type="test.event",
            entity_type="test",
            entity_id=1,
            entity_data={"valid": "data"},
            webhook_url="http://test.com/webhook"
        )

        # Should still create audit record
        mock_db.add.assert_called_once()

    @pytest.mark.asyncio
    async def test_large_response_body_truncation(self, webhook_service, mock_db):
        """Test response body is truncated for storage."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = "x" * 2000  # Large response

        with patch('httpx.AsyncClient') as mock_client:
            mock_client_instance = AsyncMock()
            mock_client_instance.post = AsyncMock(return_value=mock_response)
            mock_client.return_value.__aenter__.return_value = mock_client_instance

            result = await webhook_service.send_webhook(
                event_type="test.event",
                entity_type="test",
                entity_id=1,
                entity_data={},
                webhook_url="http://test.com/webhook"
            )

            # Response should be truncated to 1000 chars
            audit_call = mock_db.add.call_args[0][0]
            assert len(audit_call.response_body) == 1000

