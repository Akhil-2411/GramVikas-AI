from fastapi import APIRouter, Query, Response
from app.services.report_service import generate_pdf_report
from app.schemas.all_schemas import ReportGenerateRequest

router = APIRouter(prefix="/reports", tags=["Report Generation"])

@router.get("/download")
def download_pdf_report(
    district: str = Query("Adilabad"),
    village: str = Query("Tamsi-B"),
    category: str = Query("Food Processing"),
    margin: float = Query(100000.0)
):
    """
    Generate and directly download a comprehensive PDF MSME Feasibility Report.
    """
    pdf_bytes = generate_pdf_report(
        district=district,
        village=village,
        business_category=category,
        margin_capital=margin
    )
    
    filename = f"GramVikas_Report_{district}_{datetime_stamp()}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.post("/generate")
def create_report(req: ReportGenerateRequest):
    """Generate feasibility report metadata and download link"""
    download_url = f"/api/v1/reports/download?district={req.district}&village={req.village}&category={req.business_category}&margin={req.margin_capital}"
    return {
        "status": "ready",
        "title": f"MSME Advisory Report - {req.district} ({req.business_category})",
        "download_url": download_url,
        "format": "PDF"
    }

def datetime_stamp():
    import datetime
    return datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
