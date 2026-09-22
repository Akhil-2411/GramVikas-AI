import os
import pandas as pd
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.db.session import SessionLocal
from app.models.msme import DistrictMSME, MSMEEnterprise
from app.schemas.all_schemas import (
    AnalyzeBusinessRequest,
    AnalyzeBusinessResponse,
    BusinessRecommendation
)
from app.services.swot_service import generate_swot
from app.services.geo_service import geo_engine

# Comprehensive Master Catalog of Rural & Semi-Urban Enterprises
ENTERPRISE_CATALOG = [
    {
        "title": "Cold-Pressed Edible Oil Extraction Unit",
        "category": "Food Processing",
        "min_capital": 60000.0,
        "base_investment": 600000.0,
        "margin_pct": 28.0,
        "description": "Mechanized wooden expeller unit producing cold-pressed groundnut, sesame, and mustard oils with zero chemical refining for health-conscious rural and semi-urban markets."
    },
    {
        "title": "Mini Dal Mill & Pulse Processing Plant",
        "category": "Food Processing",
        "min_capital": 80000.0,
        "base_investment": 800000.0,
        "margin_pct": 24.0,
        "description": "Small-scale pulse grading, dehusking, and splitting mill sourcing red gram and green gram directly from farmer producer groups."
    },
    {
        "title": "Milk Chilling & Dairy Value-Add Center",
        "category": "Dairy & Animal Husbandry",
        "min_capital": 50000.0,
        "base_investment": 500000.0,
        "margin_pct": 32.0,
        "description": "BMC (Bulk Milk Chiller) center equipped with fat testing analyzers, supplying pasteurized milk, curd, and paneer to rural retail hubs and state dairies."
    },
    {
        "title": "Cattle & Poultry Feed Manufacturing Unit",
        "category": "Dairy & Animal Husbandry",
        "min_capital": 75000.0,
        "base_investment": 750000.0,
        "margin_pct": 22.0,
        "description": "Grinding and pelleting unit combining locally sourced maize, bran, and mineral mixtures to produce cost-effective livestock feed."
    },
    {
        "title": "Automated Spice Grinding & Packaging Unit",
        "category": "Food Processing",
        "min_capital": 40000.0,
        "base_investment": 400000.0,
        "margin_pct": 35.0,
        "description": "Hygienic pulverizing and pouch-sealing setup for turmeric, chilli powder, and coriander powder serving local grocery stores and weekly haats."
    },
    {
        "title": "Custom Tailoring & Apparel Manufacturing",
        "category": "Textiles & Handloom",
        "min_capital": 25000.0,
        "base_investment": 250000.0,
        "margin_pct": 38.0,
        "description": "Batch garment manufacturing and designer tailoring enterprise employing motorized stitching machines for festive wear and school uniform contracts."
    },
    {
        "title": "Bio-Fertilizer & Vermicompost Production Unit",
        "category": "Agri-Tech & Allied",
        "min_capital": 30000.0,
        "base_investment": 300000.0,
        "margin_pct": 42.0,
        "description": "Eco-friendly composting facility utilizing cattle dung and agricultural residues to formulate certified organic soil enrichment packets."
    },
    {
        "title": "Areca Leaf Biodegradable Plate Manufacturing",
        "category": "Eco-Packaging & Crafts",
        "min_capital": 35000.0,
        "base_investment": 350000.0,
        "margin_pct": 30.0,
        "description": "Hydraulic heat-press machines shaping shed areca palm leaves into disposable tableware for catering firms and cultural events."
    },
    {
        "title": "Solar Powered Cold Storage & Agri-Warehouse",
        "category": "Agri-Tech & Allied",
        "min_capital": 90000.0,
        "base_investment": 900000.0,
        "margin_pct": 29.0,
        "description": "Decentralized micro cold room (5 MT capacity) powered by rooftop solar panels to prevent post-harvest distress sales of chillies, vegetables, and fruits."
    },
    {
        "title": "Agro-Machinery Custom Hiring & Service Center",
        "category": "Rural Services & Repair",
        "min_capital": 70000.0,
        "base_investment": 700000.0,
        "margin_pct": 33.0,
        "description": "Community equipment depot renting power weeders, seed drills, rotavators, and drone sprayers on hourly/acreage rates to marginal smallholders."
    },
    {
        "title": "Two-Wheeler Multi-Brand Service & Spares Hub",
        "category": "Rural Services & Repair",
        "min_capital": 45000.0,
        "base_investment": 450000.0,
        "margin_pct": 34.0,
        "description": "Equipped service garage with diagnostic scanners, hydraulic lifts, and genuine spare parts inventory catering to high rural motorcycle density."
    },
    {
        "title": "Solar Water Pump & Inverter Installation Services",
        "category": "Rural Services & Repair",
        "min_capital": 70000.0,
        "base_investment": 700000.0,
        "margin_pct": 26.0,
        "description": "Renewable energy equipment dealership and maintenance enterprise aiding farmers with PM-KUSUM solar pump installations and home backups."
    }
]

class AdvisoryEngine:
    _instance = None

    def __init__(self):
        self.df_msme: Optional[pd.DataFrame] = None
        self._load_district_data()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = AdvisoryEngine()
        return cls._instance

    def _load_district_data(self):
        csv_path = settings.DISTRICT_MSME_CSV
        if os.path.exists(csv_path):
            try:
                df = pd.read_csv(csv_path)
                df.columns = [c.strip() for c in df.columns]
                df['district_clean'] = df['district_name'].astype(str).str.strip().str.title()
                self.df_msme = df
                print(f"[Advisory Engine] Loaded {len(df)} district MSME records successfully.")
            except Exception as e:
                print(f"[Advisory Engine Error] Failed to load district MSME data: {e}")
                self.df_msme = pd.DataFrame()
        else:
            self.df_msme = pd.DataFrame()

    def get_district_stats(self, district: str) -> Dict[str, Any]:
        """Fetch MSME statistics, prioritizing database queries with CSV fallback"""
        try:
            db = SessionLocal()
            try:
                d_record = db.query(DistrictMSME).filter(
                    DistrictMSME.district_name.ilike(district.strip())
                ).first()
                if d_record:
                    return {
                        "district_name": d_record.district_name,
                        "state_name": d_record.state_name,
                        "micro": d_record.micro,
                        "small": d_record.small,
                        "medium": d_record.medium,
                        "total": d_record.total,
                        "competition": d_record.competition,
                        "opportunity_score": d_record.opportunity_score
                    }
            finally:
                db.close()
        except Exception as e:
            print(f"[Advisory DB Lookup Fallback] {e}")

        # Fallback to in-memory DataFrame
        if self.df_msme is not None and not self.df_msme.empty:
            mask = self.df_msme['district_clean'].str.lower() == district.strip().lower()
            sub = self.df_msme[mask]
            if not sub.empty:
                row = sub.iloc[0]
                return {
                    "district_name": row['district_clean'],
                    "state_name": row.get('state_name', 'Telangana'),
                    "micro": int(row.get('micro', 25000)),
                    "small": int(row.get('small', 150)),
                    "medium": int(row.get('medium', 5)),
                    "total": int(row.get('total', 25155)),
                    "competition": str(row.get('competition', 'Medium')),
                    "opportunity_score": 75.0
                }

        # Safe defaults
        return {
            "district_name": district.title(),
            "state_name": "Telangana",
            "micro": 28450,
            "small": 180,
            "medium": 6,
            "total": 28636,
            "competition": "Medium",
            "opportunity_score": 75.0
        }

    def analyze_business(self, req: AnalyzeBusinessRequest) -> AnalyzeBusinessResponse:
        """
        Generate grounded hyper-local business recommendations, opportunity index,
        and SWOT reports utilizing real GIS radius density and capital leverage.
        """
        district_stats = self.get_district_stats(req.district)
        comp_level = district_stats.get("competition", "Medium")
        total_msme = district_stats.get("total", 25000)

        # Baseline scores calculated from district MSME saturation
        msme_factor = min(total_msme / 250000.0, 1.0)
        base_opp = 90.0 - (msme_factor * 26.0)
        base_comp = 25.0 + (msme_factor * 55.0)
        base_risk = 18.0 + (msme_factor * 22.0)

        if comp_level.lower() == "low":
            base_opp += 6.0
            base_comp -= 8.0
            base_risk -= 4.0
        elif comp_level.lower() == "high":
            base_opp -= 6.0
            base_comp += 8.0
            base_risk += 4.0

        # Grounded GIS Spatial Metric Modifier (Replacing old ASCII string hash)
        village_name = req.village or ""
        nearby_villages_count = 0
        if village_name:
            try:
                rad_info = geo_engine.radius_search(
                    district=req.district,
                    village_name=village_name,
                    radius_km=10.0
                )
                nearby_villages_count = rad_info.nearby_villages_count
                # High neighboring village density indicates larger trade catchment area
                if nearby_villages_count >= 15:
                    base_opp += 4.0
                    base_risk -= 2.0
                elif nearby_villages_count >= 8:
                    base_opp += 2.0
                else:
                    base_opp -= 2.0  # Remote isolated habitation
            except Exception:
                pass

        # Margin Capital Leverage Factor
        capital_factor = min(req.margin_capital / 500000.0, 1.0)
        base_opp += capital_factor * 3.5
        base_risk -= capital_factor * 2.5

        base_opp = round(max(55.0, min(96.0, base_opp)), 1)
        base_comp = round(max(15.0, min(90.0, base_comp)), 1)
        base_risk = round(max(10.0, min(70.0, base_risk)), 1)

        project_capital = req.margin_capital / 0.10

        recommendations: List[BusinessRecommendation] = []
        rank = 1

        for item in ENTERPRISE_CATALOG:
            # Category filter
            if req.business_category and req.business_category.lower() not in ["all", "any", ""]:
                cat_filter = req.business_category.lower()
                if cat_filter not in item["category"].lower() and cat_filter not in item["title"].lower():
                    continue

            # Investment sizing
            investment = max(item["base_investment"], project_capital * 0.70)
            if investment > project_capital * 1.25:
                investment = project_capital

            est_revenue = investment * (item["margin_pct"] / 100.0) * 2.2
            opp_score = round(min(98.0, max(55.0, base_opp + (item["margin_pct"] * 0.25) - (rank * 1.2))), 1)
            comp_score = round(min(90.0, max(18.0, base_comp + (rank * 1.5))), 1)
            risk_score = round(min(80.0, max(15.0, base_risk + (investment / 1000000.0) * 1.8)), 1)

            # Generate localized SWOT
            swot_data = generate_swot(
                business_title=item["title"],
                business_category=item["category"],
                district=req.district,
                competition_level=comp_level,
                margin_capital=req.margin_capital,
                mandal=getattr(req, "mandal", "") or "",
                village=req.village or ""
            )

            recommendations.append(
                BusinessRecommendation(
                    rank=rank,
                    title=item["title"],
                    category=item["category"],
                    opportunity_score=opp_score,
                    competition_score=comp_score,
                    risk_score=risk_score,
                    investment_required=round(investment, 2),
                    estimated_revenue=round(est_revenue, 2),
                    profit_margin=item["margin_pct"],
                    description=item["description"],
                    swot=swot_data
                )
            )
            rank += 1
            if rank > 6:
                break

        # Fallback to top 3 enterprises if no category match
        if not recommendations:
            for idx, item in enumerate(ENTERPRISE_CATALOG[:3]):
                swot_data = generate_swot(
                    business_title=item["title"],
                    business_category=item["category"],
                    district=req.district,
                    competition_level=comp_level,
                    margin_capital=req.margin_capital,
                    mandal=getattr(req, "mandal", "") or "",
                    village=req.village or ""
                )
                recommendations.append(
                    BusinessRecommendation(
                        rank=idx + 1,
                        title=item["title"],
                        category=item["category"],
                        opportunity_score=round(base_opp - (idx * 2), 1),
                        competition_score=round(base_comp + (idx * 2), 1),
                        risk_score=round(base_risk + (idx * 1.5), 1),
                        investment_required=round(project_capital * 0.85, 2),
                        estimated_revenue=round(project_capital * 0.45, 2),
                        profit_margin=item["margin_pct"],
                        description=item["description"],
                        swot=swot_data
                    )
                )

        # Verdict
        if base_opp >= 82:
            verdict = "High Market Viability: Favorable local demand with strong concessional credit headroom."
        elif base_opp >= 72:
            verdict = "Moderately High Feasibility: Sustainable business environment with regular monitoring."
        else:
            verdict = "Competitive Market: Focus on differentiation, quality branding, and radius expansion."

        return AnalyzeBusinessResponse(
            district=district_stats["district_name"],
            village=req.village or "Local Panchayat",
            opportunity_score=round(base_opp, 1),
            competition_score=round(base_comp, 1),
            risk_score=round(base_risk, 1),
            verdict=verdict,
            recommendations=recommendations,
            district_overview=district_stats
        )

advisory_engine = AdvisoryEngine.get_instance()
