# 🚀 CANOPIX v2.0: Free Deployment Guide

Since CANOPIX is a full-stack application (Python Backend + Vite/JS Frontend), we need to host them on two separate free-tier services.

---

## 1. Deploy the Backend (Python FastAPI)
**Service**: [Render](https://render.com/) (Free Tier)

1. **Sign up**: Link your GitHub account to Render.
2. **New Web Service**: Select your `Canopix` repository.
3. **Configuration**:
   - **Environment**: `Python 3`
   - **Root Directory**: `backend` (Important: Point it to the backend folder)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Deploy**: Render will give you a URL like `https://canopix-backend.onrender.com`.

---

## 2. Connect the Frontend
**File**: `src/api.js`

Before deploying the frontend, update the `API_BASE` in `src/api.js` to point to your new Render URL:

```javascript
// src/api.js
const API_BASE = 'https://canopix-backend.onrender.com'; // Replace with your Render URL
```

---

## 3. Deploy the Frontend (Vite / Vanilla JS)
**Service**: [Vercel](https://vercel.com/) (Free Tier)

1. **Sign up**: Link your GitHub account to Vercel.
2. **Import Project**: Select the `Canopix` repository.
3. **Configuration**:
   - **Framework Preset**: Vite (it should auto-detect this)
   - **Root Directory**: `./` (The root folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Deploy**: Vercel will give you the public URL for your dashboard!

---

## 4. Why this setup?
- **Render**: Excellent for free Python/FastAPI hosting (Auto-deploys on every git push).
- **Vercel**: Best-in-class for Vite/Frontend hosting with global CDN.

---

> [!TIP]
> **Scaling**: If the free-tier backend "sleeps" due to inactivity, the first request might take ~30 seconds to wake it up. This is normal for free plans.
