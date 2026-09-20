from typing import List, Optional
from app.schemas.all_schemas import SchemeItem, SchemeResponse

GOVERNMENT_SCHEMES_DATABASE: List[SchemeItem] = [
    SchemeItem(
        id="mosje-micro-finance",
        name="MoSJE Micro Finance Concessional Scheme",
        ministry="Ministry of Social Justice and Empowerment (MoSJE)",
        coverage_pct=90.0,
        max_loan_lakhs=1.25,
        interest_rate=6.5,
        subsidy_rate=15.0,
        tenure_years=3,
        moratorium_months=3,
        eligibility="Total Project Cost up to ₹1,40,000 with minimum 10% entrepreneur margin capital.",
        eligible=True,
        benefits="90% low-interest term credit, 3-month repayment moratorium, no collateral requirement.",
        required_documents=[
            "Aadhaar Card & Voter ID",
            "Caste/Income Certificate (if applicable for NBCFDC/NSFDC)",
            "Bank Passbook with 6 months transaction history",
            "Village/Gram Panchayat Business Residence Proof",
            "Simple Project Quotation / Machinery Estimate"
        ],
        target_beneficiaries="Rural micro-entrepreneurs, self-employed artisans, agricultural traders, youth."
    ),
    SchemeItem(
        id="mosje-term-loan",
        name="MoSJE Term Loan Concessional Scheme",
        ministry="Ministry of Social Justice and Empowerment (MoSJE)",
        coverage_pct=90.0,
        max_loan_lakhs=45.0,
        interest_rate=8.0,
        subsidy_rate=20.0,
        tenure_years=7,
        moratorium_months=6,
        eligibility="Project Cost between ₹1,40,000 and ₹50,00,000. Beneficiary contribution 10%.",
        eligible=True,
        benefits="Up to ₹45 Lakhs concessional funding, extended 7-year repayment window, 6-month moratorium.",
        required_documents=[
            "Aadhaar & PAN Card",
            "Detailed Project Feasibility Report (DPR)",
            "Land / Shed Lease Agreement or Ownership Deed",
            "Machinery Quotations from registered suppliers",
            "Udyam Registration Certificate"
        ],
        target_beneficiaries="Rural and semi-urban small manufacturers, processing units, service centers."
    ),
    SchemeItem(
        id="pmegp-scheme",
        name="Prime Minister Employment Generation Programme (PMEGP)",
        ministry="Ministry of MSME / KVIC",
        coverage_pct=95.0,
        max_loan_lakhs=50.0,
        interest_rate=9.0,
        subsidy_rate=35.0,
        tenure_years=7,
        moratorium_months=6,
        eligibility="Any individual above 18 years. 8th pass for projects above ₹10 Lakhs (Mfg).",
        eligible=True,
        benefits="Up to 35% margin money government subsidy for rural women and special categories.",
        required_documents=[
            "Educational Qualification Certificate (8th / 10th pass)",
            "EDP Training Completion Certificate",
            "Project Report with capital expenditure breakdown",
            "Rural Area Certificate attested by Tehsildar"
        ],
        target_beneficiaries="First-time rural manufacturing and service entrepreneurs."
    ),
    SchemeItem(
        id="mudra-tarun",
        name="Pradhan Mantri MUDRA Yojana (PMMY) - Tarun Category",
        ministry="Department of Financial Services, Ministry of Finance",
        coverage_pct=85.0,
        max_loan_lakhs=10.0,
        interest_rate=9.5,
        subsidy_rate=0.0,
        tenure_years=5,
        moratorium_months=3,
        eligibility="Non-farm micro and small enterprises in retail, trading, services, or manufacturing.",
        eligible=True,
        benefits="Collateral-free commercial loans up to ₹10 Lakhs with MUDRA debit card for working capital.",
        required_documents=[
            "Identity Proof & Address Proof",
            "Business Establishment Proof / Trade License",
            "12-month Bank Statement",
            "Estimated 1-year Sales & Balance Sheet"
        ],
        target_beneficiaries="Small business owners seeking working capital and machinery upgrades."
    ),
    SchemeItem(
        id="stand-up-india",
        name="Stand-Up India Scheme for Women & SC/ST",
        ministry="Ministry of Finance",
        coverage_pct=85.0,
        max_loan_lakhs=100.0,
        interest_rate=8.5,
        subsidy_rate=15.0,
        tenure_years=7,
        moratorium_months=18,
        eligibility="SC/ST or Women entrepreneurs establishing a greenfield enterprise in manufacturing, services, or trading.",
        eligible=True,
        benefits="Substantial credit access from ₹10 Lakh to ₹1 Crore with up to 18 months moratorium.",
        required_documents=[
            "Caste Certificate / Proof of Gender",
            "Greenfield Project Report",
            "Pollution Control Clearance (if applicable)",
            "Audited Balance Sheets (if existing partnership)"
        ],
        target_beneficiaries="Women and SC/ST greenfield founders establishing scalable enterprises."
    )
]

def recommend_schemes(
    gender: Optional[str] = "All",
    category: Optional[str] = "General",
    budget: Optional[float] = 1000000.0,
    business_type: Optional[str] = "Manufacturing"
) -> SchemeResponse:
    """Evaluate and match government schemes based on applicant criteria and project capital"""
    project_cost = budget if budget and budget > 0 else 1000000.0
    results: List[SchemeItem] = []

    for item in GOVERNMENT_SCHEMES_DATABASE:
        copy_scheme = item.model_copy()
        is_eligible = True

        # Rule evaluation
        if copy_scheme.id == "mosje-micro-finance":
            is_eligible = project_cost <= 140000
        elif copy_scheme.id == "mosje-term-loan":
            is_eligible = (140000 < project_cost <= 5000000)
        elif copy_scheme.id == "stand-up-india":
            # Stand up India specifically prioritizes Women and SC/ST founders
            cat_upper = (category or "").upper()
            gen_upper = (gender or "").upper()
            is_eligible = ("WOMAN" in gen_upper or "FEMALE" in gen_upper or "SC" in cat_upper or "ST" in cat_upper) and (project_cost >= 1000000)
        elif copy_scheme.id == "mudra-tarun":
            is_eligible = project_cost <= 1500000

        copy_scheme.eligible = is_eligible
        results.append(copy_scheme)

    # Prioritize eligible schemes first
    results.sort(key=lambda s: (not s.eligible, s.interest_rate))

    top_rec = next((s for s in results if s.eligible), results[0] if results else None)

    return SchemeResponse(
        eligible_schemes=results,
        top_recommended=top_rec,
        total_count=len(results)
    )
