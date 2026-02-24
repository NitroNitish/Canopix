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
    
    # 1. Deforestation Alert (Western Ghats - Maharashtra/Kerala)
    alerts.append({
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [73.7, 17.9]},
        "properties": {
            "alert_id": f"CAN-{datetime.now().strftime('%Y%m%d')}-MH-001",
            "alert_type": "Deforestation",
            "severity": "High",
            "confidence_score": 92.4,
            "centroid": {"lat": 17.9, "lon": 73.7},
            "area_affected_ha": 42.5,
            "detection_date": datetime.now().isoformat(),
            "region": "Western Ghats, Maharashtra",
            "protected_area": True,
            "carbon_estimate_tonnes": 5400,
            "observations": [
                "NDVI Anomaly: -0.42 drop in dense evergreen canopy",
                "Sentinel-1 SAR Coherence Loss: -5.8dB (Structural Collapse)",
                "Estimated Canopy Height Loss: 12m (GEDI-fused estimate)",
                "Spatial cluster confirmed across 3 consecutive Sentinel tracks"
            ]
        }
    })

    # 2. Mountainous Illegal Mining (Rajasthan - Aravali Range)
    alerts.append({
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [76.2, 27.3]},
        "properties": {
            "alert_id": f"CAN-{datetime.now().strftime('%Y%m%d')}-RJ-002",
            "alert_type": "Illegal Mining",
            "severity": "Critical",
            "confidence_score": 88.7,
            "centroid": {"lat": 27.3, "lon": 76.2},
            "area_affected_ha": 8.2,
            "detection_date": datetime.now().isoformat(),
            "region": "Aravallis, Rajasthan",
            "protected_area": False,
            "carbon_estimate_tonnes": 120,
            "observations": [
                "Bare Soil Index (BSI) Extreme Spike: +0.38 index value",
                "Est. Excavation Volume: 45,000 m³ (Stereo-pair analysis)",
                "Spectral Match: Open-pit granite/marble signature",
                "Dihedral radar return increase: Vertical pit walls detected"
            ]
        }
    })

    # 3. Riverine Sand Mining (Jammu & Kashmir - Jhelum Basin)
    alerts.append({
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [74.8, 34.1]},
        "properties": {
            "alert_id": f"CAN-{datetime.now().strftime('%Y%m%d')}-JK-003",
            "alert_type": "Illegal Mining",
            "severity": "Medium",
            "confidence_score": 81.2,
            "centroid": {"lat": 34.1, "lon": 74.8},
            "area_affected_ha": 3.5,
            "detection_date": datetime.now().isoformat(),
            "region": "Jhelum Basin, J&K",
            "protected_area": False,
            "carbon_estimate_tonnes": 0,
            "observations": [
                "Riverbed Geomorphology Change: High turbidity detected",
                "Sentinel-2 Short Wave Infrared (SWIR): Fresh sand bar disturbance",
                "Temporal Shift: Major river channel alteration detected in 10 days",
                "Frequent heavy machinery heat signatures (VIIRS-fused)"
            ]
        }
    })

    # 4. Active Fire (Central India - Chhattisgarh)
    alerts.append({
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [82.5, 21.2]},
        "properties": {
            "alert_id": f"CAN-{datetime.now().strftime('%Y%m%d')}-CI-004",
            "alert_type": "Active Fire",
            "severity": "High",
            "confidence_score": 99.0,
            "centroid": {"lat": 21.2, "lon": 82.5},
            "area_affected_ha": 120.0,
            "detection_date": datetime.now().isoformat(),
            "region": "Bastat, Chhattisgarh",
            "protected_area": True,
            "carbon_estimate_tonnes": 2100,
            "observations": [
                "FRP (Fire Radiative Power): 185MW (Extreme intensity)",
                "VIIRS Confirmed: Thermal anomaly at 375m resolution",
                "Spread Direction: Northeast (Est. 4.2 km/h)",
                "CO Sensor Spike: Sentinel-5P carbon monoxide alert"
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
