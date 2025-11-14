from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from ...core.dependencies import get_db
from ...core.security import get_current_user
from ...schemas.message import MessageCreate, MessageUpdate, MessagePublic, MessageDetail
from ...db.models import Message, Channel, User

router = APIRouter()


@router.post("/", response_model=MessagePublic, status_code=status.HTTP_201_CREATED, summary="Create a message")
def create_message(payload: MessageCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    channel = db.get(Channel, payload.channel_id)
    if not channel:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid channel")
    # parent message validation
    if payload.parent_id:
        parent = db.get(Message, payload.parent_id)
        if not parent or parent.channel_id != payload.channel_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid parent message")
    username = current_user.get("username")
    user_row = db.execute("SELECT * FROM users WHERE username = :u", {"u": username}).mappings().first()
    if not user_row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    message = Message(
        content=payload.content,
        channel_id=payload.channel_id,
        parent_id=payload.parent_id,
        author_id=user_row["id"],
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/channel/{channel_id}", response_model=List[MessagePublic], summary="List messages for a channel")
def list_channel_messages(channel_id: int, limit: int = Query(50), offset: int = Query(0), db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    channel = db.get(Channel, channel_id)
    if not channel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Channel not found")
    q = db.query(Message).filter(Message.channel_id == channel_id).order_by(Message.created_at.desc())
    return q.offset(offset).limit(limit).all()


@router.get("/{message_id}", response_model=MessageDetail, summary="Get a message")
def get_message(message_id: int, db: Session = Depends(get_db), current_user: dict | None = Depends(get_current_user)):
    message = db.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return message


@router.put("/{message_id}", response_model=MessageDetail, summary="Edit a message")
def update_message(message_id: int, payload: MessageUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    message = db.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    username = current_user.get("username")
    user_row = db.execute("SELECT * FROM users WHERE username = :u", {"u": username}).mappings().first()
    if not user_row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    if user_row["id"] != message.author_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to edit this message")
    message.content = payload.content
    message.is_edited = True
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a message")
def delete_message(message_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    message = db.get(Message, message_id)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    username = current_user.get("username")
    user_row = db.execute("SELECT * FROM users WHERE username = :u", {"u": username}).mappings().first()
    if not user_row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in DB")
    # allow author or admin or project owner (project owner check omitted for brevity)
    if user_row["id"] != message.author_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this message")
    db.delete(message)
    db.commit()
    return None

