 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import Scheme, SchemeApplication, User
from app.schemas.scheme_schema import SchemeEligibilityRequest, SchemeApplicationRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/schemes/eligible")
def get_eligible_schemes(req: SchemeEligibilityRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    eligible = db.query(Scheme).all()  # TODO: Implement real eligibility check based on user data & scheme criteria
    result = [{"id": s.id, "name": s.name, "benefits": s.benefits, "deadline": s.deadline} for s in eligible]
    return {"eligible_schemes": result}

@router.post("/schemes/apply")
def apply_scheme(req: SchemeApplicationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    scheme = db.query(Scheme).filter(Scheme.id == req.scheme_id).first()
    if not user or not scheme:
        raise HTTPException(status_code=404, detail="User or Scheme not found")
    app = SchemeApplication(user_id=user.id, scheme_id=scheme.id, status="Applied")
    db.add(app)
    db.commit()
    db.refresh(app)
    return {"message": "Applied successfully", "application_id": app.id}
