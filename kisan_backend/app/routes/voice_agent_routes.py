 
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import SessionLocal
from app.schemas.voice_agent_schema import VoiceAgentRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/voice-agent")
def handle_voice_agent(req: VoiceAgentRequest, db: Session = Depends(get_db)):
    intent = req.intent.lower()
    response = {}
    if intent == "diagnose":
        crop = req.parameters.get("crop", "")
        # Call your /diagnose endpoint logic here
        response = {"action": "diagnose", "crop": crop, "result": "Diagnosis logic to call"}
    elif intent == "market":
        crop = req.parameters.get("crop", "")
        # Call your /market endpoint logic here
        response = {"action": "market price", "crop": crop, "result": "Market logic to call"}
    elif intent == "schemes":
        # Call your /schemes/eligible endpoint logic here
        response = {"action": "eligible schemes", "result": "Scheme logic to call"}
    else:
        response = {"message": "Intent not recognized"}
    return response
