import uuid
from sqlalchemy import Column, String, Float, Text, Index
from app.db.session import Base

class Village(Base):
    __tablename__ = "villages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    district = Column(String(100), nullable=False, index=True)
    mandal = Column(String(100), nullable=False, index=True)
    village_name = Column(String(150), nullable=False, index=True)
    latitude = Column(Float, nullable=False)   # WGS84 GPS Latitude
    longitude = Column(Float, nullable=False)  # WGS84 GPS Longitude
    projected_x = Column(Float, nullable=True) # EPSG:7755 Easting in meters
    projected_y = Column(Float, nullable=True) # EPSG:7755 Northing in meters
    geojson = Column(Text, nullable=True)      # Polygon geometry if cached

    __table_args__ = (
        Index("ix_village_dist_mand_name", "district", "mandal", "village_name"),
        Index("ix_village_lat_lon", "latitude", "longitude"),
    )
