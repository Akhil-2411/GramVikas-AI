import math
from typing import Dict, Any, List
from app.schemas.all_schemas import FinancialCalculationResponse, YearlyCashflow

def calculate_finances(
    margin_capital: float,
    project_cost_override: float = None,
    interest_rate_override: float = None,
    tenure_years_override: int = None
) -> FinancialCalculationResponse:
    """
    Core Financial Structuring Engine implementing prototype_code/financial_calculator.py rules:
    - Project Cost = margin_capital / 0.10
    - Loan Amount = project_cost * 0.90
    - Scheme routing: Micro Finance (<= 1.4 Lakhs @ 6.5%, 3 yrs, 3 mo moratorium)
                      Term Loan (1.4L - 50L @ 8.0%, 7 yrs, 6 mo moratorium)
                      > 50 Lakhs -> Not Eligible under concessional schemes
    """
    # 1. Project Cost & Loan Amount
    if project_cost_override and project_cost_override > 0:
        project_cost = float(project_cost_override)
        loan_amount = project_cost - margin_capital
    else:
        project_cost = margin_capital / 0.10
        loan_amount = project_cost * 0.90

    # 2. Scheme Routing
    if project_cost <= 140000:
        scheme = "Micro Finance Scheme"
        interest_rate = 6.5
        tenure_years = 3
        moratorium_months = 3
        eligibility = "ELIGIBLE"
    elif project_cost <= 5000000:
        scheme = "Term Loan Scheme"
        interest_rate = 8.0
        tenure_years = 7
        moratorium_months = 6
        eligibility = "ELIGIBLE"
    else:
        scheme = "No Concessional Scheme Available"
        interest_rate = 0.0
        tenure_years = 0
        moratorium_months = 0
        eligibility = "NOT ELIGIBLE"

    # Overrides if specified
    if interest_rate_override is not None and interest_rate_override > 0:
        interest_rate = interest_rate_override
    if tenure_years_override is not None and tenure_years_override > 0:
        tenure_years = tenure_years_override

    # 3. Repayment & EMI Calculations
    if eligibility == "ELIGIBLE" and loan_amount > 0 and tenure_years > 0:
        monthly_rate = interest_rate / (12 * 100)
        total_months = tenure_years * 12
        
        # Standard Annuity Formula
        pow_term = (1 + monthly_rate) ** total_months
        raw_emi = loan_amount * monthly_rate * pow_term / (pow_term - 1)
        emi = round(raw_emi, 2)
        quarterly_emi = round(emi * 3, 2)
        total_payment = round(emi * total_months, 2)
        total_interest = round(total_payment - loan_amount, 2)
        first_emi_note = f"First EMI repayment commences after {moratorium_months} months grace period."
    else:
        emi = 0.0
        quarterly_emi = 0.0
        total_interest = 0.0
        total_repayment = 0.0
        first_emi_note = "Project cost exceeds maximum scheme threshold of ₹50,00,000."

    # 4. Multi-Year Cashflow Projections & Viability
    # Standard MSME operating metrics: Annual revenue estimated at 48% of project capital initially
    base_annual_revenue = project_cost * 0.52
    cashflow_forecast: List[YearlyCashflow] = []
    cumulative_cash = 0.0

    for yr in range(1, 6):
        growth_multiplier = (1.08) ** (yr - 1)
        gross_rev = base_annual_revenue * growth_multiplier
        # OpEx typically 52% of revenue for rural microenterprises
        opex = gross_rev * 0.52
        annual_debt_service = (emi * 12) if yr <= tenure_years else 0.0
        net_profit = max(0.0, gross_rev - opex - annual_debt_service)
        cumulative_cash += net_profit * 0.75 # 75% retained into cash reserve
        
        cashflow_forecast.append(
            YearlyCashflow(
                year=yr,
                gross_revenue=round(gross_rev, 2),
                operating_expenses=round(opex, 2),
                loan_repayment=round(annual_debt_service, 2),
                net_profit=round(net_profit, 2),
                cash_reserve=round(cumulative_cash, 2)
            )
        )

    # 5. Financial Indicators
    annual_net_profit_avg = cashflow_forecast[1].net_profit if len(cashflow_forecast) > 1 else 1.0
    roi_percent = round((annual_net_profit_avg / max(margin_capital, 1.0)) * 100, 1)
    
    # Break-even period in months (Margin capital / monthly net cashflow)
    monthly_net = annual_net_profit_avg / 12.0
    break_even_months = max(4, min(36, int(round(margin_capital / max(monthly_net, 1.0))))) if monthly_net > 0 else 24

    # Financial Viability Score (0-100) based on coverage, ROI, margin ratio
    dscr = (base_annual_revenue * 0.48) / max((emi * 12), 1.0) if emi > 0 else 1.5
    raw_score = 50.0 + (min(dscr, 2.5) * 15.0) + (min(roi_percent, 60.0) * 0.25)
    financial_viability_score = round(min(96.0, max(40.0, raw_score)), 1)

    return FinancialCalculationResponse(
        margin_capital=round(margin_capital, 2),
        project_cost=round(project_cost, 2),
        loan_amount=round(loan_amount, 2),
        scheme=scheme,
        interest_rate=interest_rate,
        tenure_years=tenure_years,
        moratorium_months=moratorium_months,
        monthly_emi=round(emi, 2),
        quarterly_emi=round(quarterly_emi, 2),
        total_interest=round(total_interest, 2),
        total_repayment=round(total_payment if eligibility == "ELIGIBLE" else 0.0, 2),
        eligibility=eligibility,
        roi_percent=roi_percent,
        break_even_months=break_even_months,
        financial_viability_score=financial_viability_score,
        first_emi_note=first_emi_note,
        cashflow_forecast=cashflow_forecast
    )
