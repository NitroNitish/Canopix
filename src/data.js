// ===== FOREST REGION DATA (GeoJSON-like) =====

export const INDIA_CENTER = [22.5, 79.0];
export const INDIA_ZOOM = 5;

// Forest zone polygon coordinates [lat, lng]
export const forestZones = [
    {
        id: 'western-ghats',
        name: 'Western Ghats',
        color: '#4E8A50',
        coords: [
            [21.2, 73.0], [19.8, 73.2], [17.5, 73.5], [15.5, 73.8],
            [14.0, 74.5], [12.5, 75.0], [10.8, 76.0], [9.0, 76.8],
            [8.2, 77.2], [8.5, 77.8], [10.0, 77.0], [12.0, 76.0],
            [14.0, 75.5], [16.0, 74.5], [18.0, 73.8], [20.0, 73.5],
            [21.2, 73.0]
        ]
    },
    {
        id: 'northeast',
        name: 'Northeast India',
        color: '#4E8A50',
        coords: [
            [27.5, 88.5], [27.8, 90.0], [28.2, 92.0], [27.8, 94.5],
            [27.0, 96.0], [25.5, 95.5], [24.5, 94.0], [24.0, 92.5],
            [25.0, 90.0], [26.0, 89.5], [27.5, 88.5]
        ]
    },
    {
        id: 'sundarbans',
        name: 'Sundarbans',
        color: '#4E8A50',
        coords: [
            [22.5, 88.5], [22.5, 89.5], [21.5, 89.5],
            [21.5, 88.8], [22.0, 88.3], [22.5, 88.5]
        ]
    },
    {
        id: 'central',
        name: 'Central India',
        color: '#4E8A50',
        coords: [
            [24.5, 79.0], [24.5, 82.0], [23.0, 83.5],
            [21.0, 82.5], [19.5, 81.0], [19.5, 79.5],
            [21.0, 78.5], [23.0, 78.5], [24.5, 79.0]
        ]
    },
    {
        id: 'andaman',
        name: 'Andaman Islands',
        color: '#4E8A50',
        coords: [
            [13.5, 92.5], [13.5, 93.0], [12.5, 93.2],
            [11.5, 92.8], [11.0, 92.5], [11.5, 92.2],
            [12.5, 92.3], [13.5, 92.5]
        ]
    }
];

// Fallback hardcoded alerts (used when NASA FIRMS API is inaccessible)
export const fallbackAlerts = [
    { id: 0, title: 'Western Ghats South', region: 'Kerala – Tamil Nadu Border', lat: 9.52, lon: 77.14, brightness: 340, confidence: 94, time: '1h ago', area: 620, co2: 9800, severity: 'HIGH' },
    { id: 1, title: 'Assam Corridor', region: 'Assam, Northeast India', lat: 26.14, lon: 91.74, brightness: 330, confidence: 90, time: '3h ago', area: 480, co2: 7200, severity: 'HIGH' },
    { id: 2, title: 'Sundarbans Edge', region: 'West Bengal', lat: 21.94, lon: 89.18, brightness: 315, confidence: 73, time: '6h ago', area: 310, co2: 4600, severity: 'HIGH' },
    { id: 3, title: 'Bastar Forest', region: 'Chhattisgarh', lat: 19.12, lon: 81.95, brightness: 308, confidence: 67, time: '9h ago', area: 275, co2: 3900, severity: 'MEDIUM' },
    { id: 4, title: 'Andaman North', region: 'Andaman Islands', lat: 12.92, lon: 92.84, brightness: 295, confidence: 52, time: '13h ago', area: 180, co2: 2400, severity: 'MEDIUM' },
    { id: 5, title: 'Arunachal Edge', region: 'Arunachal Pradesh', lat: 27.08, lon: 93.62, brightness: 285, confidence: 44, time: '18h ago', area: 140, co2: 1800, severity: 'LOW' },
];

// Indian NGOs
export const ngos = [
    { name: 'Wildlife Institute of India', city: 'Dehradun', zone: 'Pan-India', channels: ['EMAIL', 'WHATSAPP'] },
    { name: 'Aaranyak', city: 'Guwahati, Assam', zone: 'Northeast India', channels: ['EMAIL', 'WHATSAPP'] },
    { name: 'Bombay Natural History Society', city: 'Mumbai', zone: 'Pan-India', channels: ['EMAIL'] },
    { name: 'Salim Ali Centre', city: 'Coimbatore', zone: 'Southern India', channels: ['EMAIL', 'WHATSAPP'] },
    { name: 'Sundarbans Biosphere Trust', city: 'Kolkata', zone: 'Sundarbans', channels: ['EMAIL'] },
];

// Reverse-geocode approximate region names from coordinates
export function getRegionName(lat, lon) {
    if (lat >= 26 && lon >= 88 && lon <= 96) return 'Northeast India';
    if (lat >= 8 && lat <= 12 && lon >= 75 && lon <= 78) return 'Western Ghats, Kerala';
    if (lat >= 12 && lat <= 16 && lon >= 73 && lon <= 76) return 'Western Ghats, Karnataka';
    if (lat >= 16 && lat <= 22 && lon >= 72 && lon <= 75) return 'Western Ghats, Maharashtra';
    if (lat >= 21 && lat <= 23 && lon >= 88 && lon <= 90) return 'Sundarbans, West Bengal';
    if (lat >= 18 && lat <= 24 && lon >= 78 && lon <= 84) return 'Central India';
    if (lat >= 10 && lat <= 14 && lon >= 92 && lon <= 94) return 'Andaman Islands';
    if (lat >= 8 && lat <= 14 && lon >= 76 && lon <= 80) return 'Tamil Nadu';
    if (lat >= 14 && lat <= 18 && lon >= 77 && lon <= 81) return 'Telangana / AP';
    if (lat >= 20 && lat <= 26 && lon >= 84 && lon <= 88) return 'Odisha / Jharkhand';
    return 'India';
}

// Estimate area and CO2 from brightness
export function estimateImpact(brightness, confidence) {
    const area = Math.round((brightness - 250) * 3.5 + (confidence * 1.5));
    const co2 = Math.round(area * 14.5);
    return { area: Math.max(10, area), co2: Math.max(100, co2) };
}

// Classify severity
export function getSeverity(confidence, brightness) {
    if (confidence >= 80 || brightness >= 330) return 'HIGH';
    if (confidence >= 50 || brightness >= 300) return 'MEDIUM';
    return 'LOW';
}
