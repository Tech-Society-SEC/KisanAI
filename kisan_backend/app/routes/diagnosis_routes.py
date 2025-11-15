 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.models.models import CropDiagnosis, User
from app.schemas.diagnosis_schema import DiagnosisRequest
from app.models.diagnosis_ml import classify_disease
from fastapi import UploadFile, File, Form
import datetime
import random

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dummy AIML logic (just chooses random disease for prototype)
DISEASE_MOCK = {
    "wheat": ["Rust", "Powdery Mildew", "Smut"],
    "rice": ["Blast", "Bacterial Leaf Blight", "Brown Spot"],
    "tomato": ["Early Blight", "Late Blight", "Leaf Curl"],
    "onion": ["Downy Mildew", "Purple Blotch"],
    "maize": ["Turcicum Leaf Blight", "Rust"]
}

@router.post("/diagnose")
def diagnose_crop(req: DiagnosisRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    crop = req.crop.lower()
    disease = classify_disease(req.crop, None, req.description)
    diag = CropDiagnosis(
        user_id=req.user_id,
        crop=req.crop,
        photo="",  # Implement file logic later
        result=disease,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(diag)
    db.commit()
    db.refresh(diag)
    return {"result": disease, "diag_id": diag.id, "ts": diag.timestamp}

@router.post("/predict")
async def predict_crop_disease(
    user_id: int = Form(...),
    crop: str = Form(...),
    description: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # In future, call your teammate's AIML model here
    # Save image if uploaded
    image_path = None
    if image:
        contents = await image.read()
        image_path = f"static/uploads/{image.filename}"
        # Save the image file
        with open(image_path, "wb") as f:
            f.write(contents)
    # Call stub function — replace with AIML logic later
    disease = "Healthy"  # Placeholder
    return {"crop": crop, "disease": disease, "image_path": image_path}
