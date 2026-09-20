from fastapi import APIRouter, Query
from app.schemas.all_schemas import (
    FinancialCalculationRequest,
    FinancialCalculationResponse
)
from app.services.financial_service import calculate_finances

router = APIRouter(prefix="/financial", tags=["Smart Financial Structuring"])

@router.post("/calculate", response_model=FinancialCalculationResponse)
def calculate_financial_plan(req: FinancialCalculationRequest):
    """
    Calculate project cost, loan eligibility, scheme routing,
    monthly and quarterly EMI, total interest, break-even period,
    and 5-year cashflow projections based on available margin capital.
    """
    return calculate_finances(
        margin_capital=req.margin_capital,
        project_cost_override=req.project_cost,
        interest_rate_override=req.interest_rate,
        tenure_years_override=req.loan_tenure_years
    )

@router.get("/quick", response_model=FinancialCalculationResponse)
def quick_calculate(margin: float = Query(100000.0, gt=0)):
    """Convenience endpoint for quick margin capital calculations"""
    return calculate_finances(margin_capital=margin)
