"""
CANOPIX Detection Engine v2.0
Implements multi-sensor detection logic for Deforestation, Illegal Mining, and Forest Fires.
"""

import math
from datetime import datetime, timedelta

# --- DETECTION LOGIC v2.0 ---

def detect_deforestation(delta_ndvi, delta_evi, sar_vh_change_db, sar_vv_change_db, persistence_windows, area_ha, in_protected_area=False):
    """
    Implements 4.1 Deforestation Detection Algorithm
    """
    confidence = 0.0
    spectral_loss = False
    structural_loss = False

    # Stage 1: Spectral vegetation loss
    if delta_ndvi < -0.15 and delta_evi < -0.12:
        spectral_loss = True
        confidence += 0.30
    elif delta_ndvi < -0.10 and delta_evi < -0.08:
        spectral_loss = True
        confidence += 0.18

    # Stage 2: SAR structural confirmation
    if sar_vh_change_db < -3.0 and sar_vv_change_db < -2.0:
        structural_loss = True
        confidence += 0.30
    
    # Stage 3: Temporal persistence
    if persistence_windows >= 2:
        confidence += 0.20
    else:
        confidence *= 0.5  # Heavy penalty for single-date events

    # Stage 4: Spatial cluster filtering
    if area_ha < 1.0:
        return None  # Below minimum detectable unit
    if area_ha >= 5.0:
        confidence += 0.10
    if area_ha >= 50.0:
        confidence += 0.20

    # Stage 6: Minimum conditions gate
    if not (spectral_loss and structural_loss):
        return None

    # Stage 7: Protected area escalation
    if in_protected_area:
        confidence = min(confidence + 0.10, 1.0)

    # Classification
    severity = "MED"
    if confidence >= 0.75: severity = "CRITICAL"
    elif confidence >= 0.55: severity = "HIGH"
    elif confidence < 0.35: return None

    return {
        "type": "Deforestation",
        "confidence": round(confidence, 2),
        "severity": severity,
        "area_ha": area_ha
    }


def detect_mining(bsi, bsi_change, has_water_adjacent, has_dihedral_increase, dist_to_road, in_licensed_concession=False, area_ha=0):
    """
    Implements 4.2 Illegal Mining Detection Algorithm
    """
    confidence = 0.0
    bare_soil = False

    # Stage 1: Bare soil signature
    if bsi > 0.15 and bsi_change > 0.10:
        bare_soil = True
        confidence += 0.25
    
    if not bare_soil:
        return None

    # Stage 2: Water adjacency (mining ponds)
    if has_water_adjacent:
        confidence += 0.15

    # Stage 3: SAR features
    if has_dihedral_increase:
        confidence += 0.15

    # Stage 4: Road proximity
    if dist_to_road < 500:
        confidence += 0.15
    elif dist_to_road < 2000:
        confidence += 0.08
    else:
        confidence -= 0.10

    # Stage 5: Legal check
    if in_licensed_concession:
        return None  # Do not alert on legal mining
    else:
        confidence += 0.10

    # Classification
    severity = "MED"
    if confidence >= 0.70: severity = "CRITICAL"
    elif confidence >= 0.50: severity = "HIGH"
    elif confidence < 0.30: return None

    return {
        "type": "Illegal Mining",
        "confidence": round(confidence, 2),
        "severity": severity,
        "area_ha": area_ha
    }


def detect_fire(viirs_conf, frp, persistence_passes, spread_rate_ha_6h=0, in_protected_area=False):
    """
    Implements 4.3 Forest Fire Detection Algorithm
    """
    confidence = 0.0

    # Stage 1: VIIRS Base Confidence
    if viirs_conf == "high":
        confidence = 0.70
    elif viirs_conf == "nominal":
        confidence = 0.50
    elif viirs_conf == "low":
        confidence = 0.25

    # Stage 2: FRP Magnitude
    if frp >= 100: confidence += 0.20
    elif frp >= 50: confidence += 0.12
    elif frp >= 10: confidence += 0.05
    else: confidence -= 0.10

    # Stage 3: Temporal Persistence
    if persistence_passes >= 3:
        confidence += 0.15
    elif persistence_passes == 2:
        confidence += 0.08
    else:
        confidence *= 0.6

    # Stage 6: Severity and Immediate Alert
    severity = "MED"
    immediate = False
    
    if spread_rate_ha_6h > 500:
        severity = "CRITICAL"
        immediate = True
    elif spread_rate_ha_6h > 100:
        severity = "HIGH"
    
    # Escalation
    if in_protected_area:
        immediate = True
        if severity == "MED": severity = "HIGH"
        elif severity == "HIGH": severity = "CRITICAL"

    if confidence < 0.35:
        return None

    return {
        "type": "Active Fire",
        "confidence": round(confidence, 2),
        "severity": severity,
        "immediate": immediate
    }
