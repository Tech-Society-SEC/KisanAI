from app.routes.diagnosis_routes import router as diagnosis_router
from fastapi import FastAPI
from app.models.database import SessionLocal, engine
from app.models import models

app = FastAPI()
app.include_router(diagnosis_router)

@app.get("/")
def read_root():
    return {"message": "Kisan+ Backend API Running"}

