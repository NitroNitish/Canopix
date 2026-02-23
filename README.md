# 🌿 CANOPIX — India Forest Intelligence System

<div align="center">

![Canopix Banner](https://img.shields.io/badge/CANOPIX-India%20Forest%20Intelligence-005F02?style=for-the-badge&labelColor=427A43&color=005F02)

**Detecting deforestation. Alerting guardians. Protecting India's forests — one pixel at a time.**

[![Built for](https://img.shields.io/badge/Built%20For-Hack%20for%20Humanity%202026-C0B87A?style=flat-square)](https://hack-for-humanity-26.devpost.com/)
[![License](https://img.shields.io/badge/License-MIT-427A43?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active%20Development-8B1A1A?style=flat-square)]()
[![Cost](https://img.shields.io/badge/Infrastructure%20Cost-$0-005F02?style=flat-square)]()
[![India](https://img.shields.io/badge/Made%20in-India%20🇮🇳-FF9933?style=flat-square)]()

[Live Demo](#) · [Report Bug](https://github.com/yourusername/canopix/issues) · [Request Feature](https://github.com/yourusername/canopix/issues) · [Devpost](https://hack-for-humanity-26.devpost.com/)

</div>

---

## 📖 What is Canopix?

Canopix is an open-source forest intelligence platform built for India. It uses **free satellite data** from ISRO-compatible sensors and ESA's Sentinel constellation to detect illegal deforestation, mining activity, and active forest fires — then automatically alerts registered conservation NGOs within minutes.

India holds **7% of the world's biodiversity** in just 2.4% of global land area. The Western Ghats, Northeast India, Sundarbans, and Central Indian forests are disappearing faster than any human monitoring system can track. Canopix watches from space, 24 hours a day, so the people who protect these forests don't have to.

> *"Protecting India's 7% of global biodiversity — one pixel at a time."*

---

## 🚨 The Problem

- Illegal deforestation destroys an estimated **10 million hectares** of forest globally every year
- Manual monitoring means rangers and NGOs discover clearing **weeks after it happens** — too late to intervene
- Satellite data exists but is **siloed across platforms** with no unified alert system
- Existing dashboards **show data but don't act on it** — no automated NGO notification

**Canopix closes all three gaps.** It watches continuously, detects automatically, and alerts instantly.

---

## ✨ Features

### 🛰️ Multi-Sensor Detection Engine
- **Deforestation Detection** — fuses Sentinel-2 optical (NDVI/EVI/SAVI) + Sentinel-1 SAR backscatter change for cloud-penetrating detection
- **Illegal Mining Detection** — bare soil index (BSI), geometric pattern analysis, SAR texture, and road proximity scoring
- **Active Fire Detection** — VIIRS thermal hotspots (NOAA-20 + Suomi NPP) with FRP thresholds and multi-pass confirmation

### 🗺️ Live Threat Map
- Interactive satellite map focused on Indian forest regions
- Color-coded targeting reticle markers — red for deforestation, khaki for selected
- Animated satellite scanning line and real-time coordinate display
- Forest zone highlights: Western Ghats, Northeast India, Sundarbans, Central India

### 📊 Confidence Scoring
- Every alert has a confidence score from 0.0–1.0 built from multi-sensor evidence
- No single sensor alone exceeds 0.65 — multi-sensor agreement required for high confidence
- Temporal persistence requirement prevents single-date cloud artefact false positives

### 📧 Automated NGO Alert Dispatch
- Email alerts via **SendGrid** with full HTML templates
- WhatsApp alerts via **Twilio** for registered phone numbers
- PostGIS geographic region matching — alerts only sent to NGOs whose region intersects the event
- Duplicate suppression within 72-hour window
- Dispatch logs with timestamp, channel, and delivery status

### 🌿 Indian Forest Intelligence
- Covers: Western Ghats, Assam Corridor, Sundarbans, Bastar Forest, Andaman Islands, Arunachal Pradesh
- References real Indian conservation NGOs: WII, Aaranyak, BNHS, Salim Ali Centre, Sundarbans Biosphere Trust
- Satellite watermark: **ISRO SAT · RESOURCESAT-2 · LIVE**
- Protected area integration: India's tiger reserves, national parks, wildlife sanctuaries

---

## 🖥️ Screenshots

> *Add your screenshots here after first build*

<img width="1365" height="687" alt="Screenshot 2026-02-23 192523" src="https://github.com/user-attachments/assets/b7f1bbc1-4bd0-4fad-8212-c7231cc6cdcb" />
```

```

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tooling |
| Leaflet.js + React-Leaflet | Interactive satellite map |
| IBM Plex Mono + Playfair Display | Typography |
| TailwindCSS | Utility styling |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.11+ | Primary backend language |
| FastAPI | REST API framework |
| APScheduler | Daily satellite scan scheduling |
| Shapely + PostGIS | Geographic region intersection |
| Pillow | Satellite thumbnail processing |
| SQLAlchemy + Alembic | ORM and database migrations |

### Database & Infrastructure
| Service | Purpose | Cost |
|---|---|---|
| Supabase (PostgreSQL + PostGIS) | Database with geographic queries | Free |
| Vercel | Frontend hosting | Free |
| Render.com | Backend API hosting | Free |
| Cloudflare R2 | GeoTIFF and output storage | Free (10 GB) |
| Upstash Redis | Job queue for async processing | Free |

---

## 🛰️ Satellite Data APIs (All Free)

| API | Data | Registration |
|---|---|---|
| **NASA FIRMS** | VIIRS active fire, near real-time | [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov/api/area/) |
| **Global Forest Watch** | GLAD deforestation alerts, weekly | [globalforestwatch.org](https://www.globalforestwatch.org/) |
| **Sentinel Hub** | Sentinel-2 optical + Sentinel-1 SAR imagery | [sentinel-hub.com](https://www.sentinel-hub.com/) |
| **USGS Earth Explorer** | Landsat historical baseline | [earthexplorer.usgs.gov](https://earthexplorer.usgs.gov/) |
| **Open-Meteo** | Weather + Fire Weather Index | No key required |
| **Copernicus Open Hub** | Direct Sentinel scene download | [scihub.copernicus.eu](https://scihub.copernicus.eu/) |

### Alert Dispatch APIs

| API | Purpose | Free Tier |
|---|---|---|
| **SendGrid** | Email alerts to NGOs | 100 emails/day |
| **Twilio** | WhatsApp alerts | Free trial credit |

**Total infrastructure cost: $0**

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+ with PostGIS extension (or Supabase account)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/canopix.git
cd canopix
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/canopix

# Satellite Data APIs
NASA_FIRMS_API_KEY=your_firms_api_key
SENTINEL_HUB_CLIENT_ID=your_sentinel_hub_client_id
SENTINEL_HUB_SECRET=your_sentinel_hub_secret

# Alert Dispatch
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=alerts@canopix.in
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Auth
JWT_SECRET_KEY=generate_with_openssl_rand_hex_32

# Optional
REDIS_URL=your_upstash_redis_url
```

> **Get your free API keys:**
> - NASA FIRMS → [firms.modaps.eosdis.nasa.gov/api/area/](https://firms.modaps.eosdis.nasa.gov/api/area/)
> - Sentinel Hub → [sentinel-hub.com](https://www.sentinel-hub.com/) (free 30-day trial, then free tier)
> - SendGrid → [sendgrid.com](https://sendgrid.com/) (100 emails/day free forever)
> - Twilio → [twilio.com](https://www.twilio.com/) (free trial credit)

### 4. Database Setup

```bash
# Run migrations
alembic upgrade head

# Seed demo data (optional)
python scripts/seed_demo_data.py
```

### 5. Run the Backend

```bash
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 6. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env.local` in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### 7. Run the Frontend

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📡 Detection Pipeline

The detection engine runs automatically every 24 hours. To trigger manually:

```bash
# Run a full detection scan for a specific region
python pipeline/run_scan.py --bbox "68.0,8.0,97.0,37.0" --date "2026-02-23"

# Run only deforestation detection
python pipeline/run_scan.py --type deforestation --region "western_ghats"

# Run only fire detection (uses VIIRS, near real-time)
python pipeline/run_scan.py --type fire --hours 24
```

### Detection Thresholds

| Parameter | Default | Description |
|---|---|---|
| `DELTA_NDVI_HIGH` | -0.15 | High confidence vegetation loss threshold |
| `DELTA_NDVI_MED` | -0.10 | Medium confidence vegetation loss threshold |
| `SAR_VH_THRESHOLD` | -3.0 dB | SAR canopy loss threshold |
| `MIN_CLUSTER_AREA` | 1.0 ha | Minimum detectable clearing size |
| `FIRE_FRP_IMMEDIATE` | 100 MW | FRP threshold for immediate alert |
| `CONFIDENCE_HIGH` | 0.75 | High confidence score threshold |
| `CONFIDENCE_MED` | 0.55 | Medium confidence score threshold |

Thresholds are configurable in `backend/config/thresholds.yaml`.

---

## 🗂️ Project Structure

```
canopix/
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/            # Leaflet map and markers
│   │   │   ├── AlertFeed/      # Left sidebar alert list
│   │   │   ├── NGOPanel/       # NGO dispatch panel
│   │   │   └── Modals/         # Register NGO modal
│   │   ├── hooks/              # Custom React hooks
│   │   ├── api/                # API client functions
│   │   └── App.jsx
│   └── package.json
│
├── backend/                    # FastAPI Python backend
│   ├── main.py                 # FastAPI app entry point
│   ├── routers/
│   │   ├── alerts.py           # Alert CRUD endpoints
│   │   ├── ngos.py             # NGO management endpoints
│   │   └── summary.py          # Summary metrics endpoint
│   ├── models/                 # SQLAlchemy database models
│   ├── schemas/                # Pydantic request/response schemas
│   ├── services/
│   │   ├── dispatch.py         # SendGrid + Twilio alert dispatch
│   │   └── geo.py              # PostGIS region matching
│   └── config/
│       └── thresholds.yaml     # Detection threshold config
│
├── pipeline/                   # Detection engine
│   ├── run_scan.py             # Main scan entry point
│   ├── ingest/
│   │   ├── firms.py            # NASA FIRMS API client
│   │   ├── gfw.py              # Global Forest Watch client
│   │   └── sentinel_hub.py     # Sentinel Hub imagery client
│   ├── preprocess/
│   │   ├── cloud_mask.py       # Cloud and shadow masking
│   │   ├── composite.py        # Temporal compositing
│   │   └── normalize.py        # Band normalization
│   ├── features/
│   │   ├── indices.py          # NDVI, EVI, BSI, NBR computation
│   │   ├── sar.py              # SAR backscatter change features
│   │   └── texture.py          # GLCM texture features
│   ├── detection/
│   │   ├── deforestation.py    # Deforestation detection algorithm
│   │   ├── mining.py           # Illegal mining detection algorithm
│   │   └── fire.py             # Active fire detection algorithm
│   └── output/
│       ├── geojson.py          # GeoJSON alert generation
│       └── confidence.py       # Confidence score computation
│
├── scripts/
│   ├── seed_demo_data.py       # Seed database with demo alerts
│   └── validate_thresholds.py  # Threshold calibration script
│
├── docs/
│   ├── PRD.docx                # Full Product Requirements Document
│   ├── API.md                  # API endpoint documentation
│   └── DETECTION_SPEC.md       # Full detection algorithm specification
│
├── .env.example                # Example environment variables
├── docker-compose.yml          # Local development with Docker
├── requirements.txt            # Python dependencies
└── README.md
```

---

## 🌍 Monitored Indian Forest Regions

| Region | States | Forest Type | Area Monitored |
|---|---|---|---|
| Western Ghats | Kerala, Tamil Nadu, Karnataka, Goa, Maharashtra | Tropical Moist Broadleaf | ~164,000 km² |
| Northeast India | Assam, Meghalaya, Arunachal Pradesh, Nagaland | Subtropical Broadleaf | ~170,000 km² |
| Sundarbans | West Bengal | Mangrove | ~10,000 km² |
| Central India | Madhya Pradesh, Chhattisgarh | Tropical Dry Deciduous | ~200,000 km² |
| Andaman & Nicobar | UT of A&N Islands | Tropical Rainforest | ~8,000 km² |

---

## 🏛️ Indian NGO Network

Canopix is designed to serve and integrate with India's leading conservation organisations:

- **Wildlife Institute of India** — Dehradun
- **Aaranyak** — Guwahati, Assam (Northeast specialists)
- **Bombay Natural History Society** — Mumbai (pan-India)
- **Salim Ali Centre for Ornithology and Natural History** — Coimbatore
- **Sundarbans Biosphere Trust** — Kolkata
- **Foundation for Ecological Security** — Anand, Gujarat
- **Nature Conservation Foundation** — Mysuru

---

## 📡 API Reference

Full API documentation available at `/docs` when running locally.

### Key Endpoints

```
GET  /api/v1/alerts                    # All alerts with filters
GET  /api/v1/alerts/:id                # Single alert detail
POST /api/v1/alerts/ingest             # Trigger manual scan
POST /api/v1/ngos/register             # Register new NGO
GET  /api/v1/ngos/:id/alerts           # NGO-specific alerts
POST /api/v1/ngos/:id/realert/:alert   # Re-dispatch alert
GET  /api/v1/summary                   # Daily summary metrics
GET  /api/v1/health                    # System health check
```

### Example Alert Response

```json
{
  "alert_id": "CAN-2026-02-23-WG-001",
  "alert_type": "Deforestation",
  "severity": "CRITICAL",
  "confidence_score": 0.87,
  "area_affected_ha": 620.4,
  "region": "Western Ghats, Kerala",
  "protected_area": "Periyar Tiger Reserve",
  "carbon_estimate_tonnes": 9800,
  "centroid": { "lat": 9.52, "lon": 77.14 },
  "sensors_used": ["Sentinel-2", "Sentinel-1"],
  "detection_date": "2026-02-23T06:14:00Z"
}
```

---

## 🤝 Contributing

We welcome contributions from developers, data scientists, conservationists, and anyone who cares about India's forests.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

### Areas Where We Need Help
- Improving detection accuracy for Northeast Indian forest types
- Adding support for RESOURCESAT-2A (ISRO) imagery
- Building mobile-responsive frontend
- Ground truth data collection partnerships with Indian NGOs
- Regional language support (Hindi, Tamil, Kannada, Bengali)

---

## 📊 Detection Performance

| Metric | Deforestation | Illegal Mining | Active Fire |
|---|---|---|---|
| Precision | ≥ 0.80 (target) | ≥ 0.75 (target) | ≥ 0.90 (target) |
| Recall | ≥ 0.75 (target) | ≥ 0.70 (target) | ≥ 0.88 (target) |
| F1 Score | ≥ 0.77 (target) | ≥ 0.72 (target) | ≥ 0.89 (target) |
| Alert Latency | < 10 min | < 10 min | < 5 min |

*Performance metrics will be updated as ground truth validation data is collected.*

---


## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🏆 Hackathon

Built for **Hack for Humanity 2026** — a one-month hackathon focused on using technology to solve environmental issues.

Submission: [hack-for-humanity-26.devpost.com](https://hack-for-humanity-26.devpost.com/)

If you found this project useful, please consider starring the repository ⭐ and sharing it with anyone who works in conservation, environmental tech, or satellite remote sensing.

---

## 🙏 Acknowledgements

- **ESA Copernicus Programme** — for free Sentinel-1 and Sentinel-2 data
- **NASA FIRMS** — for free VIIRS active fire data
- **Global Forest Watch** — for GLAD deforestation alert data
- **USGS** — for free Landsat archive access
- **Forest Survey of India** — for India forest cover reference data
- **Wildlife Institute of India** — for conservation domain expertise
- India's forest rangers and conservation workers who protect these ecosystems on the ground every single day

---

<div align="center">

**CANOPIX** · Built in India 🇮🇳 · For India's Forests 🌿

*"Vanam Eva Rakshati Rakshitah"* — The forest, when protected, protects in return.

[![Star this repo](https://img.shields.io/github/stars/NitroNitish/canopix?style=social)](https://github.com/yourusername/canopix)

</div># Canopix
