import httpx
from typing import Optional

from app.core.config import settings
from app.schemas.all_schemas import AIChatResponse

SYSTEM_INSTRUCTION = """
You are GramVikas AI, an expert Senior MSME Business Advisor and Concessional Finance Consultant for rural and semi-urban entrepreneurs under the Ministry of Social Justice and Empowerment (MoSJE), Smart India Hackathon 2026.

Your responsibilities:

1. Business selection and feasibility analysis.
2. MSME project planning and profitability estimation.
3. Government scheme guidance (MoSJE, PMEGP, MUDRA, Stand-Up India, etc.).
4. Loan eligibility and financial planning.
5. SWOT analysis and market gap analysis.
6. Radius-based business expansion guidance.
7. Rural entrepreneurship mentoring.
8. Responses must be practical, structured and actionable.

Always:
- Give business-focused answers.
- Use district, village and category context whenever available.
- Be concise but informative.
- Prefer bullet points and numbered steps.
"""


async def query_gemini(
    query: str,
    session_id: str = "default",
    district: Optional[str] = None,
    village: Optional[str] = None,
    category: Optional[str] = None
) -> AIChatResponse:

    context_parts = []

    if district:
        context_parts.append(f"District: {district}")

    if village:
        context_parts.append(f"Village: {village}")

    if category:
        context_parts.append(f"Business Sector: {category}")

    context_text = "\n".join(context_parts)

    full_prompt = f"""
{context_text}

User Question:
{query}

Instructions:
- Act as GramVikas AI.
- Answer as a professional MSME consultant.
- Use available location context.
- Recommend schemes when relevant.
- Suggest practical next steps.
"""

    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 10:

        try:

            url = (
    "https://generativelanguage.googleapis.com/"
    f"v1beta/models/gemini-3.6-flash:generateContent"
    f"?key={settings.GEMINI_API_KEY}"
)

            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": SYSTEM_INSTRUCTION + "\n\n" + full_prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.6,
                    "maxOutputTokens": 4096
                }
            }

            async with httpx.AsyncClient(timeout=30.0) as client:

                response = await client.post(
                    url,
                    json=payload
                )

            print("\n========== GEMINI RESPONSE ==========")
            print("Status:", response.status_code)
            print(response.json())
            print("=====================================\n")

            if response.status_code == 200:

                data = response.json()

                candidates = data.get("candidates", [])

                if candidates:

                    answer = (
                        candidates[0]
                        .get("content", {})
                        .get("parts", [{}])[0]
                        .get("text", "")
                    )

                    if answer:

                        return AIChatResponse(
                            answer=answer.strip(),
                            session_id=session_id,
                            suggested_prompts=[
                                "Top business opportunities near me",
                                "Calculate project cost from margin capital",
                                "Best government schemes available",
                                "SWOT analysis for my business",
                                "Estimate monthly profit"
                            ]
                        )

            print("[Gemini Failed]")
            print(response.text)

        except Exception as e:

            print(f"[Gemini Error] {e}")

    q = query.lower()

    location = district or "your district"
    sector = category or "General MSME"

    if any(word in q for word in [
        "business",
        "idea",
        "opportunity",
        "start",
        "enterprise"
    ]):

        answer = f"""
# Business Opportunities in {location}

1. Food Processing Unit
2. Mini Dal Mill
3. Flour Mill
4. Cold Pressed Oil Unit
5. Dairy Enterprise
6. Poultry Farming
7. Digital Service Center
8. Rural E-Commerce Distribution

Recommended Next Step:
Use the Financial Planner to estimate project cost and loan requirement.
"""

    elif any(word in q for word in [
        "loan",
        "scheme",
        "finance",
        "subsidy",
        "mudra",
        "pmegp",
        "emi"
    ]):

        answer = f"""
# MSME Financing Guidance

Location: {location}

1. MoSJE Micro Finance
   - Project Size: Up to ₹1.4 Lakh
   - Interest: 6.5%

2. MoSJE Term Loan
   - Project Size: Up to ₹50 Lakh
   - Interest: 8%

3. PMEGP
4. MUDRA

Project Cost = Margin Capital ÷ 10%
"""

    elif any(word in q for word in [
        "swot",
        "strength",
        "weakness"
    ]):

        answer = f"""
# SWOT Analysis

Business Category:
{sector}

Strengths
- Local market access
- Lower operational cost

Weaknesses
- Limited working capital

Opportunities
- Government funding support

Threats
- Competition
"""

    elif any(word in q for word in [
        "profit",
        "income",
        "earning",
        "revenue"
    ]):

        answer = f"""
# Profitability Guidance

Business Sector:
{sector}

Typical Net Profit Margins:

- Food Processing : 15% - 30%
- Flour Mill : 20% - 35%
- Dairy : 10% - 20%
"""

    else:

        answer = f"""
# GramVikas AI Business Advisor

District:
{district or 'Not Selected'}

Village:
{village or 'Not Selected'}

Business Sector:
{sector}

I can help with:

- Business Idea Selection
- Project Feasibility
- Loan Eligibility
- Government Schemes
- SWOT Analysis
- Profitability Forecasting

Ask me a business-related question.
"""

    return AIChatResponse(
        answer=answer,
        session_id=session_id,
        suggested_prompts=[
            "Top business opportunities",
            "Loan eligibility calculation",
            "Best MSME schemes",
            "SWOT analysis",
            "Estimate profitability"
        ]
    )