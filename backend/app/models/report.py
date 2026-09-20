import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey
from app.db.session import Base

class BusinessReport(Base):
    __tablename__ = "business_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    district = Column(String(100), nullable=False)
    village = Column(String(150), nullable=False)
    business_category = Column(String(150), nullable=False)
    margin_capital = Column(Float, default=100000.0)
    opportunity_score = Column(Float, nullable=False)
    competition_score = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    swot_json = Column(Text, nullable=True) # JSON string
    recommendations_json = Column(Text, nullable=True) # JSON string
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class FinancialReport(Base):
    __tablename__ = "financial_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    margin_capital = Column(Float, nullable=False)
    project_cost = Column(Float, nullable=False)
    loan_amount = Column(Float, nullable=False)
    scheme = Column(String(150), nullable=False)
    interest_rate = Column(Float, nullable=False)
    tenure_years = Column(Integer, nullable=False)
    moratorium_months = Column(Integer, nullable=False)
    monthly_emi = Column(Float, nullable=False)
    quarterly_emi = Column(Float, nullable=False)
    total_interest = Column(Float, nullable=False)
    total_repayment = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SchemeResult(Base):
    __tablename__ = "scheme_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    scheme_name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    eligibility_status = Column(String(50), nullable=False) # 'ELIGIBLE' | 'NOT ELIGIBLE'
    subsidy_percentage = Column(Float, default=0.0)
    max_subsidy = Column(Float, default=0.0)
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SavedReport(Base):
    __tablename__ = "saved_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    report_type = Column(String(100), default="Business Advisory")
    title = Column(String(255), nullable=False)
    data_json = Column(Text, nullable=False)
    pdf_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RadiusSearch(Base):
    __tablename__ = "radius_searches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    district = Column(String(100), nullable=False)
    village_name = Column(String(150), nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    radius_km = Column(Float, nullable=False)
    nearby_villages_count = Column(Integer, default=0)
    nearby_enterprises_count = Column(Integer, default=0)
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AIChatHistory(Base):
    __tablename__ = "ai_chat_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(100), nullable=False, index=True)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
