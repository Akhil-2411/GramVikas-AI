import hmac
import hashlib
import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from app.core.config import settings

def hash_password(password: str) -> str:
    """Hash a password using salt and SHA-256 with key stretching (PBKDF2)"""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt.hex() + ":" + key.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored salt:hash string"""
    try:
        salt_hex, key_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_key = bytes.fromhex(key_hex)
        key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, 100000)
        return hmac.compare_digest(key, expected_key)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate signed JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None

def create_reset_token(email: str) -> str:
    """Generate a password reset token valid for 1 hour"""
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode = {"sub": email, "type": "reset", "exp": expire}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def verify_reset_token(token: str) -> Optional[str]:
    """Verify password reset token and return email if valid"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "reset":
            return None
        return payload.get("sub")
    except Exception:
        return None

