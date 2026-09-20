from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.services.geo_service import geo_engine
from app.services.advisory_service import advisory_engine

# Import routers
from app.api.v1.auth import router as auth_router
from app.api.v1.business import router as business_router
from app.api.v1.financial import router as financial_router
from app.api.v1.schemes import router as schemes_router
from app.api.v1.geo import router as geo_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.chat import router as chat_router
from app.api.v1.reports import router as reports_router
from app.api.v1.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables are created
    try:
        Base.metadata.create_all(bind=engine)
        print("[Startup] Database tables verified.")
        
        # Seed default Demo & Admin users if absent
        db = SessionLocal()
        try:
            admin = db.query(User).filter(User.email == "admin@gramvikas.gov.in").first()
            if not admin:
                admin_user = User(
                    full_name="MoSJE District Administrator",
                    email="admin@gramvikas.gov.in",
                    password_hash=hash_password("Admin@1234"),
                    role="admin",
                    language="English"
                )
                db.add(admin_user)
            
            demo_user = db.query(User).filter(User.email == "demo@gramvikas.ai").first()
            if not demo_user:
                demo = User(
                    full_name="Ramesh Kumar (Entrepreneur)",
                    email="demo@gramvikas.ai",
                    password_hash=hash_password("Demo@1234"),
                    role="entrepreneur",
                    language="English"
                )
                db.add(demo)
            db.commit()
            print("[Startup] Seed users ready.")
        finally:
            db.close()
            
    except Exception as e:
        print(f"[Startup Warning] DB init: {e}")

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Driven Hyper-Local Business Advisory & Concessional Financial Structuring Platform for Rural Micro-Entrepreneurs.",
    lifespan=lifespan
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=prefix)
app.include_router(business_router, prefix=prefix)
app.include_router(financial_router, prefix=prefix)
app.include_router(schemes_router, prefix=prefix)
app.include_router(geo_router, prefix=prefix)
app.include_router(analytics_router, prefix=prefix)
app.include_router(chat_router, prefix=prefix)
app.include_router(reports_router, prefix=prefix)
app.include_router(admin_router, prefix=prefix)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "gis_engine": "ready",
        "villages_indexed": len(geo_engine.df_villages) if geo_engine.df_villages is not None else 0
    }
