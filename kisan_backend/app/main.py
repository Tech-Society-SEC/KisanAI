from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import models
from app.models.database import engine

# Routers
from app.routes.user_routes import router as user_router
from app.routes.login_routes import router as login_router
from app.routes.market_routes import router as market_router
from app.routes.diagnosis_routes import router as diagnosis_router
from app.routes.scheme_routes import router as scheme_router
from app.routes.notification_routes import router as notification_router
from app.routes.help_routes import router as help_router
from app.routes.voice_agent_routes import router as voice_agent_router

# ---------------- APSCHEDULER ---------------------
from apscheduler.schedulers.background import BackgroundScheduler
import subprocess
import sys

# ---------------- FASTAPI APP ---------------------
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kisan+ Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(user_router)
app.include_router(login_router)
app.include_router(market_router)
app.include_router(diagnosis_router)
app.include_router(scheme_router)
app.include_router(voice_agent_router)
app.include_router(notification_router)
app.include_router(help_router)

@app.get("/")
def read_root():
    return {"message": "Kisan+ Backend API Running"}

# ---------------- SCHEDULER JOBS ---------------------

def scheduled_market_price_update():
    print("APScheduler: Fetching latest market prices...")
    subprocess.run([sys.executable, "scripts/fetch_market_api.py"])

def scheduled_scheme_update():
    print("APScheduler: Fetching farmer schemes...")
    subprocess.run([sys.executable, "scripts/fetch_schemes.py"])

# Init scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(scheduled_market_price_update, "interval", minutes=60)
scheduler.add_job(scheduled_scheme_update, "interval", minutes=60)
scheduler.start()
