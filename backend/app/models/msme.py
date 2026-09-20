import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, Index
from app.db.session import Base

class DistrictMSME(Base):
    __tablename__ = "district_msme"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    state_name = Column(String(100), default="Telangana", nullable=False)
    district_name = Column(String(100), nullable=False, index=True)
    micro = Column(Integer, default=0, nullable=False)
    small = Column(Integer, default=0, nullable=False)
    medium = Column(Integer, default=0, nullable=False)
    total = Column(Integer, default=0, nullable=False)
    competition = Column(String(20), default="Medium", nullable=False) # 'Low', 'Medium', 'High'
    opportunity_score = Column(Float, default=70.0, nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("ix_dist_msme_state_dist", "state_name", "district_name", unique=True),
    )

class MSMEEnterprise(Base):
    __tablename__ = "msme_enterprises"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    state = Column(String(100), default="TELANGANA", nullable=False)
    district = Column(String(100), nullable=False, index=True)
    enterprise_name = Column(String(255), nullable=False)
    activity_desc = Column(String(500), nullable=False, index=True)
    nic_code = Column(Integer, nullable=True, index=True)

    __table_args__ = (
        Index("ix_enterprise_dist_act", "district", "activity_desc"),
    )
