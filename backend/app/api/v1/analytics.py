from fastapi import APIRouter, Query
from typing import Dict, Any, List
from app.services.advisory_service import advisory_engine
from app.services.geo_service import geo_engine
from app.schemas.all_schemas import MarketGapResponse, MarketGapSector

router = APIRouter(prefix="/analytics", tags=["Market & District Analytics"])

@router.get("/overview")
def get_platform_overview() -> Dict[str, Any]:
    """
    Returns platform-wide KPIs for the main dashboard:
    Total MSMEs, District Coverage, Villages Covered, Business Categories,
    and Top Opportunity Districts.
    """
    top_opportunity_districts = [
        {"district": "Nagarkurnool", "opportunity_score": 88, "competition": "Low", "total_msme": 23085},
        {"district": "Wanaparthy", "opportunity_score": 87, "competition": "Low", "total_msme": 17546},
        {"district": "Komaram Bheem Asifabad", "opportunity_score": 89, "competition": "Low", "total_msme": 12076},
        {"district": "Adilabad", "opportunity_score": 85, "competition": "Medium", "total_msme": 24755},
        {"district": "Kamareddy", "opportunity_score": 84, "competition": "Medium", "total_msme": 27701},
        {"district": "Mahabubnagar", "opportunity_score": 82, "competition": "Medium", "total_msme": 41313},
        {"district": "Nalgonda", "opportunity_score": 80, "competition": "Medium", "total_msme": 36500},
        {"district": "Warangal", "opportunity_score": 78, "competition": "Medium", "total_msme": 48200}
    ]

    sector_distribution = [
        {"name": "Food Processing & Agro Allied", "percentage": 34, "count": 250400},
        {"name": "Textiles, Weaving & Apparel", "percentage": 22, "count": 162000},
        {"name": "Retail & Rural Trading", "percentage": 18, "count": 132500},
        {"name": "Maintenance & Repair Services", "percentage": 14, "count": 103100},
        {"name": "Eco-Packaging & Handicrafts", "percentage": 12, "count": 88497}
    ]

    return {
        "kpis": {
            "total_msmes": 736497,
            "districts_covered": 33,
            "total_districts": 33,
            "villages_covered": 10455,
            "business_categories": 1072,
            "schemes_integrated": 5
        },
        "enterprise_classification": {
            "micro": {"count": 726186, "pct": 98.6},
            "small": {"count": 9574, "pct": 1.3},
            "medium": {"count": 737, "pct": 0.1}
        },
        "top_opportunity_districts": top_opportunity_districts,
        "sector_distribution": sector_distribution
    }

@router.get("/district")
def get_district_analytics(name: str = Query("Adilabad")) -> Dict[str, Any]:
    """Retrieve in-depth analytics, MSME distribution, and rankings for a single district"""
    stats = advisory_engine.get_district_stats(name)
    total = stats.get("total", 25000)
    micro = stats.get("micro", int(total * 0.98))
    small = stats.get("small", int(total * 0.018))
    medium = stats.get("medium", int(total * 0.002))

    industry_breakdown = [
        {"sector": "Agro Processing", "units": int(total * 0.32)},
        {"sector": "Apparel & Tailoring", "units": int(total * 0.24)},
        {"sector": "Rural Repair & Services", "units": int(total * 0.18)},
        {"sector": "Building Materials & Hardware", "units": int(total * 0.14)},
        {"sector": "Dairy & Animal Feed", "units": int(total * 0.12)}
    ]

    return {
        "district_name": stats["district_name"],
        "competition_level": stats["competition"],
        "total_msmes": total,
        "micro_enterprises": micro,
        "small_enterprises": small,
        "medium_enterprises": medium,
        "opportunity_index": 85 if stats["competition"] == "Low" else (74 if stats["competition"] == "Medium" else 58),
        "competition_index": 28 if stats["competition"] == "Low" else (55 if stats["competition"] == "Medium" else 84),
        "industry_breakdown": industry_breakdown
    }

@router.get("/market-gap", response_model=MarketGapResponse)
def get_market_gap(district: str = Query("Adilabad")) -> MarketGapResponse:
    """
    Generate Market Gap Report identifying underserved sectors, high-demand areas,
    and saturated sectors in the district.
    """
    underserved = [
        MarketGapSector(
            sector_name="Cold-Chain & Value-Added Milk Chilling",
            demand_level="Very High",
            supply_saturation="Low",
            gap_index=84.5,
            suggested_businesses=[
                "Mini Bulk Milk Chilling Unit",
                "Organic Ghee & Paneer Processing Center",
                "Cattle Feed Formulation Plant"
            ]
        ),
        MarketGapSector(
            sector_name="Pulse & Grain Dehusking / Mini Flour Milling",
            demand_level="High",
            supply_saturation="Low",
            gap_index=79.0,
            suggested_businesses=[
                "Mini Dal Mill Unit",
                "Multi-Grain Fortified Flour Packaging",
                "Spices Cleaning and Grading Hub"
            ]
        ),
        MarketGapSector(
            sector_name="Solar & Farm Equipment Maintenance",
            demand_level="Very High",
            supply_saturation="Low",
            gap_index=88.0,
            suggested_businesses=[
                "Solar Inverter & Pump Repair Center",
                "Tractor & Harvester Hydraulic Spares",
                "Battery Reconditioning Service"
            ]
        )
    ]

    high_demand = [
        MarketGapSector(
            sector_name="Ready-to-Eat Food & Bakery Products",
            demand_level="High",
            supply_saturation="Moderate",
            gap_index=71.0,
            suggested_businesses=[
                "Semi-Automated Biscuit & Rusk Unit",
                "Traditional Millet Snack Packaging",
                "Commercial Bakery & Sweets Unit"
            ]
        ),
        MarketGapSector(
            sector_name="Eco-Friendly Disposable Leaf Plates",
            demand_level="High",
            supply_saturation="Low",
            gap_index=76.5,
            suggested_businesses=[
                "Areca Palm Leaf Hydraulic Tableware",
                "Paper Bag & Corrugated Box Workshop",
                "Bio-Degradable Packaging Unit"
            ]
        )
    ]

    saturated = [
        MarketGapSector(
            sector_name="Unspecialized General Kirana Provision Stores",
            demand_level="Moderate",
            supply_saturation="Saturated",
            gap_index=32.0,
            suggested_businesses=[
                "Differentiate into Organic Products",
                "Add Digital Point-of-Sale Banking Service"
            ]
        ),
        MarketGapSector(
            sector_name="Basic Photocopy & Mobile Recharge Kiosks",
            demand_level="Moderate",
            supply_saturation="Saturated",
            gap_index=28.5,
            suggested_businesses=[
                "Upgrade to Smartphone Screen & Chip Repair",
                "Offer CSC Common Service Center G2C Services"
            ]
        )
    ]

    matrix = {
        "high_opportunity_low_competition": ["Dairy Value Add", "Solar Services", "Mini Dal Milling"],
        "high_opportunity_high_competition": ["Grocery Retail", "Textile Tailoring"],
        "low_opportunity_high_competition": ["Mobile Recharge", "Basic Kirana"],
        "low_opportunity_low_competition": ["Heavy Metal Casting", "Specialty Chemicals"]
    }

    return MarketGapResponse(
        district=district.title(),
        underserved_sectors=underserved,
        high_demand_sectors=high_demand,
        saturated_sectors=saturated,
        opportunity_matrix=matrix
    )
