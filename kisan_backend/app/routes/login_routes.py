 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import SessionLocal
from models.models import User
from schemas.login_schema import LoginRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.phone == data.phone).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    # For demo purposes, accept any OTP; in real app, validate OTP flow
    return {"message": "Login successful", "user_id": db_user.id}
