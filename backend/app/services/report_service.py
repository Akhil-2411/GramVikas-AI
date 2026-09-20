import os
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from app.services.financial_service import calculate_finances
from app.services.advisory_service import advisory_engine
from app.services.geo_service import geo_engine
from app.schemas.all_schemas import AnalyzeBusinessRequest

def generate_pdf_report(
    district: str,
    village: str,
    business_category: str,
    margin_capital: float
) -> bytes:
    """
    Compiles a comprehensive professional PDF Feasibility and Financial Structuring Report.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#065F46"), # Emerald dark
        fontName="Helvetica-Bold",
        alignment=1 # Center
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#4B5563"),
        alignment=1
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1E3A8A"), # Blue dark
        fontName="Helvetica-Bold",
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1F2937")
    )
    bold_body = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName="Helvetica-Bold"
    )

    story = []

    # 1. Header
    story.append(Paragraph("GRAMVIKAS AI — MSME BUSINESS FEASIBILITY REPORT", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Smart India Hackathon 2026 | Ministry of Social Justice & Empowerment (MoSJE)", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#059669"), spaceAfter=12))

    # 2. Executive Summary Table
    finances = calculate_finances(margin_capital)
    advisory_res = advisory_engine.analyze_business(
        AnalyzeBusinessRequest(
            district=district,
            village=village,
            business_category=business_category,
            margin_capital=margin_capital
        )
    )
    radius_res = geo_engine.radius_search(district, village, radius_km=5.0)

    summary_data = [
        [Paragraph("Target District", bold_body), Paragraph(district.title(), body_style),
         Paragraph("Target Village", bold_body), Paragraph(village or "Gram Panchayat", body_style)],
        [Paragraph("Available Margin Capital", bold_body), Paragraph(f"₹{margin_capital:,.0f}", body_style),
         Paragraph("Total Project Cost", bold_body), Paragraph(f"₹{finances.project_cost:,.0f}", body_style)],
        [Paragraph("Eligible Loan Amount (90%)", bold_body), Paragraph(f"₹{finances.loan_amount:,.0f}", body_style),
         Paragraph("Concessional Scheme", bold_body), Paragraph(finances.scheme, body_style)],
        [Paragraph("Monthly EMI", bold_body), Paragraph(f"₹{finances.monthly_emi:,.0f}", body_style),
         Paragraph("Repayment Moratorium", bold_body), Paragraph(f"{finances.moratorium_months} Months Grace Period", body_style)],
        [Paragraph("Opportunity Score", bold_body), Paragraph(f"{advisory_res.opportunity_score} / 100", body_style),
         Paragraph("5 km Consumer Reach", bold_body), Paragraph(f"{radius_res.estimated_consumer_reach:,} citizens", body_style)]
    ]

    t_summary = Table(summary_data, colWidths=[130, 135, 130, 135])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F9FAFB")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_summary)
    story.append(Spacer(1, 14))

    # 3. Financial Structuring & Cashflow Forecast
    story.append(Paragraph("1. Smart Financial Structuring & 5-Year Cashflow Plan", section_heading))
    
    cashflow_headers = [
        Paragraph("Year", bold_body),
        Paragraph("Gross Revenue", bold_body),
        Paragraph("Operating Cost", bold_body),
        Paragraph("Loan EMI (Annual)", bold_body),
        Paragraph("Net Profit", bold_body),
        Paragraph("Cash Reserve", bold_body)
    ]
    cashflow_rows = [cashflow_headers]
    for c in finances.cashflow_forecast:
        cashflow_rows.append([
            Paragraph(f"Year {c.year}", body_style),
            Paragraph(f"₹{c.gross_revenue:,.0f}", body_style),
            Paragraph(f"₹{c.operating_expenses:,.0f}", body_style),
            Paragraph(f"₹{c.loan_repayment:,.0f}", body_style),
            Paragraph(f"₹{c.net_profit:,.0f}", body_style),
            Paragraph(f"₹{c.cash_reserve:,.0f}", body_style)
        ])

    t_cashflow = Table(cashflow_rows, colWidths=[55, 95, 95, 100, 95, 90])
    t_cashflow.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EFF6FF")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#D1D5DB")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_cashflow)
    story.append(Spacer(1, 14))

    # 4. Top Recommended Enterprises
    story.append(Paragraph("2. Top Recommended Enterprise Opportunities", section_heading))
    top_businesses = advisory_res.recommendations[:3]

    biz_headers = [
        Paragraph("Rank & Title", bold_body),
        Paragraph("Category", bold_body),
        Paragraph("Opportunity", bold_body),
        Paragraph("Est. Revenue", bold_body),
        Paragraph("Profit Margin", bold_body)
    ]
    biz_rows = [biz_headers]
    for b in top_businesses:
        biz_rows.append([
            Paragraph(f"<b>#{b.rank}</b> {b.title}", body_style),
            Paragraph(b.category, body_style),
            Paragraph(f"{b.opportunity_score}%", body_style),
            Paragraph(f"₹{b.estimated_revenue:,.0f}", body_style),
            Paragraph(f"{b.profit_margin}%", body_style)
        ])

    t_biz = Table(biz_rows, colWidths=[190, 110, 75, 85, 70])
    t_biz.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#ECFDF5")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#D1D5DB")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_biz)
    story.append(Spacer(1, 14))

    # 5. SWOT Analysis Matrix
    story.append(Paragraph("3. AI SWOT Analysis with Causal Reasoning", section_heading))
    if top_businesses and top_businesses[0].swot:
        swot = top_businesses[0].swot
        swot_data = [
            [
                Paragraph("<b>STRENGTHS</b><br/>" + "<br/>".join([f"• <b>{s.point}</b>: {s.why}" for s in swot.strengths[:2]]), body_style),
                Paragraph("<b>WEAKNESSES</b><br/>" + "<br/>".join([f"• <b>{w.point}</b>: {w.why}" for w in swot.weaknesses[:2]]), body_style)
            ],
            [
                Paragraph("<b>OPPORTUNITIES</b><br/>" + "<br/>".join([f"• <b>{o.point}</b>: {o.why}" for o in swot.opportunities[:2]]), body_style),
                Paragraph("<b>THREATS</b><br/>" + "<br/>".join([f"• <b>{t.point}</b>: {t.why}" for t in swot.threats[:2]]), body_style)
            ]
        ]
        t_swot = Table(swot_data, colWidths=[265, 265])
        t_swot.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#F0FDF4")), # Light green
            ('BACKGROUND', (1, 0), (1, 0), colors.HexColor("#FEF2F2")), # Light red
            ('BACKGROUND', (0, 1), (0, 1), colors.HexColor("#EFF6FF")), # Light blue
            ('BACKGROUND', (1, 1), (1, 1), colors.HexColor("#FFFBEB")), # Light amber
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#D1D5DB")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(t_swot)

    story.append(Spacer(1, 14))
    
    # 6. Footer Note
    story.append(Paragraph(
        "<i>Generated automatically by GramVikas AI Decision Support Engine for Smart India Hackathon 2026. "
        "Compliant with MoSJE Concessional Lending Guidelines.</i>",
        subtitle_style
    ))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
