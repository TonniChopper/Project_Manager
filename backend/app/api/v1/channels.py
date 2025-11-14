from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...core.dependencies import get_db
from ...core.security import get_current_user
from ...schemas.channel import ChannelCreate, ChannelUpdate, ChannelPublic, ChannelDetail
from ...db.models import Channel, Project

router = APIRouter()


@router.post("/", response_model=ChannelPublic, status_code=status.HTTP_201_CREATED, summary="Create a channel")
def create_channel(payload: ChannelCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    project = db.get(Project, payload.project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project")
    # membership check simplified
    channel = Channel(
        name=payload.name,
        description=payload.description,
        project_id=payload.project_id,
        is_private=payload.is_private,
    )
    db.add(channel)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    db.refresh(channel)
    return channel


@router.get("/project/{project_id}", response_model=List[ChannelPublic], summary="List channels for a project")
def list_project_channels(project_id: int, db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    channels = db.query(Channel).filter(Channel.project_id == project_id).all()
    return channels


@router.get("/{channel_id}", response_model=ChannelDetail, summary="Get channel details")
def get_channel(channel_id: int, db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    channel = db.get(Channel, channel_id)
    if not channel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Channel not found")
    return channel


@router.put("/{channel_id}", response_model=ChannelDetail, summary="Update a channel")
def update_channel(channel_id: int, payload: ChannelUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    channel = db.get(Channel, channel_id)
    if not channel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Channel not found")
    # permission: channel creator/project owner/admin simplified to admin only
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to update this channel")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(channel, field, value)
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return channel


@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a channel")
def delete_channel(channel_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    channel = db.get(Channel, channel_id)
    if not channel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Channel not found")
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this channel")
    db.delete(channel)
    db.commit()
    return None

