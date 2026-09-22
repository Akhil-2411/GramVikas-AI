from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.report import AIChatHistory
from app.schemas.all_schemas import AIChatRequest, AIChatResponse
from app.services.gemini_service import query_gemini
from app.api.v1.auth import get_optional_user

router = APIRouter(prefix="/chat", tags=["AI Business Advisor"])

@router.post("/message", response_model=AIChatResponse)
async def send_chat_message(
    req: AIChatRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Send prompt to Google Gemini-powered AI Business Advisor,
    with contextual hyper-local MSME knowledge grounding and persistence.
    """
    res = await query_gemini(
        query=req.query,
        session_id=req.session_id or "default",
        district=req.district,
        village=req.village,
        category=req.category
    )

    if current_user:
        try:
            chat_record = AIChatHistory(
                user_id=current_user.id,
                session_id=req.session_id or "default",
                query=req.query,
                response=res.answer
            )
            db.add(chat_record)
            db.commit()
        except Exception as e:
            print(f"[Chat History Warning] {e}")

    return res

@router.get("/prompts")
def get_recommended_prompts():
    """Returns starter prompts for first-time entrepreneurs"""
    return {
        "prompts": [
            "How do I calculate loan eligibility for ₹1,00,000 margin capital?",
            "What businesses are in high demand in Adilabad district?",
            "How do I apply for the MoSJE 90% concessional scheme?",
            "Explain the SWOT analysis for a mini dal mill enterprise.",
            "What is the break-even period for a cold-pressed oil unit?",
            "Can I get a loan subsidy under PMEGP for rural women?"
        ]
    }
