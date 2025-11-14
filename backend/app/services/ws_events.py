"""
Integration helpers for broadcasting business events via WebSocket.
Use these functions from your service layer to notify clients of changes.
"""
from typing import Optional, Dict, Any
from ..services.ws_service import broadcast_event, notify_user
from ..core.logging import logger


async def notify_task_created(task_id: int, project_id: int, task_data: Dict[str, Any], creator_username: str):
    """
    Notify all project members of new task.

    Args:
        task_id: Task ID
        project_id: Project ID
        task_data: Task details (title, status, priority, assignee, etc.)
        creator_username: Username of creator
    """
    await broadcast_event(
        event_type="task.created",
        room=f"project:{project_id}",
        data={
            "task_id": task_id,
            **task_data
        },
        sender_username=creator_username
    )
    logger.info(f"Task {task_id} created in project {project_id} by {creator_username}")


async def notify_task_updated(task_id: int, project_id: int, changes: Dict[str, Any], updater_username: str):
    """
    Notify project members of task update.

    Args:
        task_id: Task ID
        project_id: Project ID
        changes: Changed fields
        updater_username: Username of updater
    """
    await broadcast_event(
        event_type="task.updated",
        room=f"project:{project_id}",
        data={
            "task_id": task_id,
            "changes": changes
        },
        sender_username=updater_username
    )


async def notify_task_status_changed(
    task_id: int,
    project_id: int,
    old_status: str,
    new_status: str,
    changed_by_username: str
):
    """Notify of task status change."""
    await broadcast_event(
        event_type="task.status_changed",
        room=f"project:{project_id}",
        data={
            "task_id": task_id,
            "old_status": old_status,
            "new_status": new_status,
            "changed_by": changed_by_username
        },
        sender_username=changed_by_username
    )


async def notify_task_assigned(
    task_id: int,
    project_id: int,
    assignee_id: int,
    assignee_username: str,
    task_title: str,
    assigner_username: str
):
    """
    Notify assignee and project members of task assignment.

    Args:
        task_id: Task ID
        project_id: Project ID
        assignee_id: Assignee user ID
        assignee_username: Assignee username
        task_title: Task title
        assigner_username: Who assigned the task
    """
    # Broadcast to project
    await broadcast_event(
        event_type="task.assigned",
        room=f"project:{project_id}",
        data={
            "task_id": task_id,
            "assignee": assignee_username,
            "title": task_title
        },
        sender_username=assigner_username
    )

    # Personal notification to assignee
    await notify_user(
        user_id=assignee_id,
        notification_type="task_assigned",
        data={
            "task_id": task_id,
            "task_title": task_title,
            "assigned_by": assigner_username,
            "project_id": project_id
        }
    )


async def notify_message_new(channel_id: int, message_id: int, message_data: Dict[str, Any], author_username: str):
    """
    Broadcast new message to channel members.

    Args:
        channel_id: Channel ID
        message_id: Message ID
        message_data: Message content and metadata
        author_username: Message author
    """
    await broadcast_event(
        event_type="message.new",
        room=f"channel:{channel_id}",
        data={
            "message_id": message_id,
            **message_data
        },
        sender_username=author_username
    )


async def notify_message_edited(channel_id: int, message_id: int, new_content: str, editor_username: str):
    """Notify of message edit."""
    await broadcast_event(
        event_type="message.edited",
        room=f"channel:{channel_id}",
        data={
            "message_id": message_id,
            "new_content": new_content
        },
        sender_username=editor_username
    )


async def notify_message_deleted(channel_id: int, message_id: int, deleter_username: str):
    """Notify of message deletion."""
    await broadcast_event(
        event_type="message.deleted",
        room=f"channel:{channel_id}",
        data={
            "message_id": message_id
        },
        sender_username=deleter_username
    )


async def notify_project_updated(project_id: int, changes: Dict[str, Any], updater_username: str):
    """Notify project members of project update."""
    await broadcast_event(
        event_type="project.updated",
        room=f"project:{project_id}",
        data={
            "project_id": project_id,
            "changes": changes
        },
        sender_username=updater_username
    )


async def notify_project_archived(project_id: int, archiver_username: str):
    """Notify project members of project archival."""
    await broadcast_event(
        event_type="project.archived",
        room=f"project:{project_id}",
        data={
            "project_id": project_id
        },
        sender_username=archiver_username
    )


async def send_user_notification(
    user_id: int,
    title: str,
    message: str,
    link: Optional[str] = None,
    priority: str = "normal"
):
    """
    Send personal notification to user.

    Args:
        user_id: User ID
        title: Notification title
        message: Notification message
        link: Optional link to resource
        priority: Priority level (low, normal, high)
    """
    await notify_user(
        user_id=user_id,
        notification_type="new",
        data={
            "title": title,
            "message": message,
            "link": link,
            "priority": priority
        }
    )


async def notify_user_mentioned(
    user_id: int,
    mentioned_by_username: str,
    context: str,
    link: str
):
    """Notify user of being mentioned."""
    await notify_user(
        user_id=user_id,
        notification_type="mentioned",
        data={
            "mentioned_by": mentioned_by_username,
            "context": context,
            "link": link
        }
    )


# Example usage in service layer:
"""
from backend.app.services.ws_events import notify_task_created

async def create_task(db: Session, task_data: TaskCreate, creator_id: int):
    # Create task in DB
    task = Task(**task_data.dict(), creator_id=creator_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Notify via WebSocket
    await notify_task_created(
        task_id=task.id,
        project_id=task.project_id,
        task_data={
            "title": task.title,
            "status": task.status.value,
            "priority": task.priority.value,
            "assignee": task.assignee.username if task.assignee else None
        },
        creator_username=task.creator.username
    )
    
    return task
"""

