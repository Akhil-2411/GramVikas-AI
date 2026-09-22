import json
import httpx
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.schemas.all_schemas import (
    AIChatResponse,
    SWOTData,
    SWOTItem,
    BusinessRecommendation,
    AnalyzeBusinessRequest
)

SYSTEM_INSTRUCTION = """
You are GramVikas AI, an expert Senior MSME Business Advisor and Concessional Finance Consultant for rural and semi-urban entrepreneurs under the Ministry of Social Justice and Empowerment (MoSJE), Smart India Hackathon 2026.

Your core expertise:
1. Rural MSME business selection, feasibility analysis, and raw material access.
2. 90% concessional loan structuring under MoSJE schemes (10x founder capital leverage).
3. PostGIS-accurate trade radius analysis (5 km, 10 km, 20 km rural consumer corridors).
4. Deep causal SWOT assessments detailing WHY each factor exists in the specific district/mandal.
5. Actionable, structured, and pragmatic business advisory tailored to grassroots entrepreneurs.
"""

def _extract_text_from_response(data: Dict[str, Any]) -> str:
    """Helper to extract text cleanly from Gemini response structure, avoiding thought blocks"""
    candidates = data.get("candidates", [])
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts", [])
    text_segments = []
    for part in parts:
        if "text" in part and not part.get("thought", False):
            text_segments.append(part["text"])
    return "".join(text_segments).strip()


async def query_gemini(
    query: str,
    session_id: str = "default",
    district: Optional[str] = None,
    village: Optional[str] = None,
    category: Optional[str] = None
) -> AIChatResponse:
    """Query Gemini for conversational MSME advice with location grounding and smart fallback"""
    context_lines = []
    if district:
        context_lines.append(f"District: {district}")
    if village:
        context_lines.append(f"Village/Habitation: {village}")
    if category:
        context_lines.append(f"Target Industry: {category}")
    context_str = "\n".join(context_lines)

    prompt = f"""
{context_str}

User Question:
{query}

Provide a practical, structured MSME advisory response with bullet points and clear financial/operational guidance.
"""

    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 10:
        for model in ["gemini-3.6-flash", "gemini-1.5-flash", "gemini-2.0-flash"]:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                payload = {
                    "contents": [
                        {
                            "parts": [
                                {"text": SYSTEM_INSTRUCTION + "\n\n" + prompt}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.6,
                        "maxOutputTokens": 2048
                    }
                }
                async with httpx.AsyncClient(timeout=12.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        ans = _extract_text_from_response(resp.json())
                        if ans:
                            return AIChatResponse(
                                answer=ans,
                                session_id=session_id,
                                suggested_prompts=[
                                    f"Top business opportunities in {district or 'my district'}",
                                    "Calculate my EMI for ₹1,00,000 margin capital",
                                    "How do I apply for the MoSJE 90% loan scheme?",
                                    "What is the SWOT breakdown for this enterprise?",
                                    "List eligible subsidies under PMEGP"
                                ]
                            )
            except Exception as e:
                print(f"[Gemini Chat Note] Model {model} attempt: {e}")
                continue

    # Fallback to rich deterministic domain intelligence
    location = district or "your district"
    sector = category or "Rural Micro-Enterprise"
    q_lower = query.lower()

    if any(w in q_lower for w in ["business", "idea", "opportunity", "start", "enterprise"]):
        answer = f"""### High-Potential Enterprises in {location}

Based on local market demand and supply gap analytics in {location}:
1. **Cold-Pressed Edible Oil Extraction Unit** (Groundnut/Sesame) - 28% margin
2. **Mini Dal Mill & Pulse Grading Plant** - 24% margin
3. **Bulk Milk Chilling & Paneer Center** - 32% margin
4. **Automated Spice Processing & Packaging** - 35% margin
5. **Solar Equipment Dealership & Water Pump Repair Hub** - 26% margin

**MoSJE Financial Structuring Tip**:
With your margin capital, you can unlock up to **10x total project capital** under concessional schemes (e.g. ₹1,00,000 margin unlocks a ₹10,00,000 project)."""
    elif any(w in q_lower for w in ["loan", "scheme", "finance", "subsidy", "emi", "fund"]):
        answer = f"""### Concessional Financial Assistance Guide for {location}

1. **MoSJE Micro Finance Scheme**:
   - Project Scale: Up to **₹1,40,000**
   - Interest Rate: **6.5% per annum**
   - Tenure: 3 Years (with 3-month moratorium)
   - Margin Required: Just 10% (₹14,000)

2. **MoSJE Term Loan Scheme**:
   - Project Scale: **₹1,40,000 to ₹50,00,000**
   - Interest Rate: **8.0% per annum**
   - Tenure: Up to 7 Years (with 6-month moratorium)
   - Concessional Debt Coverage: Up to **90%** of Project Cost

3. **PMEGP Capital Subsidy**:
   - Up to **35% margin money subsidy** for rural women, SC/ST, and OBC beneficiaries."""
    else:
        answer = f"""### GramVikas AI Advisor - {location}

I am your AI consultant for MSME development in **{location}** {f'({village})' if village else ''}.

**How I can assist you today**:
- **Enterprise Feasibility**: Analyze demand vs competition in your mandal.
- **Financial Planning**: Calculate exact monthly EMI, break-even timeline, and 5-year cashflow projections.
- **SWOT Analysis**: Evaluate causal strengths, weaknesses, and rural growth corridors.
- **Scheme Matching**: Check eligibility for MoSJE, PMEGP, Stand-Up India, and MUDRA.

*Type any question or select a suggested topic below to get started.*"""

    return AIChatResponse(
        answer=answer,
        session_id=session_id,
        suggested_prompts=[
            f"Top business opportunities in {district or 'my district'}",
            "Calculate loan eligibility for ₹1,00,000 capital",
            "MoSJE 90% concessional scheme eligibility",
            "SWOT analysis for mini dal mill",
            "How to get PMEGP 35% subsidy"
        ]
    )


async def generate_ai_swot(
    business_title: str,
    business_category: str,
    district: str,
    mandal: Optional[str] = "",
    village: Optional[str] = "",
    margin_capital: float = 100000.0,
    competition_level: str = "Medium",
    district_msme_count: int = 25000
) -> Optional[SWOTData]:
    """
    Invoke Gemini with JSON schema output to produce a tailored, deep causal SWOT matrix
    grounded in local geography, competition density, and capital scale.
    """
    if not settings.GEMINI_API_KEY or len(settings.GEMINI_API_KEY.strip()) <= 10:
        return None

    project_cost = margin_capital / 0.10
    prompt = f"""
Perform a rigorous, hyper-local SWOT analysis with explicit CAUSAL REASONING for the following rural MSME venture:

Enterprise: {business_title}
Category: {business_category}
District: {district}
Mandal: {mandal or 'Local Rural Mandal'}
Village: {village or 'Panchayat Habitation'}
Founder Margin Capital: ₹{margin_capital:,.0f}
Calculated Project Scale (10x): ₹{project_cost:,.0f}
District MSME Competition: {competition_level} ({district_msme_count:,} registered enterprises)

Requirements:
1. Explain WHY each factor exists specifically in {district} and rural Telangana (e.g. crop patterns, electricity supply, mandal haats, logistics).
2. Compute realistic 0-100 scores for:
   - opportunity_score
   - competition_score
   - risk_score
   - financial_viability_score
3. Output STRICT JSON with this structure:
{{
  "opportunity_score": 82.5,
  "competition_score": 45.0,
  "risk_score": 30.0,
  "financial_viability_score": 86.0,
  "summary": "1-sentence executive verdict",
  "strengths": [{{"point": "...", "why": "..."}}],
  "weaknesses": [{{"point": "...", "why": "..."}}],
  "opportunities": [{{"point": "...", "why": "..."}}],
  "threats": [{{"point": "...", "why": "..."}}]
}}
"""

    for model in ["gemini-3.6-flash", "gemini-1.5-flash", "gemini-2.0-flash"]:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.4,
                    "responseMimeType": "application/json"
                }
            }
            async with httpx.AsyncClient(timeout=14.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    raw_text = _extract_text_from_response(resp.json())
                    data = json.loads(raw_text)
                    
                    strengths = [SWOTItem(point=s["point"], why=s["why"]) for s in data.get("strengths", [])]
                    weaknesses = [SWOTItem(point=w["point"], why=w["why"]) for w in data.get("weaknesses", [])]
                    opportunities = [SWOTItem(point=o["point"], why=o["why"]) for o in data.get("opportunities", [])]
                    threats = [SWOTItem(point=t["point"], why=t["why"]) for t in data.get("threats", [])]

                    if strengths and weaknesses:
                        return SWOTData(
                            strengths=strengths,
                            weaknesses=weaknesses,
                            opportunities=opportunities,
                            threats=threats,
                            opportunity_score=float(data.get("opportunity_score", 82.0)),
                            competition_score=float(data.get("competition_score", 44.0)),
                            risk_score=float(data.get("risk_score", 28.0)),
                            financial_viability_score=float(data.get("financial_viability_score", 85.0)),
                            title=business_title,
                            district=district,
                            village=village,
                            category=business_category,
                            summary=data.get("summary", f"Strong growth potential in {district}")
                        )
        except Exception as e:
            print(f"[Gemini SWOT Note] Model {model} attempt: {e}")
            continue

    return None