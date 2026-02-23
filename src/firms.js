// ===== NASA FIRMS API CLIENT =====
// Free fire hotspot data from NASA's Fire Information for Resource Management System
// Uses VIIRS (Visible Infrared Imaging Radiometer Suite) satellite data

import { getRegionName, estimateImpact, getSeverity, fallbackAlerts } from './data.js';

const FIRMS_MAP_KEY = '58f079ea1f9ca2f594d3c1ee677e0f04'; // Live NASA FIRMS Key
// India bounding box: lat 6-36, lon 68-98
const INDIA_BBOX = '68,6,98,36';
const FIRMS_BASE = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';

/**
 * Fetch fire hotspot data from NASA FIRMS API
 * Returns structured alert objects ready for display
 */
export async function fetchFIRMSData(dayRange = 1) {
    try {
        // VIIRS S-NPP — most reliable free source
        const url = `${FIRMS_BASE}/${FIRMS_MAP_KEY}/VIIRS_SNPP_NRT/${INDIA_BBOX}/${dayRange}`;

        const response = await fetch(url);

        if (!response.ok) {
            console.warn('FIRMS API returned', response.status, '— using fallback data');
            const source = response.status === 401 ? 'key_inactive' : 'error';
            return { alerts: processFallback(), source };
        }

        const csvText = await response.text();
        const alerts = parseCSV(csvText);

        if (alerts.length === 0) {
            console.warn('No FIRMS data returned for current search — using fallback');
            return { alerts: processFallback(), source: 'no_data' };
        }

        return { alerts, source: 'live' };
    } catch (error) {
        console.warn('FIRMS fetch failed:', error.message, '— using fallback data');
        return { alerts: processFallback(), source: 'error' };
    }
}

/**
 * Parse NASA FIRMS CSV response into structured alert objects
 */
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',');
    const latIdx = headers.indexOf('latitude');
    const lonIdx = headers.indexOf('longitude');
    const brightIdx = headers.indexOf('bright_ti4');
    const confIdx = headers.indexOf('confidence');
    const dateIdx = headers.indexOf('acq_date');
    const timeIdx = headers.indexOf('acq_time');
    const frpIdx = headers.indexOf('frp');
    const satIdx = headers.indexOf('satellite');

    if (latIdx === -1 || lonIdx === -1) return [];

    const alerts = [];

    // Process up to 200 data rows, take top 50 by brightness
    const dataRows = lines.slice(1, 201);

    for (const line of dataRows) {
        const cols = line.split(',');
        if (cols.length < Math.max(latIdx, lonIdx, brightIdx, confIdx) + 1) continue;

        const lat = parseFloat(cols[latIdx]);
        const lon = parseFloat(cols[lonIdx]);
        const brightness = brightIdx >= 0 ? parseFloat(cols[brightIdx]) : 300;
        const rawConf = confIdx >= 0 ? cols[confIdx].trim() : '50';
        // Confidence can be 'nominal', 'high', 'low' or a number
        let confidence;
        if (rawConf === 'high' || rawConf === 'h') confidence = 85;
        else if (rawConf === 'nominal' || rawConf === 'n') confidence = 55;
        else if (rawConf === 'low' || rawConf === 'l') confidence = 25;
        else confidence = parseInt(rawConf) || 50;

        const acqDate = dateIdx >= 0 ? cols[dateIdx] : '';
        const acqTime = timeIdx >= 0 ? cols[timeIdx] : '';
        const frp = frpIdx >= 0 ? parseFloat(cols[frpIdx]) : 0;
        const satellite = satIdx >= 0 ? cols[satIdx].trim() : 'VIIRS';

        if (isNaN(lat) || isNaN(lon)) continue;
        // Only keep points clearly within India
        if (lat < 6 || lat > 36 || lon < 68 || lon > 98) continue;

        const region = getRegionName(lat, lon);
        const severity = getSeverity(confidence, brightness);
        const { area, co2 } = estimateImpact(brightness, confidence);

        alerts.push({
            lat, lon, brightness, confidence, severity,
            region, area, co2, frp, satellite,
            acqDate, acqTime,
            time: formatTime(acqDate, acqTime),
            title: region,
        });
    }

    // Sort by brightness descending and assign IDs
    alerts.sort((a, b) => b.brightness - a.brightness);
    return alerts.slice(0, 50).map((a, i) => ({ ...a, id: i }));
}

/**
 * Format acquisition date/time to relative time
 */
function formatTime(date, time) {
    if (!date) return 'Recent';
    try {
        const t = time ? time.padStart(4, '0') : '0000';
        const dt = new Date(`${date}T${t.slice(0, 2)}:${t.slice(2, 4)}:00Z`);
        const diff = Date.now() - dt.getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    } catch {
        return 'Recent';
    }
}

/**
 * Process fallback data (when API is inaccessible)
 */
function processFallback() {
    return fallbackAlerts.map(a => ({
        ...a,
        frp: 0,
        satellite: 'VIIRS',
        acqDate: '',
        acqTime: '',
    }));
}
