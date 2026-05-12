# ⚡ EnergiaAO — Power Outage Intelligence for Luanda

> Know when the lights go out. Prepare in advance.

EnergiaAO is a full-stack power outage tracking platform for residents of Luanda, Angola. It combines a mobile app, a web landing page, and a REST API backend to deliver real-time outage alerts, community reports, and push notifications.

🌐 **Live web:** [energia-ao.vercel.app](https://energia-ao.vercel.app)

---

## Project Structure

```
energiaao/
├── backend/          # FastAPI + PostgreSQL REST API
├── mobile/           # React Native (Expo) — iOS & Android
```

---

## Features

| Feature | Description |
|---|---|
| 📅 Outage Schedules | Planned and unplanned outage data per neighborhood |
| 🗺️ Live Map | Interactive map of affected areas in Luanda |
| 🔔 Push Notifications | Alerts 30 minutes before outages via Expo |
| 📢 Community Reports | Users report unplanned outages |
| 🌍 Bilingual | Full Portuguese and English support |
| 📴 Offline Safe | Mock data fallback when API is unavailable |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker + Docker Compose
- Expo Go app on your phone

---

### 1. Backend (FastAPI + PostgreSQL)

```bash
cd backend

# With Docker (recommended)
docker-compose up --build

# Or manually
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000
```

API runs at **http://localhost:8000**  
Docs at **http://localhost:8000/docs**

---

### 2. Mobile App (Expo)

```bash
cd mobile
npm install
npx expo start
```

- Press `i` — iOS Simulator
- Press `a` — Android Emulator
- Scan QR — Expo Go on physical device

**Physical device:**
```bash
echo "EXPO_PUBLIC_API_URL=http://YOUR_IP:8000/api/v1" > .env
npx expo start --clear
```

> The app works fully without a backend — it falls back to mock data automatically.

---

### 3. Web (Next.js)

```bash
cd web
npm install
npm run dev
```

Runs at **http://localhost:3000**

---

## API Reference

Base URL: `http://localhost:8000/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/neighborhoods/` | List all neighborhoods |
| `GET` | `/outages/` | List outages (filterable) |
| `GET` | `/outages/active` | Currently active outages |
| `POST` | `/outages/` | Create outage (admin) |
| `POST` | `/reports/` | Submit community report |
| `GET` | `/reports/` | List reports |
| `POST` | `/notifications/register` | Register push token |
| `DELETE` | `/notifications/unregister/{token}` | Unregister token |
| `GET` | `/health` | Health check |

**Query parameters:**
```
GET /outages/?neighborhood_id=1&upcoming=true&status=scheduled
```

---

## Environment Variables

### Backend `.env`
```env
DATABASE_URL=postgresql://energiaao:energiaao@localhost:5432/energiaao
SECRET_KEY=your-secret-key-here
DEBUG=false
NOTIFICATION_LEAD_MINUTES=30
```

### Mobile `.env`
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api/v1
```

### Web `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Tech Stack

### Backend
- **FastAPI** — async REST API
- **PostgreSQL** — primary database
- **SQLAlchemy** — ORM
- **Pydantic v2** — validation
- **HTTPX** — Expo push notifications

### Mobile
- **React Native + Expo SDK 51**
- **Expo Router** — file-based navigation
- **Zustand** — state management
- **Axios** — API client with mock fallback

### Web
- **Next.js 14** + **Tailwind CSS**
- **Framer Motion** — animations
- **D3 + TopoJSON** — Angola province map

---

## Screens

| Screen | Description |
|---|---|
| **Home** | Power status banner, upcoming outages, report button |
| **Schedule** | Outage list grouped by date, filterable |
| **Map** | Affected neighborhoods with outage details |
| **Settings** | Neighborhood picker, language toggle, notifications |

---

## Seeded Data

15 Luanda neighborhoods pre-loaded:

Ingombotas · Maianga · Rangel · Sambizanga · Kilamba Kiaxi · Cacuaco · Viana · Talatona · Morro Bento · Cazenga · Benfica · Golfe · Miramar · Alvalade · Mutamba

---

## Deployment

### Backend — Docker
```bash
docker-compose up --build -d
```

### Mobile — EAS Build
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
eas build --platform all --profile production
```

### Web — Vercel
```bash
cd web && npx vercel --prod
```

---

## License

MIT — built for the people of Luanda 🇦🇴

*EnergiaAO is an independent community project, not affiliated with ENDE.*


EXTRA:

Meso

Protecting Africa’s critical infrastructure

Energia AO

Inspired by the impact of EskomSePush
, a free community platform that helps South Africans plan their lives around scheduled power outages (load shedding).

Technologies Used
Flutter
Google Cloud
Python
Kubernetes (GKE/kind)
Prometheus
Varnish
Serverless architecture
Firebase / Firestore
SlackOps

I created this application because of the electricity challenges we face in Angola.

Know when the power will go out. Prepare in advance.

A full-stack mobile application that helps residents of Luanda, Angola stay informed about scheduled and unscheduled power outages.

How It Works

The application gathers information about power outages and sends alerts to users.

People select their area and receive notifications whenever there are scheduled outages or important updates, allowing them to prepare in advance.

Why Is This Important in Everyday Life?
Answering the 3 key questions:
The application was created to help people in Luanda know in advance about electricity outages.
This allows better daily planning, protection of electronic equipment, and reduces the impact on work, studies, and daily routines.
It is not only about psychological preparation, but about providing useful information so people can plan ahead and make better decisions.
Sources of Information
Schedules and announcements from ENDE (National Electricity Distribution Company)
Municipal and provincial energy updates (Luanda, Benguela, Huíla, etc.)
Social media and press announcements (Facebook pages, PDFs, radio announcements)
Community reports (extremely important in Angola)