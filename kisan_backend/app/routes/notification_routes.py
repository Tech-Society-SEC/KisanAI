 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import Notification
from app.schemas.notification_schema import NotificationRequest, MarkReadRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/notifications")
def get_notifications(req: NotificationRequest, db: Session = Depends(get_db)):
    notes = db.query(Notification).filter(Notification.user_id == req.user_id).all()
    result = [{"id": n.id, "type": n.type, "content": n.content, "read": n.read_flag} for n in notes]
    return {"notifications": result}

@router.post("/notifications/mark_read")
def mark_notification_read(req: MarkReadRequest, db: Session = Depends(get_db)):
    note = db.query(Notification).filter(Notification.id == req.notification_id, Notification.user_id == req.user_id).first()
    if note:
        note.read_flag = True
        db.commit()
        return {"success": True}
    return {"success": False, "message": "Notification not found"}
