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
        el.className = 'alert-mini' + (alert.id === selectedId ? ' selected' : '');
        el.dataset.id = alert.id;

        const sevColor = alert.severity === 'HIGH' ? '#cc4444' : alert.severity === 'MEDIUM' ? '#c87a3a' : '#C0B87A';

        el.innerHTML = `
      <div class="alert-mini-title">${alert.title}</div>
      <div class="alert-mini-meta">${alert.lat.toFixed(2)}°N ${alert.lon.toFixed(2)}°E · ${alert.time} · ${alert.severity}</div>
      <div class="alert-mini-bar"><div class="alert-mini-fill" style="width:${alert.confidence}%;background:${sevColor}"></div></div>
    `;

        el.addEventListener('click', () => onSelect(alert.id));
        list.appendChild(el);
    });
}

/**
 * Render a high-res forest snapshot for analysis
 */
export function renderSnapshot(alert) {
    const img = document.getElementById('snapshotImg');
    if (!alert || !img) return;

    // Use a high-quality forest satellite placeholder
    // In a real app, this would call a high-res imagery API like Planet or Sentinel
    const forestImages = [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=320&h=180&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542272202-41457df7866e?q=80&w=320&h=180&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=320&h=180&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=320&h=180&auto=format&fit=crop'
    ];

    // Pick a "random" image based on ID so it stays consistent for the same alert
    const idx = alert.id % forestImages.length;
    img.src = forestImages[idx];
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

    const sevClass = alert.severity === 'HIGH' ? 'sev-high' : alert.severity === 'MEDIUM' ? 'sev-med' : '';

    body.innerHTML = `
    <div>${alert.region}</div>
    <div>${alert.lat.toFixed(2)}°N ${alert.lon.toFixed(2)}°E · ${alert.time}</div>
    <div style="margin-top:4px;">
      <span class="val">${alert.area} ha</span> · 
      <span class="val">${alert.co2.toLocaleString()}t CO₂</span> · 
      <span class="${sevClass}" style="font-weight:600">${alert.severity}</span>
    </div>
    ${alert.brightness ? `<div style="margin-top:2px;">Brightness: <span class="val">${alert.brightness.toFixed(1)}K</span> · Confidence: <span class="val">${alert.confidence}%</span></div>` : ''}
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
    <span class="tag tag-high">HIGH ${highAlerts}</span>
    <span class="tag tag-med">MED ${medAlerts}</span>
    <span class="tag tag-low">LOW ${lowAlerts}</span>
  `;

    // Analysis headline
    document.getElementById('analysisHeadline').textContent =
        `${totalAlerts} fire hotspots detected across India`;
    document.getElementById('analysisDetail').textContent =
        `${highAlerts} high-severity alerts requiring immediate attention. Est. ${totalArea.toLocaleString()} hectares affected with ~${totalCo2.toLocaleString()} tonnes CO₂ released. Data sourced from NASA VIIRS satellite instruments.`;
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
