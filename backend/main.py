from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import random
from engine.detection import detect_deforestation, detect_mining, detect_fire

app = FastAPI(title="CANOPIX API v2.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---

class AlertProperties(BaseModel):
    alert_id: str
    alert_type: str
    severity: str
    confidence_score: float
    centroid: dict
    area_affected_ha: float
    detection_date: str
    region: str
    protected_area: bool
    carbon_estimate_tonnes: float

class Alert(BaseModel):
    type: str = "Feature"
    geometry: dict
    properties: AlertProperties

# --- MOCK DATA GENERATOR ---
# Simulates the result of the multi-sensor detection engine

def generate_mock_alerts():
    alerts = []
    
    # 1. Deforestation Alert (Western Ghats Example)
    def_alert = detect_deforestation(
        delta_ndvi=-0.41,
        delta_evi=-0.35,
        sar_vh_change_db=-4.2,
        sar_vv_change_db=-3.1,
        persistence_windows=3,
        area_ha=620.4,
        in_protected_area=True
    )
    if def_alert:
        alerts.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [77.14, 9.52]},
            "properties": {
                "alert_id": f"CAN-{datetime.now().strftime('%Y%m%d')}-WG-001",
                "alert_type": def_alert["type"],
                "severity": def_alert["severity"],
                "confidence_score": def_alert["confidence"],
                "centroid": {"lat": 9.52, "lon": 77.14},
                "area_affected_ha": def_alert["area_ha"],
                "detection_date": datetime.now().isoformat(),
                "region": "Western Ghats, Kerala",
                "protected_area": True,
                "carbon_estimate_tonnes": 9800,
                "observations": [
                    "Vegetation Index (NDVI) dropped by 41% vs seasonal baseline",
                    "Radar VH backscatter lost 4.2dB - structural canopy collapse",
                    "Persistent anomaly confirmed across 3 satellite passes",
                    "Located inside Periyar Tiger Reserve sanctuary boundary"
                ]
            }
        })

    # 2. Illegal Mining Alert (Central India Example)
    min_alert = detect_mining(
        bsi=0.22,
        bsi_change=0.15,
        has_water_adjacent=True,
        has_dihedral_increase=True,
        dist_to_road=450,
        in_licensed_concession=False,
        area_ha=12.5
    )
    if min_alert:
        alerts.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [82.5, 21.2]},
            "properties": {
                "alert_id": f"CAN-{datetime.now().strftime('%Y%m%d')}-CI-002",
                "alert_type": min_alert["type"],
                "severity": min_alert["severity"],
                "confidence_score": min_alert["confidence"],
                "centroid": {"lat": 21.2, "lon": 82.5},
                "area_affected_ha": min_alert["area_ha"],
                "detection_date": datetime.now().isoformat(),
                "region": "Central India, Chhattisgarh",
                "protected_area": False,
                "carbon_estimate_tonnes": 450,
                "observations": [
                    "Bare Soil Index (BSI) spike of +22% detected",
                    "Spectral signatures matches fresh earth excavation",
                    "New open water body (mining pond) detected in adjacent pixels",
                    "Activity located 450m from arterial forest access road"
                ]
            }
        })

    # 3. Active Fire (Northeast India)
    fire_alert = detect_fire(
        viirs_conf="high",
        frp=125.0,
        persistence_passes=4,
        spread_rate_ha_6h=650,
        in_protected_area=True
    )
    if fire_alert:
        alerts.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [93.5, 26.2]},
            "properties": {
                "alert_id": f"CAN-{datetime.now().strftime('%Y%m%d')}-NE-003",
                "alert_type": fire_alert["type"],
                "severity": fire_alert["severity"],
                "confidence_score": fire_alert["confidence"],
                "centroid": {"lat": 26.2, "lon": 93.5},
                "area_affected_ha": 85.0,
                "detection_date": datetime.now().isoformat(),
                "region": "Northeast India, Assam",
                "protected_area": True,
                "carbon_estimate_tonnes": 1200,
                "observations": [
                    "Extreme thermal anomaly: 125MW Fire Radiative Power (FRP)",
                    "High-magnitude VIIRS S-NPP detection (100% confidence)",
                    "Fire spread rate calculated at 650 ha/6h (Rapid Expansion)",
                    "Critical threat to Kaziranga fringe forest zones"
                ]
            }
        })

    return alerts

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"name": "CANOPIX Detection Engine API", "version": "2.0", "status": "online"}

@app.get("/alerts")
def get_alerts():
    return {"alerts": generate_mock_alerts()}

@app.get("/summary")
def get_summary():
    alerts = generate_mock_alerts()
    return {
        "scan_date": datetime.now().strftime("%Y-%m-%d"),
        "total_alerts": len(alerts),
        "total_area_ha": sum(a["properties"]["area_affected_ha"] for a in alerts),
        "total_carbon_tonnes": sum(a["properties"]["carbon_estimate_tonnes"] for a in alerts),
        "sensor_status": {
            "sentinel_1": "active",
            "sentinel_2": "active",
            "viirs": "active"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
