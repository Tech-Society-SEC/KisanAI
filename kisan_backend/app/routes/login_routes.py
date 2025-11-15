from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os

from app.models.database import SessionLocal
from app.models.models import User, RefreshToken
from app.routes.auth_utils import (
    verify_firebase_token,
    create_access_token,
    create_refresh_token,
    hash_token,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login_with_firebase(authorization: str = Header(None), db: Session = Depends(get_db)):

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")

    firebase_token = authorization.split(" ", 1)[1]

    # Verify Firebase token
    try:
        decoded = verify_firebase_token(firebase_token)
    except:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

    firebase_uid = decoded["uid"]
    phone_number = decoded.get("phone_number")

    # Find or create user
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    if not user:
        user = User(
            firebase_uid=firebase_uid,
            phone=phone_number,
            name=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Access token
    access_token = create_access_token({"sub": str(user.id)})

    # Refresh token
    refresh_raw = create_refresh_token()
    refresh_hash = hash_token(refresh_raw)

    refresh_entry = RefreshToken(
        user_id=user.id,
        token_hash=refresh_hash,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=30)
    )

    db.add(refresh_entry)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_raw,
        "user_id": user.id
    }
