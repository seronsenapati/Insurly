# Insurly

### AI-Powered Parametric Income Insurance for Food Delivery Partners

> *"When the rain stops their work, Insurly starts their pay."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Phase](https://img.shields.io/badge/Phase-1%20%7C%20Seed-blue)]()
[![Hackathon](https://img.shields.io/badge/Guidewire-DEVTrails%202026-orange)]()

---

## 👥 Team

| Name          |
| ------------- |
| Seron         |
| Subhakanta    |
| Subhashree    |
| Snehasrita    |
| Priyadarshini |

**Repository:** https://github.com/seronsenapati/Insurly.git

---

## 🎥 Demo Video

[Watch Demo](https://youtu.be/nCXCFgmUV-o)

---

## 📌 Problem Statement

India's food delivery ecosystem runs on millions of gig workers delivering for platforms like **Zomato** and **Swiggy**.

In cities like **Bhubaneswar, Odisha** — which experiences intense monsoon seasons, cyclone alerts, and extreme summer heat — these workers are especially vulnerable to income loss caused by uncontrollable disruptions.

When heavy rain hits, deliveries halt. When a cyclone warning is issued, zones are locked down. When AQI spikes, outdoor work becomes dangerous.

> A delivery partner earns approximately ₹8,000–₹12,000/month. A single week of disruption can wipe out **25–35% of their income**.

**Insurly solves this.**

---

## 💡 Our Solution

**Insurly** is an AI-enabled **parametric income insurance platform** that:

* Automatically detects disruptions via real-time APIs
* Triggers claims **without manual action**
* Processes payouts **instantly via UPI**
* Uses AI to dynamically price premiums

> We insure **income loss only** — not health, not vehicles.

---

## 🎯 Persona

**Raju, 28 — Swiggy delivery partner**

* Works 10–12 hours/day
* Earns ~₹2,200/week
* No savings buffer

---

## 🌧️ Scenario — Heavy Rain

```
Monday, 3:00 PM — Rainfall > 15mm/hr detected

System:
  → Trigger fired
  → Policy matched
  → Fraud check passed
  → Claim auto-approved
  → ₹314 payout sent

Time taken: < 2 minutes
User effort: Zero
```

---

## 🌪️ Scenario — Cyclone Alert

```
→ Government alert detected
→ All users in zone identified
→ Bulk claims processed
→ Full-day payout sent
```

---

## 🌡️ Scenario — Extreme Heat

```
→ Temp > 44°C
→ Partial payout triggered
→ Workers notified
```

---

## 🚨 Fraud Detection Example

```
→ Worker active during claim window
→ Fraud score: 91/100
→ Sent for manual review
```

---

## 💰 Weekly Premium Model

| Tier     | Premium | Max Payout |
| -------- | ------- | ---------- |
| Basic    | ₹29     | ₹500       |
| Standard | ₹59     | ₹1,100     |
| Premium  | ₹99     | ₹2,000     |

---

### Dynamic Pricing Formula

```
Final Premium = Base × Zone Risk × Weather × History
```

**Example:**

```
₹59 × 1.2 × 1.3 × 0.9 = ₹83/week
```

---

## ⚡ Parametric Triggers

| Trigger     | Threshold  | Payout    |
| ----------- | ---------- | --------- |
| 🌧️ Rain    | >15mm/hr   | Half/Full |
| 🌡️ Heat    | >43°C      | Partial   |
| 🌪️ Cyclone | >60 km/h   | Full      |
| 🌫️ AQI     | >300       | Half      |
| 🚫 Lockdown | Govt alert | Full      |

---

## 🤖 AI/ML Integration

### 1. Premium Engine

* Brain.js neural network
* Uses weather + zone data

### 2. Fraud Detection

* Rule-based + AI scoring
* GPS + activity checks

### 3. Risk Profiling

* Gemini API insights

### 4. Predictive Alerts

* 7-day forecast analysis

---

## 🏗️ Tech Stack

### Frontend

* React.js / Next.js
* Tailwind CSS
* Recharts
* Leaflet.js

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Auth
* Node-cron

### AI & APIs

* Gemini API
* Brain.js
* OpenWeatherMap
* OpenAQ

---

## 📁 Project Structure

```
Insurly/
├── frontend/
├── backend/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── jobs/
└── README.md
```

---

## 🗺️ Workflow

```
1. Onboarding
2. Policy Purchase
3. Trigger Monitoring
4. Auto Claim
5. Payout
6. Analytics
```

---

## 🌍 Why Bhubaneswar?

* Heavy monsoon region
* Cyclone-prone zone
* Extreme heat
* Growing gig workforce

---

## ⚙️ Platform Choice

* Web app (no install needed)
* Works on low-end devices
* Faster deployment
* PWA-ready

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/seronsenapati/Insurly.git
cd Insurly

# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

---

## 🔑 Demo Credentials

```
Admin:  admin@insurly.com / Admin@1234
Worker: raju@test.com     / Test@1234
```

---

## 📅 Development Phases

### Phase 1 — Seed ✅

* Research
* Architecture
* Pricing model

### Phase 2 — Scale ✅

* Registration
* Claims engine
* AI pricing

### Phase 3 — Soar ✅

* Fraud AI
* Analytics dashboard
* Final demo

---

## 📄 License

MIT License

---

## ❤️ Built For

**Guidewire DEVTrails 2026 — Unicorn Chase**

Team Insurly | Bhubaneswar, Odisha
