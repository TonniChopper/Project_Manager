"""Add webhook_events table for audit logging

Revision ID: add_webhook_events
Revises:
Create Date: 2025-11-14 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_webhook_events'
down_revision = None  # Update this to your latest migration
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create webhook_events table."""
    op.create_table(
        'webhook_events',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('event_type', sa.String(length=100), nullable=False),
        sa.Column('entity_type', sa.String(length=50), nullable=False),
        sa.Column('entity_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('webhook_url', sa.String(length=512), nullable=False),
        sa.Column('payload', sa.Text(), nullable=False),
        sa.Column('status_code', sa.Integer(), nullable=True),
        sa.Column('response_body', sa.Text(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('retry_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('success', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes for performance
    op.create_index('ix_webhook_events_type_created', 'webhook_events', ['event_type', 'created_at'])
    op.create_index('ix_webhook_events_success', 'webhook_events', ['success', 'created_at'])
    op.create_index('ix_webhook_events_entity', 'webhook_events', ['entity_type', 'entity_id'])


def downgrade() -> None:
    """Drop webhook_events table and indexes."""
    op.drop_index('ix_webhook_events_entity', table_name='webhook_events')
    op.drop_index('ix_webhook_events_success', table_name='webhook_events')
    op.drop_index('ix_webhook_events_type_created', table_name='webhook_events')
    op.drop_table('webhook_events')

