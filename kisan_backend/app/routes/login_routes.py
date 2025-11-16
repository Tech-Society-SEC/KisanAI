# app/routes/login_routes.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

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
    # Validate header
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing auth token")
    firebase_token = authorization.split(" ", 1)[1]

    # Verify Token
    try:
        decoded = verify_firebase_token(firebase_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {e}")

    firebase_uid = decoded.get("uid") or decoded.get("user_id") or decoded.get("sub")
    phone_number = decoded.get("phone_number") or decoded.get("phone")

    if not firebase_uid:
        raise HTTPException(status_code=400, detail="Firebase token did not contain uid")

    # Find or create user
    try:
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    except Exception as e:
        # DB schema mismatch will raise here
        raise HTTPException(status_code=500, detail=f"DB error: {e}")

    if not user:
        user = User(firebase_uid=firebase_uid, phone=phone_number, name=None)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create access + refresh tokens
    access_token = create_access_token({"sub": str(user.id)})
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
        "user_id": user.id,
        "profile_complete": bool(user.name and user.state)
    }
