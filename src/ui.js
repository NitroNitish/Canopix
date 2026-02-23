// ===== UI MODULE =====
// Handles toast notifications, modal, button states

/**
 * Show a toast notification
 */
export function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

/**
 * Open the registration modal
 */
export function openModal() {
    document.getElementById('modal').classList.add('open');
}

/**
 * Close the registration modal
 */
export function closeModal() {
    document.getElementById('modal').classList.remove('open');
}

/**
 * Handle RE-ALERT button click
 */
export function handleRealert() {
    const btn = document.getElementById('btnRealert');
    if (btn.disabled) return;

    btn.textContent = 'SENDING ···';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = '✓ DISPATCHED';
        btn.classList.add('dispatched');
        showToast('✓ 5 Indian NGOs re-alerted successfully');

        setTimeout(() => {
            btn.textContent = 'RE-ALERT ALL';
            btn.classList.remove('dispatched');
            btn.disabled = false;
        }, 4000);
    }, 1800);
}

/**
 * Render the alert list in the right sidebar
 */
export function renderAlertList(alerts, selectedId, onSelect) {
    const list = document.getElementById('alertList');
    list.innerHTML = '';

    if (alerts.length === 0) {
        list.innerHTML = '<div class="alert-loading">No alerts detected</div>';
        return;
    }

    // Show top 20 alerts
    alerts.slice(0, 20).forEach(alert => {
        const el = document.createElement('div');
        const isSelected = alert.id === selectedId;
        const typeClass = alert.type === 'Illegal Mining' ? 'tag-mining' :
            alert.type === 'Deforestation' ? 'tag-deforestation' : 'tag-high';

        el.className = `alert-mini ${isSelected ? 'selected' : ''}`;
        el.dataset.id = alert.id;
        el.innerHTML = `
            <div class="alert-mini-icon ${alert.severity === 'CRITICAL' ? 'critical' : ''}">
                <div class="pulse-ring"></div>
            </div>
            <div class="alert-mini-info">
                <div class="alert-mini-title">${alert.title}</div>
                <div class="alert-mini-meta">
                    <span class="severity-tag ${typeClass}">${alert.type}</span>
                    <span>${alert.time}</span>
                </div>
            </div>
        `;

        el.addEventListener('click', () => onSelect(alert.id));
        list.appendChild(el);
    });
}

/**
 * Render a high-res forest snapshot for analysis with rich media labels
 */
export function renderSnapshot(alert) {
    const container = document.getElementById('snapshotView');
    const labelMapping = {
        'Active Fire': 'VIIRS THERMAL MAPPING',
        'Illegal Mining': 'SENTINEL-1 SAR AMPLITUDE',
        'Deforestation': 'SENTINEL-2 NDVI ANALYTICS'
    };

    if (!alert || !container) return;

    // Use a high-quality forest satellite placeholder
    const forestImages = [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542272202-41457df7866e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop'
    ];

    const idx = (typeof alert.id === 'string' ? alert.id.length : alert.id) % forestImages.length;
    const imgUrl = forestImages[idx];
    const label = labelMapping[alert.type] || 'SATELLITE AUDIT';

    container.innerHTML = `
        <div class="snapshot-media">
            <div class="media-label">${label}</div>
            <img src="${imgUrl}" alt="Forest Snapshot">
        </div>
        <div style="font-size:13px; color:var(--muted); line-height:1.4;">
            Showing high-resolution multispectral composite for <strong>${alert.region}</strong>. 
            Automated auditing confirms structural anomalies consistent with <strong>${alert.type.toLowerCase()}</strong>.
        </div>
    `;
}

/**
 * Update the detail overlay card on the map
 */
export function updateInfoCard(alert) {
    const card = document.getElementById('infoCard');
    const title = document.getElementById('infoTitle');
    const body = document.getElementById('infoBody');

    if (!alert) {
        card.style.display = 'none';
        return;
    }

    card.style.display = 'block';
    title.textContent = alert.title;

    const typeClass = alert.type === 'Illegal Mining' ? 'tag-mining' :
        alert.type === 'Deforestation' ? 'tag-deforestation' : 'tag-high';

    body.innerHTML = `
    <div style="font-weight:700; color:var(--white); margin-bottom:4px;">${alert.type} DETECTED</div>
    <div>${alert.region}</div>
    <div>${alert.lat.toFixed(2)}°N ${alert.lon.toFixed(2)}°E · ${alert.time}</div>
    <div style="margin-top:8px; display:flex; gap:10px;">
      <span class="val">${alert.area.toFixed(1)} ha</span>
      <span class="val">${alert.co2.toLocaleString()}t CO₂</span>
      <span class="severity-tag ${typeClass}">${alert.confidence.toFixed(0)}% CONF</span>
    </div>
  `;

    // Update Analysis Panel
    document.getElementById('analysisHeadline').textContent = `${alert.type} Analysis: ${alert.region}`;

    let obsHtml = '';
    if (alert.observations && alert.observations.length > 0) {
        obsHtml = `
            <div class="diagnosis-header">Detection Diagnostics (Fused Intelligence)</div>
            <div class="observation-list">
                ${alert.observations.map(obs => `
                    <div class="observation-item active">
                        <div class="observation-bullet"></div>
                        <div>${obs}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('analysisDetail').innerHTML = `
        <div style="margin-bottom:15px;">
            Fused intelligence from <strong>Sentinel-1 SAR</strong> and <strong>Sentinel-2 Optical</strong> 
            confirms a <strong>${alert.severity}</strong> severity threat. 
            Structural canopy loss detected at ${alert.lat.toFixed(4)}, ${alert.lon.toFixed(4)} with ${alert.confidence.toFixed(0)}% overall confidence.
        </div>
        ${obsHtml}
    `;

    // Also update the snapshot viewer
    renderSnapshot(alert);
}

/**
 * Update stats in the right sidebar and bottom panel
 */
export function updateStats(alerts) {
    const totalAlerts = alerts.length;
    const highAlerts = alerts.filter(a => a.severity === 'HIGH').length;
    const medAlerts = alerts.filter(a => a.severity === 'MEDIUM').length;
    const lowAlerts = alerts.filter(a => a.severity === 'LOW').length;
    const totalArea = alerts.reduce((s, a) => s + (a.area || 0), 0);
    const totalCo2 = alerts.reduce((s, a) => s + (a.co2 || 0), 0);
    const avgConf = alerts.length > 0
        ? Math.round(alerts.reduce((s, a) => s + a.confidence, 0) / alerts.length)
        : 0;

    // Right sidebar status
    document.getElementById('statAlerts').textContent = totalAlerts;
    document.getElementById('statHotspots').textContent = highAlerts;

    // Bottom stats
    document.getElementById('statAreaCleared').textContent = totalArea > 1000
        ? `${(totalArea / 1000).toFixed(1)}k ha`
        : `${totalArea} ha`;
    document.getElementById('statCo2').textContent = totalCo2 > 10000
        ? `${(totalCo2 / 1000).toFixed(1)}k t`
        : `${totalCo2.toLocaleString()} t`;
    document.getElementById('statConfidence').textContent = `${avgConf}%`;

    // Severity summary
    const sevSummary = document.getElementById('severitySummary');
    sevSummary.innerHTML = `
    <span class="tag tag-high">FIRE ${highAlerts}</span>
    <span class="tag tag-deforestation">DEFORESTATION ${alerts.filter(a => a.type === 'Deforestation').length}</span>
    <span class="tag tag-mining">MINING ${alerts.filter(a => a.type === 'Illegal Mining').length}</span>
  `;

    // Only update analysis if NO alert is selected
    if (!window.selectedId) {
        document.getElementById('analysisHeadline').textContent =
            `${totalAlerts} multi-sensor threats detected across India`;
        document.getElementById('analysisDetail').innerHTML =
            `Currently monitoring ${totalArea.toLocaleString()} hectares. ${highAlerts} critical fire hotspots and 
             ${alerts.filter(a => a.type !== 'Active Fire').length} structural anomalies detected via Sentinel-1/2 fusion.`;
    }
}

/**
 * Setup time-range chip buttons
 */
export function setupToolbar(onTimeChange) {
    const chips = document.querySelectorAll('.toolbar-left .tool-chip');
    const timeChips = Array.from(chips).slice(0, 3); // First 3 are time chips

    timeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            timeChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const text = chip.textContent.trim();
            let days = 1;
            if (text.includes('7')) days = 7;
            else if (text.includes('30')) days = 10; // FIRMS max is 10

            if (onTimeChange) onTimeChange(days);
        });
    });
}
