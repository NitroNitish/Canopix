// ===== LEAFLET MAP MODULE =====
// Initializes satellite map, forest zone overlays, and deforestation markers

import L from 'leaflet';
import { INDIA_CENTER, INDIA_ZOOM, forestZones } from './data.js';

let map;
let markerLayer;
let zoneLayer;
let markers = [];
let selectedMarkerId = null;
let onSelectCallback = null;

/**
 * Initialize the Leaflet map with Esri satellite tiles
 */
export function initMap(containerId, onSelect) {
    onSelectCallback = onSelect;

    map = L.map(containerId, {
        center: INDIA_CENTER,
        zoom: INDIA_ZOOM,
        minZoom: 4,
        maxZoom: 16,
        zoomControl: true,
        attributionControl: false,
    });

    // Esri World Imagery — free satellite tiles (no API key required)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
    }).addTo(map);

    // Forest zone overlays
    zoneLayer = L.layerGroup().addTo(map);
    renderForestZones();

    // Marker layer
    markerLayer = L.layerGroup().addTo(map);

    return map;
}

/**
 * Render forest zone polygons on the map
 */
function renderForestZones() {
    forestZones.forEach(zone => {
        const polygon = L.polygon(zone.coords, {
            color: '#5E8A5F',
            weight: 1,
            fillColor: zone.color,
            fillOpacity: 0.25,
            dashArray: '4,4',
        });

        polygon.bindTooltip(zone.name, {
            className: 'zone-tooltip',
            direction: 'center',
            permanent: false,
        });

        polygon.addTo(zoneLayer);
    });
}

/**
 * Create a targeting-reticle SVG marker icon
 */
function createReticleIcon(isSelected = false, severity = 'HIGH') {
    const color = isSelected ? '#C0B87A' : (severity === 'HIGH' ? '#cc4444' : severity === 'MEDIUM' ? '#c87a3a' : '#C0B87A');
    const size = isSelected ? 42 : 30;
    const r = isSelected ? 14 : 10;
    const gap = isSelected ? 16 : 12;
    const lineLen = isSelected ? 10 : 7;
    const center = size / 2;
    const dotR = isSelected ? 4 : 3;

    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.9"/>
      <circle cx="${center}" cy="${center}" r="${r + 8}" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.3">
        <animate attributeName="r" values="${r + 4};${r + 16}" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.35;0" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <line x1="${center}" y1="${center - gap}" x2="${center}" y2="${center - gap + lineLen}" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
      <line x1="${center}" y1="${center + gap - lineLen}" x2="${center}" y2="${center + gap}" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
      <line x1="${center - gap}" y1="${center}" x2="${center - gap + lineLen}" y2="${center}" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
      <line x1="${center + gap - lineLen}" y1="${center}" x2="${center + gap}" y2="${center}" stroke="${color}" stroke-width="0.8" opacity="0.6"/>
      <circle cx="${center}" cy="${center}" r="${dotR}" fill="${color}"/>
    </svg>
  `;

    return L.divIcon({
        html: svg,
        className: 'reticle-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

/**
 * Add alert markers to the map
 */
export function setMarkers(alerts) {
    markerLayer.clearLayers();
    markers = [];

    alerts.forEach((alert) => {
        const isSelected = alert.id === selectedMarkerId;
        const icon = createReticleIcon(isSelected, alert.severity);

        const marker = L.marker([alert.lat, alert.lon], { icon })
            .addTo(markerLayer);

        // Custom popup
        marker.bindPopup(`
      <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;color:#F2E3BB;background:#1a3a1a;padding:8px 12px;border-radius:6px;border:1px solid #2d5a2d;min-width:180px;">
        <div style="font-family:'Playfair Display',serif;font-size:14px;margin-bottom:4px;">${alert.title}</div>
        <div style="color:#7a9d7a;font-size:9px;">${alert.region}</div>
        <div style="color:#7a9d7a;font-size:9px;margin-top:2px;">${alert.lat.toFixed(2)}°N ${alert.lon.toFixed(2)}°E</div>
        <div style="margin-top:6px;display:flex;gap:8px;">
          <span style="color:#C0B87A;">${alert.area} ha</span>
          <span style="color:#C0B87A;">${alert.co2.toLocaleString()}t CO₂</span>
          <span style="color:${alert.severity === 'HIGH' ? '#cc4444' : alert.severity === 'MEDIUM' ? '#c87a3a' : '#C0B87A'};font-weight:600;">${alert.severity}</span>
        </div>
      </div>
    `, {
            className: 'custom-popup',
            closeButton: false,
            offset: [0, -10],
        });

        marker.on('click', () => {
            selectMarker(alert.id);
            if (onSelectCallback) onSelectCallback(alert.id);
        });

        markers.push({ marker, alert });
    });
}

/**
 * Update marker selection visuals
 */
export function selectMarker(id) {
    selectedMarkerId = id;

    markers.forEach(({ marker, alert }) => {
        const isSelected = alert.id === id;
        const icon = createReticleIcon(isSelected, alert.severity);
        marker.setIcon(icon);

        if (isSelected) {
            map.panTo([alert.lat, alert.lon], { animate: true, duration: 0.5 });
        }
    });
}

/**
 * Toggle layer visibility
 */
export function toggleForestZones(visible) {
    if (visible) map.addLayer(zoneLayer);
    else map.removeLayer(zoneLayer);
}

export function toggleMarkers(visible) {
    if (visible) map.addLayer(markerLayer);
    else map.removeLayer(markerLayer);
}

/**
 * Fly to a specific region
 */
export function flyToRegion(regionId) {
    const regionCoords = {
        'all': { center: INDIA_CENTER, zoom: INDIA_ZOOM },
        'western-ghats': { center: [13.0, 75.5], zoom: 7 },
        'northeast': { center: [26.0, 92.0], zoom: 7 },
        'assam': { center: [26.2, 91.7], zoom: 8 },
        'meghalaya': { center: [25.5, 91.4], zoom: 8 },
        'arunachal': { center: [27.5, 93.5], zoom: 7 },
        'sundarbans': { center: [22.0, 89.0], zoom: 9 },
        'central': { center: [22.0, 80.5], zoom: 7 },
        'mp': { center: [23.5, 78.5], zoom: 7 },
        'cg': { center: [21.5, 82.0], zoom: 7 },
        'andaman': { center: [12.0, 92.7], zoom: 8 },
    };

    const target = regionCoords[regionId] || regionCoords['all'];
    map.flyTo(target.center, target.zoom, { duration: 1.2 });
}

export function getMap() { return map; }
