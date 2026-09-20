# GramVikas AI (Smart India Hackathon 2026)
### AI-Driven Hyper-Local MSME Business Advisory & Financial Structuring Platform for Rural Micro-Entrepreneurs

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015-000000.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20PostGIS-336791.svg)](https://postgis.net/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Problem Statement & Overview
- **Problem Statement ID**: 26091
- **Organization**: Ministry of Social Justice and Empowerment (MoSJE)
- **Theme**: Agriculture, FoodTech & Rural Development

Many first-time rural and semi-urban entrepreneurs face business failure because they lack access to formal market research, choose businesses based on assumptions rather than data, do not understand loan eligibility requirements, and struggle with repayment calculations.

**GramVikas AI** solves this by acting as a digital business consultant, market analyst, and concessional financial advisor specifically designed for grassroots entrepreneurs.

---

## Core System Capabilities

1. **Hyper-Local Business Recommendation Engine**: Evaluates district competition, capital adequacy, and local ecosystem to recommend top ranked enterprises with Opportunity, Competition, and Risk scores.
2. **AI SWOT Analysis Engine**: Dynamic SWOT Matrix providing explicit causal reasoning (**WHY each factor exists**) grounded in mandal agriculture and power economics.
3. **Smart Financial Structuring**: Implements `financial_calculator.py` logic:
   - Total Project Cost = Margin Capital ÷ 10% (10x Founder Leverage)
   - Maximum Loan = Project Cost × 90%
   - Scheme routing: Micro Finance (≤ ₹1.4L @ 6.5%, 3-yr tenure, 3-mo moratorium) vs Term Loan (≤ ₹50L @ 8.0%, 7-yr tenure, 6-mo moratorium)
   - Multi-year cashflow projections, break-even timelines, and financial viability scores.
4. **Government Scheme Finder**: Automated eligibility matching for MoSJE concessional finance, PMEGP (up to 35% subsidy), Stand-Up India, MUDRA, and CGTMSE.
5. **Village Intelligence & GIS Map**: Interactive Leaflet / OpenStreetMap visualization georeferenced to **EPSG:7755 (`WGS 84 / India NSF LCC`)** covering 10,455 Telangana revenue villages.
6. **PostGIS Metric Radius Analysis**: Calculates exact 5 km, 10 km, and 20 km metric trade corridors, counting neighbor villages, reachable customer demographics, and competitor density.
7. **Market Gap & Saturation Analysis**: Highlights underserved rural product niches (dairy chilling, mini dal milling) vs oversaturated commodities (basic kirana).
8. **District Analytics**: 33 Telangana districts benchmarked on MSME distribution and competition intensity.
9. **AI Business Advisor**: Multilingual conversational agent powered by Google Gemini API with fallback rule-based intelligence.
10. **PDF Report Generation**: Instant downloadable executive feasibility reports structured for State Channelizing Agencies (SCAs) and bank loan officers.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn UI styling, Framer Motion, Recharts, React-Leaflet, Zustand, TanStack Query |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy 2.0, Alembic, Pydantic v2, PyProj, GeoPandas, Shapely, ReportLab |
| **Database** | PostgreSQL 16 + PostGIS (with SQLite fallback for instant local execution) |
| **AI** | Google Gemini API (gemini-1.5-flash / gemini-2.0-flash) |
| **GIS / Maps** | Leaflet.js, OpenStreetMap, EPSG:7755 to WGS84 Transformer |
| **Deployment** | Docker & Docker Compose, Vercel ready, Railway ready |

---

## Quickstart Guide

### Option 1: Docker (Single Command Full Stack)
```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostGIS Database**: `localhost:5432`

---

### Option 2: Localhost Development

#### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt

# Run dataset ingestion (Populates 788 districts, 10,455 villages, and MSME sample)
python scripts/ingest_data.py

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Swagger Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts
- **Entrepreneur**: `demo@gramvikas.ai` / `Demo@1234`
- **MoSJE Administrator**: `admin@gramvikas.gov.in` / `Admin@1234`
