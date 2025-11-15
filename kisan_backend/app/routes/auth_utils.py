import os, json, secrets
from datetime import datetime, timedelta
from jose import jwt
from passlib.hash import bcrypt
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

SECRET_KEY = os.getenv("SECRET_KEY", "change_this_now")
ALGORITHM = "HS256"
ACCESS_EXPIRE_MINUTES = int(os.getenv("ACCESS_EXPIRE_MINUTES", "15"))
REFRESH_EXPIRE_DAYS = int(os.getenv("REFRESH_EXPIRE_DAYS", "30"))
FIREBASE_CRED_JSON = os.getenv("FIREBASE_CRED_JSON")

# Initialize Firebase Admin
if not firebase_admin._apps:
    if FIREBASE_CRED_JSON.strip().startswith("{"):
        cred = credentials.Certificate(json.loads(FIREBASE_CRED_JSON))
    else:
        cred = credentials.Certificate(FIREBASE_CRED_JSON)
    firebase_admin.initialize_app(cred)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token():
    return secrets.token_urlsafe(48)

def hash_token(token: str):
    return bcrypt.hash(token)

def verify_refresh_hash(token, token_hash):
    return bcrypt.verify(token, token_hash)

def verify_firebase_token(id_token: str):
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded
    except Exception as e:
        raise e
