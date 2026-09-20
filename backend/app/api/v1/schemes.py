from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.all_schemas import SchemeFilterRequest, SchemeResponse, SchemeItem
from app.services.scheme_service import recommend_schemes, GOVERNMENT_SCHEMES_DATABASE

router = APIRouter(prefix="/schemes", tags=["Government Scheme Finder"])

@router.post("/recommend", response_model=SchemeResponse)
def get_scheme_recommendations(req: SchemeFilterRequest):
    """
    Recommend eligible concessional government schemes, subsidies,
    and document checklists based on applicant profile and project budget.
    """
    return recommend_schemes(
        gender=req.gender,
        category=req.category,
        budget=req.budget,
        business_type=req.business_type
    )

@router.get("/all")
def list_all_schemes():
    """Retrieve full catalog of available MoSJE and MSME government schemes"""
    return {
        "total_schemes": len(GOVERNMENT_SCHEMES_DATABASE),
        "schemes": GOVERNMENT_SCHEMES_DATABASE
    }

@router.get("/{scheme_id}", response_model=Optional[SchemeItem])
def get_scheme_detail(scheme_id: str):
    """Fetch details for a specific scheme by ID"""
    for s in GOVERNMENT_SCHEMES_DATABASE:
        if s.id == scheme_id:
            return s
    return None
