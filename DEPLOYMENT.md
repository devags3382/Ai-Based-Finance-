# 🚀 FinTrack AI - Production Deployment & Live Infrastructure

This document outlines the complete cloud deployment architecture, live environment endpoints, database configurations, and environment variable specifications for the **AI-Powered Personal Finance Tracker (FinTrack AI)**.

---

## 🌐 Live Production Summary Table

| Component | Cloud Platform | Live Production URL / Identifier | Status | Health Check Endpoint |
| :--- | :--- | :--- | :---: | :--- |
| **Frontend SPA** | **Vercel** | [https://client-pied-one-234pves790.vercel.app](https://client-pied-one-234pves790.vercel.app) | 🟢 `ONLINE` | `/login` |
| **Backend REST API** | **Render** | [https://finance-tracker-api-rf1a.onrender.com](https://finance-tracker-api-rf1a.onrender.com) | 🟢 `ONLINE` | [`/health`](https://finance-tracker-api-rf1a.onrender.com/health) |
| **Database Cluster** | **MongoDB Atlas** | `Cluster0` (AWS M0 Shared Cluster) | 🟢 `ONLINE` | Port `27017` / SRV |
| **Source Code** | **GitHub** | [devags3382/Ai-Based-Finance-](https://github.com/devags3382/Ai-Based-Finance-) | 🟢 `ACTIVE` | Branch `main` |

---

## 🏗️ Cloud Infrastructure Architecture

```
                                    +-----------------------------------------+
                                    |         User Web Browser (Client)       |
                                    +-----------------------------------------+
                                                         |
                                                         | HTTPS (Port 443)
                                                         v
                                    +-----------------------------------------+
                                    |         Vercel Edge Network (CDN)       |
                                    |    React 18 + Vite SPA Single Page App  |
                                    |  https://client-pied-one-234pves790...  |
                                    +-----------------------------------------+
                                                         |
                                                         | REST / JSON + JWT Bearer
                                                         v
                                    +-----------------------------------------+
                                    |        Render Cloud Web Service         |
                                    |        Node.js + Express.js API         |
                                    |  https://finance-tracker-api-rf1a...    |
                                    +-----------------------------------------+
                                           /                       \
                      Mongoose ODM / TLS  /                         \  AI Prompts
                                         v                           v
              +-------------------------------------+      +-------------------+
              |          MongoDB Atlas Cloud        |      |    OpenAI API     |
              |     AWS M0 Shared Cluster (Cluster0)|      |    gpt-4o-mini    |
              |  Users, Transactions, Budgets Data  |      |  (or Heuristics)  |
              +-------------------------------------+      +-------------------+
```

---

## 🔐 Environment Variables Matrix

### 1. Backend Service (Render)
| Variable Key | Required | Value / Format | Purpose |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | **Yes** | `production` | Enables optimized production caching and error handling |
| `PORT` | Auto | `10000` (Injected automatically by Render) | Internal port listener |
| `MONGODB_URI` | **Yes** | `mongodb+srv://<user>:<password>@cluster0.bvtbzly.mongodb.net/ai-finance-tracker?retryWrites=true&w=majority` | Connects backend to MongoDB Atlas Cloud |
| `JWT_SECRET` | **Yes** | `fintrack_jwt_secret_token_secure_key_998877` | 32+ character HMAC key for signing JWT auth tokens |
| `JWT_EXPIRE` | **Yes** | `7d` | Token expiration period |
| `FRONTEND_URL` | **Yes** | `https://client-pied-one-234pves790.vercel.app` | Allows secure CORS requests from your deployed Vercel frontend |
| `OPENAI_API_KEY` | Optional | `sk-...` *(Optional: deterministic heuristic fallback is active)* | Powers GPT-4o-mini financial recommendations |
| `OPENAI_MODEL` | Optional | `gpt-4o-mini` | Selected AI language model |

### 2. Frontend Client (Vercel)
| Variable Key | Required | Production Value | Purpose |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | **Yes** | `https://finance-tracker-api-rf1a.onrender.com/api` | Base API endpoint for all Axios requests |

---

## ⚙️ Service Configuration Reference

### Vercel Deployment Settings
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **SPA Rewrites**: Defined in `client/vercel.json` (`/(.*) -> /index.html`)

### Render Deployment Settings
- **Service Name**: `finance-tracker-api`
- **Environment**: `Node`
- **Branch**: `main`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Auto-Deploy**: Enabled on `git push origin main`

---

## 🧪 Deployment Verification & Health Check

The live full-stack system was verified with the following automated validation test run:

1. **Backend Health Check**:
   - Request: `GET https://finance-tracker-api-rf1a.onrender.com/health`
   - Response: `200 OK` `{ "status": "Server is running" }`
2. **User Registration & Auth**:
   - Created test account `demo_user@fintrack.ai`
   - Received valid signed JWT token and established user session.
3. **Database Cloud Persistence**:
   - Inserted new transaction (`Salary`, `+₹5,000`, `Income`) into MongoDB Atlas `Cluster0`.
   - Verified real-time balance calculations, net cash flow ledger, and dashboard cards.

---

## 🛠️ Maintenance & Redeployment

- **Pushing Code Updates**:
  Every commit pushed to the `main` branch on GitHub automatically triggers builds on both Vercel (Frontend) and Render (Backend).
- **Updating Environment Variables**:
  - For Backend: Go to [Render Dashboard](https://dashboard.render.com) → `finance-tracker-api` → **Environment**.
  - For Frontend: Go to [Vercel Dashboard](https://vercel.com/dashboard) → `client` → **Settings** → **Environment Variables**.
