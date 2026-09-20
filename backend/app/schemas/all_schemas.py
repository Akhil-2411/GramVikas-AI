from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# ================= AUTH SCHEMAS =================
class UserSignUp(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    role: str = Field("entrepreneur", pattern="^(entrepreneur|admin)$")
    language: str = "English"

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    language: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ================= BUSINESS ADVISORY SCHEMAS =================
class AnalyzeBusinessRequest(BaseModel):
    district: str
    village: Optional[str] = ""
    business_category: Optional[str] = "All"
    margin_capital: float = Field(100000.0, gt=0)
    gender: Optional[str] = "Male"
    social_category: Optional[str] = "General" # General, OBC, SC, ST, Minorities
    industry_preference: Optional[str] = "Any"

class SWOTItem(BaseModel):
    point: str
    why: str # AI causal explanation

class SWOTData(BaseModel):
    strengths: List[SWOTItem]
    weaknesses: List[SWOTItem]
    opportunities: List[SWOTItem]
    threats: List[SWOTItem]

class BusinessRecommendation(BaseModel):
    rank: int
    title: str
    category: str
    opportunity_score: float
    competition_score: float
    risk_score: float
    investment_required: float
    estimated_revenue: float
    profit_margin: float
    description: str
    swot: Optional[SWOTData] = None

class AnalyzeBusinessResponse(BaseModel):
    district: str
    village: str
    opportunity_score: float
    competition_score: float
    risk_score: float
    verdict: str
    recommendations: List[BusinessRecommendation]
    district_overview: Dict[str, Any]

# ================= FINANCIAL SCHEMAS =================
class FinancialCalculationRequest(BaseModel):
    margin_capital: float = Field(..., gt=0)
    project_cost: Optional[float] = None
    interest_rate: Optional[float] = None
    loan_tenure_years: Optional[int] = None

class YearlyCashflow(BaseModel):
    year: int
    gross_revenue: float
    operating_expenses: float
    loan_repayment: float
    net_profit: float
    cash_reserve: float

class FinancialCalculationResponse(BaseModel):
    margin_capital: float
    project_cost: float
    loan_amount: float
    scheme: str
    interest_rate: float
    tenure_years: int
    moratorium_months: int
    monthly_emi: float
    quarterly_emi: float
    total_interest: float
    total_repayment: float
    eligibility: str # "ELIGIBLE" | "NOT ELIGIBLE"
    roi_percent: float
    break_even_months: int
    financial_viability_score: float
    first_emi_note: str
    cashflow_forecast: List[YearlyCashflow]

# ================= SCHEME SCHEMAS =================
class SchemeFilterRequest(BaseModel):
    gender: Optional[str] = "All"
    category: Optional[str] = "General"
    budget: Optional[float] = 1000000.0
    business_type: Optional[str] = "Manufacturing"

class SchemeItem(BaseModel):
    id: str
    name: str
    ministry: str
    coverage_pct: float
    max_loan_lakhs: float
    interest_rate: float
    subsidy_rate: float
    tenure_years: int
    moratorium_months: int
    eligibility: str
    eligible: bool
    benefits: str
    required_documents: List[str]
    target_beneficiaries: str

class SchemeResponse(BaseModel):
    eligible_schemes: List[SchemeItem]
    top_recommended: Optional[SchemeItem] = None
    total_count: int

# ================= GEO & RADIUS SCHEMAS =================
class VillageItem(BaseModel):
    id: str
    district: str
    mandal: str
    village_name: str
    latitude: float
    longitude: float
    distance_km: Optional[float] = None

class RadiusSearchRequest(BaseModel):
    district: str
    village_name: str
    radius_km: float = Field(5.0, ge=1.0, le=50.0)

class RadiusSearchResponse(BaseModel):
    center_village: str
    center_district: str
    center_lat: float
    center_lon: float
    radius_km: float
    nearby_villages_count: int
    nearby_villages: List[VillageItem]
    nearby_enterprises_count: int
    estimated_consumer_reach: int
    business_density: str # 'Low' | 'Moderate' | 'High'
    competition_density: str
    opportunity_density: str

# ================= ANALYTICS & MARKET GAP SCHEMAS =================
class DistrictRankItem(BaseModel):
    district_name: str
    total_msmes: int
    competition: str
    opportunity_score: float
    micro: int
    small: int
    medium: int

class MarketGapSector(BaseModel):
    sector_name: str
    demand_level: str # 'Very High' | 'High' | 'Moderate'
    supply_saturation: str # 'Low' | 'Moderate' | 'Saturated'
    gap_index: float # 0 to 100
    suggested_businesses: List[str]

class MarketGapResponse(BaseModel):
    district: str
    underserved_sectors: List[MarketGapSector]
    high_demand_sectors: List[MarketGapSector]
    saturated_sectors: List[MarketGapSector]
    opportunity_matrix: Dict[str, Any]

# ================= AI CHAT SCHEMAS =================
class AIChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = "default-session"
    district: Optional[str] = None
    village: Optional[str] = None
    category: Optional[str] = None

class AIChatResponse(BaseModel):
    answer: str
    session_id: str
    suggested_prompts: List[str]

# ================= REPORT SCHEMAS =================
class ReportGenerateRequest(BaseModel):
    district: str
    village: str
    business_category: str
    margin_capital: float
    include_gis: bool = True
    include_swot: bool = True
    include_financial: bool = True

class ReportSummary(BaseModel):
    id: str
    title: str
    report_type: str
    created_at: str
    download_url: str
