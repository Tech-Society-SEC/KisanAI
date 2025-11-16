from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.database import SessionLocal
from app.models.models import User
from app.routes.deps import get_current_user

router = APIRouter(prefix="/user", tags=["User"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/profile")
def get_profile(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "phone": current_user.phone,
        "name": current_user.name,
        "state": current_user.state,
        "district": current_user.district,
        "village": current_user.village,
        "land_size": current_user.land_size,
        "crops": current_user.crops,
        "language": current_user.language
    }


@router.put("/profile/update")
def update_profile(data: dict, current_user=Depends(get_current_user), db: Session = Depends(get_db)):

    for key, value in data.items():
        if hasattr(current_user, key) and value is not None:
            setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)

    return {"message": "Profile updated", "profile": data}
