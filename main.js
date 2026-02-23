// ===== CANOPIX — Main Entry Point =====
// India Forest Intelligence Dashboard

import './style.css';
import { initMap, setMarkers, selectMarker, flyToRegion, toggleForestZones, toggleMarkers } from './src/map.js';
import { fetchFIRMSData } from './src/firms.js';
import {
    showToast, openModal, closeModal, handleRealert,
    renderAlertList, updateInfoCard, updateStats, setupToolbar
} from './src/ui.js';

let alerts = [];
let selectedId = null;

// ===== BOOT =====
async function boot() {
    // Initialize Leaflet map
    initMap('map', handleAlertSelect);

    // Wire up UI buttons
    document.getElementById('btnRealert').addEventListener('click', handleRealert);
    document.getElementById('btnRegister').addEventListener('click', openModal);
    document.getElementById('btnCancelModal').addEventListener('click', closeModal);
    document.getElementById('btnSubmitModal').addEventListener('click', () => {
        closeModal();
        showToast('✓ Organisation registered successfully');
    });

    // Close modal on overlay click
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });

    // Region sidebar navigation
    document.querySelectorAll('.region-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.region-item').forEach(r => r.classList.remove('active'));
            item.classList.add('active');
            const region = item.dataset.region;
            if (region) flyToRegion(region);
        });
    });

    // Layer toggles
    document.getElementById('layerForest').addEventListener('change', (e) => {
        toggleForestZones(e.target.checked);
    });
    document.getElementById('layerFire').addEventListener('change', (e) => {
        toggleMarkers(e.target.checked);
    });

    // Toolbar time chips
    setupToolbar(async (days) => {
        showToast(`Loading ${days === 1 ? '24h' : days + ' day'} data...`);
        await loadData(days);
    });

    // Detect button
    document.getElementById('btnDetect').addEventListener('click', async () => {
        showToast('Running deforestation detection...');
        await loadData(1);
        showToast('✓ Detection complete — alerts updated');
    });

    // Reset button
    document.getElementById('btnReset').addEventListener('click', () => {
        flyToRegion('all');
        document.querySelectorAll('.region-item').forEach(r => r.classList.remove('active'));
        document.querySelector('.region-item[data-region="all"]').classList.add('active');
    });

    // Load initial data
    await loadData(1);

    // After boot, mark MODIS sensor as active in UI as requested
    const sensors = document.querySelectorAll('.sensor-row');
    if (sensors.length >= 3) {
        sensors[2].querySelector('.sensor-dot').classList.add('active');
    }
}

// ===== LOAD DATA =====
async function loadData(dayRange = 1) {
    try {
        const result = await fetchFIRMSData(dayRange);
        alerts = result.alerts;

        if (result.source === 'live') {
            showToast(`✓ LIVE: ${alerts.length} hotspots loaded from NASA`);
        } else if (result.source === 'key_inactive') {
            showToast('NASA key not yet active — usually takes 10-20 mins');
        } else if (result.source === 'no_data') {
            showToast('No active hotspots detected in India right now');
        } else {
            showToast('Using demo data — check your NASA MAP_KEY');
        }

        // Update everything
        setMarkers(alerts);
        updateStats(alerts);

        if (alerts.length > 0) {
            selectedId = alerts[0].id;
            handleAlertSelect(selectedId);
        }
    } catch (error) {
        console.error('Failed to load data:', error);
        showToast('Error loading data — displaying demo alerts');
    }
}

// ===== SELECTION =====
function handleAlertSelect(id) {
    selectedId = id;
    const alert = alerts.find(a => a.id === id);
    if (!alert) return;

    // Update map
    selectMarker(id);

    // Update sidebar alert list
    renderAlertList(alerts, id, handleAlertSelect);

    // Update info card
    updateInfoCard(alert);

    // Scroll selected alert into view
    const selectedEl = document.querySelector(`.alert-mini[data-id="${id}"]`);
    if (selectedEl) selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== START =====
boot();
