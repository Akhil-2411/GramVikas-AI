import json
from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.report import BusinessReport
from app.schemas.all_schemas import (
    AnalyzeBusinessRequest,
    AnalyzeBusinessResponse,
    SWOTData
)
from app.services.advisory_service import advisory_engine
from app.services.swot_service import generate_swot
from app.api.v1.auth import get_optional_user

router = APIRouter(prefix="/business", tags=["Business Advisory Engine"])

@router.post("/recommend", response_model=AnalyzeBusinessResponse)
def get_business_recommendations(
    payload: AnalyzeBusinessRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Generate tailored business recommendations with opportunity scores,
    competition ratings, investment sizing, and SWOT reports.
    Persists report if user is authenticated.
    """
    res = advisory_engine.analyze_business(payload)

    # Persist in BusinessReport table if authenticated user
    if current_user:
        try:
            top_rec = res.recommendations[0] if res.recommendations else None
            report = BusinessReport(
                user_id=current_user.id,
                district=res.district,
                village=res.village,
                business_category=payload.business_category or "General",
                margin_capital=payload.margin_capital,
                opportunity_score=res.opportunity_score,
                competition_score=res.competition_score,
                risk_score=res.risk_score,
                swot_json=json.dumps(top_rec.swot.model_dump() if top_rec and top_rec.swot else {}),
                recommendations_json=json.dumps([r.model_dump() for r in res.recommendations[:3]])
            )
            db.add(report)
            db.commit()
        except Exception as e:
            print(f"[BusinessReport Persistence Warning] {e}")

    return res

@router.get("/swot", response_model=SWOTData)
def get_swot_analysis(
    title: str = Query("Cold-Pressed Edible Oil Extraction Unit"),
    category: str = Query("Food Processing"),
    district: str = Query("Adilabad"),
    mandal: Optional[str] = Query(""),
    village: Optional[str] = Query(""),
    competition: str = Query("Medium"),
    margin_capital: float = Query(100000.0)
):
    """
    Generate AI SWOT Analysis with causal explanations (WHY each factor exists in the region).
    """
    return generate_swot(
        business_title=title,
        business_category=category,
        district=district,
        mandal=mandal,
        village=village,
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
