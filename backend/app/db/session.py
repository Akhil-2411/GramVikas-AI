from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

from app.core.config import settings, BASE_DIR

# Handle SQLite vs PostgreSQL engine options with automatic fallback
engine = None
if settings.DATABASE_URL.startswith("postgresql"):
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            echo=False
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        print(f"[DB Fallback] PostgreSQL unavailable ({e}). Using SQLite fallback.")
        sqlite_url = f"sqlite:///{BASE_DIR}/gramvikas.db"
        engine = create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False},
            echo=False
        )
else:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency injection generator for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_db_connection():
    """Health check for database connectivity"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"[DB Warning] Connection check failed: {e}")
        return False
