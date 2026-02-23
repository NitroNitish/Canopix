/**
 * CANOPIX API Client v2.0
 * Connects to the FastAPI backend for multi-sensor fused alerts
 */

const API_BASE = 'http://localhost:8000';

export async function fetchV2Alerts() {
    try {
        const response = await fetch(`${API_BASE}/alerts`);
        if (!response.ok) throw new Error('Backend API error');

        const data = await response.json();

        // Map GeoJSON features to internal alert format
        return {
            source: 'v2_engine',
            alerts: data.alerts.map(feature => ({
                id: feature.properties.alert_id,
                title: feature.properties.alert_type,
                type: feature.properties.alert_type,
                severity: feature.properties.severity,
                confidence: feature.properties.confidence_score * 100,
                region: feature.properties.region,
                lat: feature.properties.centroid.lat,
                lon: feature.properties.centroid.lon,
                area: feature.properties.area_affected_ha,
                co2: feature.properties.carbon_estimate_tonnes,
                time: formatDetectionTime(feature.properties.detection_date),
                in_protected_area: feature.properties.protected_area,
                observations: feature.properties.observations || []
            }))
        };
    } catch (error) {
        console.error('Failed to fetch v2 alerts:', error);
        return { source: 'error', alerts: [] };
    }
}

export async function fetchV2Summary() {
    try {
        const response = await fetch(`${API_BASE}/summary`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}

function formatDetectionTime(isoString) {
    const dt = new Date(isoString);
    const diff = Date.now() - dt.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}
