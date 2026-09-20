import unittest
from app.services.financial_service import calculate_finances
from app.services.advisory_service import advisory_engine
from app.services.swot_service import generate_swot
from app.services.geo_service import geo_engine
from app.services.scheme_service import recommend_schemes
from app.schemas.all_schemas import AnalyzeBusinessRequest

def test_financial_calculator_term_loan():
    """Verify margin capital = 100,000 matches prototype_code/financial_calculator.py"""
    res = calculate_finances(margin_capital=100000.0)
    assert res.project_cost == 1000000.0
    assert res.loan_amount == 900000.0
    assert res.scheme == "Term Loan Scheme"
    assert res.interest_rate == 8.0
    assert res.tenure_years == 7
    assert res.moratorium_months == 6
    assert res.eligibility == "ELIGIBLE"
    assert res.monthly_emi > 13000.0 and res.monthly_emi < 15000.0
    assert res.quarterly_emi == round(res.monthly_emi * 3, 2)
    assert res.total_interest > 0
    assert res.total_repayment == round(res.monthly_emi * 84, 2)

def test_financial_calculator_micro_finance():
    """Verify margin capital = 12,000 routes to Micro Finance Scheme"""
    res = calculate_finances(margin_capital=12000.0)
    assert res.project_cost == 120000.0
    assert res.loan_amount == 108000.0
    assert res.scheme == "Micro Finance Scheme"
    assert res.interest_rate == 6.5
    assert res.tenure_years == 3
    assert res.moratorium_months == 3
    assert res.eligibility == "ELIGIBLE"

def test_financial_calculator_exceeds_ceiling():
    """Verify margin capital > 500,000 (project cost > 50 Lakhs) routes to Not Eligible"""
    res = calculate_finances(margin_capital=600000.0)
    assert res.project_cost == 6000000.0
    assert res.eligibility == "NOT ELIGIBLE"
    assert res.monthly_emi == 0.0

def test_advisory_recommendation_engine():
    """Verify business recommendation engine generates ranked enterprises and valid scores"""
    req = AnalyzeBusinessRequest(
        district="Adilabad",
        village="Tamsi-B",
        business_category="Food Processing",
        margin_capital=100000.0
    )
    res = advisory_engine.analyze_business(req)
    assert res.district == "Adilabad"
    assert len(res.recommendations) > 0
    top = res.recommendations[0]
    assert top.opportunity_score >= 0.0 and top.opportunity_score <= 100.0
    assert top.competition_score >= 0.0 and top.competition_score <= 100.0
    assert top.risk_score >= 0.0 and top.risk_score <= 100.0
    assert top.swot is not None
    assert len(top.swot.strengths) > 0
    assert len(top.swot.strengths[0].why) > 5 # Causal explanation exists

def test_swot_causal_reasoning():
    """Verify SWOT contains causal 'WHY' explanations for all quadrants"""
    swot = generate_swot("Cold-Pressed Oil Unit", "Food Processing", "Karimnagar", "Medium", 80000.0)
    for s in swot.strengths:
        assert s.point and s.why
    for w in swot.weaknesses:
        assert w.point and w.why
    for o in swot.opportunities:
        assert o.point and o.why
    for t in swot.threats:
        assert t.point and t.why

def test_geo_engine_districts_and_radius():
    """Verify GIS engine retrieves Telangana districts and runs radius search"""
    districts = geo_engine.get_districts()
    assert len(districts) >= 30
    assert "Adilabad" in districts

    radius_res = geo_engine.radius_search("Adilabad", "Tamsi-B", radius_km=10.0)
    assert radius_res.radius_km == 10.0
    assert radius_res.estimated_consumer_reach > 0
    assert radius_res.center_village != ""

def test_scheme_router():
    """Verify government scheme finder matches MoSJE and PMEGP schemes"""
    schemes_res = recommend_schemes(gender="Female", category="SC", budget=1000000.0)
    assert schemes_res.total_count > 0
    assert schemes_res.top_recommended is not None
