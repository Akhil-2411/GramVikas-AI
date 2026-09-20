"""
Data Ingestion Pipeline for GramVikas AI:
Ingests:
- datasets/district_msme_final.csv -> district_msme table
- datasets/telangana_village_centroids.csv -> villages table (with EPSG:7755 -> EPSG:4326 conversion)
- datasets/cleaned_msme_final.xls -> msme_enterprises table
"""

import os
import sys
from pathlib import Path
import pandas as pd
import pyproj

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.db.session import engine, SessionLocal, Base
from app.models.msme import DistrictMSME, MSMEEnterprise
from app.models.village import Village
from app.core.config import settings

def run_ingestion():
    print("==================================================")
    print("Starting GramVikas AI Dataset Ingestion Pipeline")
    print("==================================================")

    # 1. Initialize Tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 2. Ingest District MSME Dataset
        print(f"\n[1/3] Reading District MSME Dataset: {settings.DISTRICT_MSME_CSV}")
        if os.path.exists(settings.DISTRICT_MSME_CSV):
            df_dist = pd.read_csv(settings.DISTRICT_MSME_CSV)
            df_dist.columns = [c.strip() for c in df_dist.columns]
            
            # Filter for Telangana districts or include all
            count = 0
            for _, row in df_dist.iterrows():
                d_name = str(row['district_name']).strip().title()
                existing = db.query(DistrictMSME).filter(DistrictMSME.district_name == d_name).first()
                
                comp = str(row.get('competition', 'Medium')).strip().title()
                opp_score = 88.0 if comp == "Low" else (75.0 if comp == "Medium" else 62.0)
                
                if not existing:
                    dm = DistrictMSME(
                        state_name=str(row.get('state_name', 'Telangana')).strip(),
                        district_name=d_name,
                        micro=int(row.get('micro', 0)),
                        small=int(row.get('small', 0)),
                        medium=int(row.get('medium', 0)),
                        total=int(row.get('total', 0)),
                        competition=comp,
                        opportunity_score=opp_score
                    )
                    db.add(dm)
                    count += 1
            db.commit()
            print(f" -> Successfully inserted {count} district MSME records.")
        else:
            print(" -> File not found, skipping.")

        # 3. Ingest Telangana Village Centroids with EPSG:7755 -> WGS84 Projection
        print(f"\n[2/3] Reading Telangana Village Centroids: {settings.VILLAGE_CENTROIDS_CSV}")
        if os.path.exists(settings.VILLAGE_CENTROIDS_CSV):
            df_vills = pd.read_csv(settings.VILLAGE_CENTROIDS_CSV)
            df_vills.columns = [c.strip() for c in df_vills.columns]
            
            # Setup coordinate transformer
            transformer = pyproj.Transformer.from_crs("EPSG:7755", "EPSG:4326", always_xy=True)
            
            existing_vill_count = db.query(Village).count()
            if existing_vill_count == 0:
                print(f" -> Transforming {len(df_vills)} projected coordinates to GPS WGS84...")
                vill_objects = []
                for _, row in df_vills.iterrows():
                    proj_x = float(row['longitude']) # Easting in raw CSV
                    proj_y = float(row['latitude'])  # Northing in raw CSV
                    gps_lon, gps_lat = transformer.transform(proj_x, proj_y)

                    vill = Village(
                        district=str(row['DISTRICT']).strip().title(),
                        mandal=str(row['Sub_dist']).strip().title(),
                        village_name=str(row['Vill_name']).strip(),
                        latitude=round(gps_lat, 5),
                        longitude=round(gps_lon, 5),
                        projected_x=proj_x,
                        projected_y=proj_y
                    )
                    vill_objects.append(vill)

                # Batch insert
                db.bulk_save_objects(vill_objects)
                db.commit()
                print(f" -> Successfully ingested {len(vill_objects)} villages.")
            else:
                print(f" -> Villages table already populated with {existing_vill_count} records.")
        else:
            print(" -> File not found, skipping.")

        # 4. Ingest Cleaned MSME Enterprise Sample
        print(f"\n[3/3] Reading Cleaned MSME Enterprise Dataset: {settings.CLEANED_MSME_XLS}")
        if os.path.exists(settings.CLEANED_MSME_XLS):
            existing_ent_count = db.query(MSMEEnterprise).count()
            if existing_ent_count == 0:
                # Ingest sample of 25,000 for high performance in relational db
                df_ent = pd.read_csv(settings.CLEANED_MSME_XLS, nrows=25000)
                df_ent.columns = [c.strip() for c in df_ent.columns]
                ent_objects = []
                for _, row in df_ent.iterrows():
                    ent = MSMEEnterprise(
                        state=str(row.get('State', 'TELANGANA')).strip(),
                        district=str(row.get('District', 'HYDERABAD')).strip().title(),
                        enterprise_name=str(row.get('EnterpriseName', 'Micro Enterprise')).strip(),
                        activity_desc=str(row.get('activity_desc', 'General Activity')).strip()[:500],
                        nic_code=int(row.get('nic_code', 0)) if pd.notna(row.get('nic_code')) else None
                    )
                    ent_objects.append(ent)
                db.bulk_save_objects(ent_objects)
                db.commit()
                print(f" -> Successfully ingested {len(ent_objects)} MSME enterprise sample records.")
            else:
                print(f" -> MSME enterprises table already contains {existing_ent_count} records.")
        else:
            print(" -> File not found, skipping.")

        print("\n==================================================")
        print("Ingestion Completed Successfully!")
        print("==================================================")

    except Exception as e:
        db.rollback()
        print(f"[Ingestion Error] {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    run_ingestion()
