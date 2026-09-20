from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.all_schemas import (
    AnalyzeBusinessRequest,
    AnalyzeBusinessResponse,
    SWOTData
)
from app.services.advisory_service import advisory_engine
from app.services.swot_service import generate_swot

router = APIRouter(prefix="/business", tags=["Business Advisory Engine"])

@router.post("/recommend", response_model=AnalyzeBusinessResponse)
def get_business_recommendations(payload: AnalyzeBusinessRequest):
    """
    Generate tailored business recommendations with opportunity scores,
    competition ratings, investment sizing, and SWOT reports.
    """
    return advisory_engine.analyze_business(payload)

@router.get("/swot", response_model=SWOTData)
def get_swot_analysis(
    title: str = Query("Milk Chilling & Dairy Value-Add Center"),
    category: str = Query("Dairy & Animal Husbandry"),
    district: str = Query("Nalgonda"),
    competition: str = Query("Medium"),
    margin_capital: float = Query(100000.0)
):
    """
    Generate AI SWOT Analysis with causal explanations (WHY each factor exists).
    """
    return generate_swot(
        business_title=title,
        business_category=category,
        district=district,
        competition_level=competition,
        margin_capital=margin_capital
    )

@router.get("/opportunities")
def get_district_opportunities(district: str = Query("Adilabad")):
    """
    List high-opportunity business clusters for the requested district.
    """
    req = AnalyzeBusinessRequest(district=district, margin_capital=100000.0)
    res = advisory_engine.analyze_business(req)
    return {
        "district": res.district,
        "opportunity_score": res.opportunity_score,
        "verdict": res.verdict,
        "top_opportunities": res.recommendations
    }
