from app.routes.diagnosis_routes import router as diagnosis_router
from app.routes.user_routes import router as user_router
from app.routes.login_routes import router as login_router

from fastapi import FastAPI
from app.models.database import SessionLocal, engine
from app.models import models

app = FastAPI()
app.include_router(user_router)
app.include_router(diagnosis_router)
app.include_router(login_router)


@app.get("/")
def read_root():
    return {"message": "Kisan+ Backend API Running"}

