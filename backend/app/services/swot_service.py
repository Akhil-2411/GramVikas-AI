from typing import Dict, Any, List
from app.schemas.all_schemas import SWOTData, SWOTItem


def generate_swot(
    business_title: str,
    business_category: str,
    district: str,
    competition_level: str = "Medium",
    margin_capital: float = 100000.0
) -> SWOTData:
    comp_lower = (competition_level or "Medium").lower()
    project_cost = margin_capital / 0.10

    strengths = [
        SWOTItem(
            point="Strong Local Agrarian & Rural Consumer Demand",
            why=f"In {district}, primary economic activity creates consistent recurring demand for essential consumer goods and agro-services without heavy marketing overhead."
        ),
        SWOTItem(
            point="High Capital Efficiency with 90% Concessional Funding",
            why=f"With an available margin capital of ₹{margin_capital:,.0f}, you unlock a project scale of ₹{project_cost:,.0f} under government-backed schemes, lowering founder equity risk."
        ),
        SWOTItem(
            point="Shorter Supply Chains & Immediate Proximity to Consumers",
            why="Operating directly within rural mandals eliminates multi-tier middleman distributor margins, yielding 18% - 32% healthier gross profit margins."
        )
    ]

    weaknesses = [
        SWOTItem(
            point="Working Capital Sensitivity during Early Cycles",
            why="Rural enterprises experience cyclical payment intervals tied to harvest seasons; cash reserve discipline is vital during the first 6 months."
        ),
        SWOTItem(
            point="Reliance on Local Single-Phase Power & Transport Infrastructure",
            why=f"Mandal feeder infrastructure in parts of {district} may require backup inverters or localized logistics planning for uninterrupted daily production."
        )
    ]

    opportunities = [
        SWOTItem(
            point="Expansion into Neighboring Village Panchayats (5-10 km Radius)",
            why=f"Geospatial radius analytics reveal unpenetrated village habitations within 10 km that currently travel to district headquarters for {business_category}."
        ),
        SWOTItem(
            point="Direct Linkage to MoSJE / PMEGP Concessional Subsidies",
            why="Government focus on rural employment offers up to 35% capital subsidies and interest subvention for registered micro-enterprises."
        ),
        SWOTItem(
            point="Digital Payments & Direct-to-Consumer Micro-Distribution",
            why="Widespread UPI adoption in rural Telangana enables instantaneous cashless retail settlements and faster inventory turnover."
        )
    ]

    threats = [
        SWOTItem(
            point="Seasonal Demand Fluctuations & Monsoon Dependency",
            why="Agricultural output volatility directly influences rural discretionary spending during lean planting months."
        ),
        SWOTItem(
            point="Raw Material Price Volatility from Regional Wholesalers",
            why="Price variations in raw components or feed grains can squeeze margins if procurement agreements are not established with primary producers."
        )
    ]

    cat_lower = (business_category or "").lower()

    if "dairy" in cat_lower or "milk" in cat_lower:
        strengths.append(
            SWOTItem(
                point="Daily Cashflow Inflow from Milk Procurement",
                why="Dairy cooperatives provide weekly automated direct-benefit transfers to bank accounts, ensuring steady liquid cashflow."
            )
        )
        threats.append(
            SWOTItem(
                point="Perishability and Cold Chain Dependability",
                why="Raw milk requires chilling below 4°C within 3 hours of collection to prevent bacterial spoilage."
            )
        )
    elif "textile" in cat_lower or "tailor" in cat_lower or "garment" in cat_lower:
        strengths.append(
            SWOTItem(
                point="Low Power Consumption & High Value-Add Labor",
                why="Apparel stitching requires modest power and leverages skilled local women artisans for customized festive orders."
            )
        )
        opportunities.append(
            SWOTItem(
                point="Institutional Supply for School Uniforms & Self-Help Groups",
                why="State educational institutions and local SHGs prioritize registered local micro-units for annual uniform supply tenders."
            )
        )
    elif "food" in cat_lower or "oil" in cat_lower or "mill" in cat_lower:
        strengths.append(
            SWOTItem(
                point="Raw Material Abundance in Local Agriculture Mandi",
                why=f"Surplus oilseed, paddy, and spice harvests in {district} allow direct gate procurement at base farm prices."
            )
        )

    return SWOTData(
        strengths=strengths,
        weaknesses=weaknesses,
        opportunities=opportunities,
        threats=threats
    )