from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.schemas.all_schemas import (
    RadiusSearchRequest,
    RadiusSearchResponse,
    VillageItem
)
from app.services.geo_service import geo_engine

router = APIRouter(prefix="/geo", tags=["Geospatial & Village Intelligence"])

@router.get("/districts", response_model=List[str])
def get_all_districts():
    """Retrieve all 33 Telangana districts"""
    return geo_engine.get_districts()

@router.get("/mandals", response_model=List[str])
def get_mandals_by_district(district: str = Query(...)):
    """Retrieve all mandals / sub-districts within a specific district"""
    return geo_engine.get_mandals(district)

@router.get("/villages")
def get_villages_in_mandal(
    district: str = Query(...),
    mandal: Optional[str] = Query(None)
):
    """Retrieve villages in a district or mandal"""
    return geo_engine.get_villages(district, mandal)

@router.get("/search")
def search_locations(q: str = Query(..., min_length=2)):
    """Instant search across villages, mandals, and districts"""
    return geo_engine.search_locations(q)

@router.post("/radius", response_model=RadiusSearchResponse)
def execute_radius_search(req: RadiusSearchRequest):
    """
    Execute PostGIS-accurate Euclidean radius analysis (5 km, 10 km, 20 km)
    around a selected village, returning neighbor villages, enterprise density,
    and estimated consumer reach.
    """
    return geo_engine.radius_search(
        district=req.district,
        village_name=req.village_name,
        radius_km=req.radius_km
    )

@router.get("/village-detail")
def get_village_detail(district: str = Query(...), village: str = Query(...)):
    """Fetch centroid coordinates and metadata for a specific village"""
    info = geo_engine.find_village(district, village)
    if not info:
        raise HTTPException(status_code=404, detail="Village not found")
    return info
