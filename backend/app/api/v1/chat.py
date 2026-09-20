from fastapi import APIRouter
from app.schemas.all_schemas import AIChatRequest, AIChatResponse
from app.services.gemini_service import query_gemini

router = APIRouter(prefix="/chat", tags=["AI Business Advisor"])

@router.post("/message", response_model=AIChatResponse)
async def send_chat_message(req: AIChatRequest):
    """
    Send prompt to Google Gemini-powered AI Business Advisor,
    with contextual hyper-local MSME knowledge grounding.
    """
    return await query_gemini(
        query=req.query,
        session_id=req.session_id or "default",
        district=req.district,
        village=req.village,
        category=req.category
    )

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
