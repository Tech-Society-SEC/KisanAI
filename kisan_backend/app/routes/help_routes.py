 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import HelpHistory
from app.schemas.help_schema import HelpHistoryRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/help/history")
def get_help_history(req: HelpHistoryRequest, db: Session = Depends(get_db)):
    records = db.query(HelpHistory).filter(HelpHistory.user_id == req.user_id).all()
    result = [{"id": r.id, "query": r.query, "result": r.result, "timestamp": r.timestamp} for r in records]
    return {"history": result}
