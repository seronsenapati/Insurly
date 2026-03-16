# 🛡️ Insurly

### AI-Powered Parametric Income Insurance for Food Delivery Partners

> *"When the rain stops their work, Insurly starts their pay."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Phase](https://img.shields.io/badge/Phase-1%20%7C%20Seed-blue)]()
[![Hackathon](https://img.shields.io/badge/Guidewire-DEVTrails%202026-orange)]()

\---

## 👥 Team

|Name|Role|
|-|-|
|||
|||
|||
|||
|||

**Repository:** https://github.com/seronsenapati/Insurly.git

\---



\## 🎥 Demo Video

\[Phase 1 Strategy \& Prototype Walkthrough](#) ← paste your YouTube/Drive link here
---

## 📌 Problem Statement

India's food delivery ecosystem runs on millions of gig workers delivering for platforms like **Zomato** and **Swiggy**. In cities like **Bhubaneswar, Odisha** — which experiences intense monsoon seasons, cyclone alerts (e.g. Cyclone Fani's aftermath), and extreme summer heat — these workers are especially vulnerable to income loss caused by uncontrollable external disruptions.

When heavy rain hits, deliveries halt. When a cyclone warning is issued, zones are locked down. When AQI spikes, outdoor work becomes dangerous. The worker earns nothing — yet has no protection.

> A Zomato delivery partner in Bhubaneswar earns approximately ₹8,000–₹12,000/month. A single week of disruption can wipe out **25–35% of their monthly income** with zero recourse.

**Insurly** is built to change that.

\---

## 💡 Our Solution

**Insurly** is an AI-enabled **parametric income insurance platform** exclusively for food delivery partners (Zomato/Swiggy) that:

* Automatically detects external disruptions via real-time data feeds
* Triggers insurance claims **without any manual action from the worker**
* Processes payouts **instantly** to the worker's UPI/bank account
* Prices weekly premiums **dynamically** using AI risk modeling based on the worker's zone, weather history, and delivery patterns

> We insure **lost income only** — not vehicles, not health, not accidents. Pure income protection, nothing else.

\---

## 🎯 Persona \& Scenario Walkthrough

### Target Persona

**Raju, 28 — Swiggy delivery partner, Bhubaneswar**

* Works 10–12 hours/day, 6 days/week
* Earns approx. ₹2,200/week
* Operates primarily in Patia, Nayapalli, and Saheed Nagar zones
* Has no savings buffer; every working day matters

### Scenario 1 — Heavy Monsoon Rain 🌧️

```
Monday, 3:00 PM — OpenWeatherMap detects rainfall > 15mm/hr in Bhubaneswar

Insurly System:
  → Trigger fired: HEAVY\_RAIN in zones \[Patia, Nayapalli, Saheed Nagar]
  → Raju's active policy matched to trigger zone ✓
  → Fraud check passed: Raju's GPS is in the affected zone ✓
  → Claim auto-approved
  → ₹314 payout (proportional to lost hours) sent to Raju's UPI ID
  → Raju receives SMS: "Your Insurly payout of ₹314 has been processed."

Total time from trigger to payout: < 2 minutes
Manual effort from Raju: Zero
```

### Scenario 2 — Cyclone/Storm Alert 🌀

```
Odisha State Disaster Management Authority issues cyclone alert

Insurly System:
  → Trigger fired: CYCLONE\_ALERT — entire Bhubaneswar coverage zone
  → All active policyholders in affected zones identified
  → Bulk auto-claims initiated for all matched workers
  → Full-day coverage payout processed per policy terms
```

### Scenario 3 — Extreme Heat 🌡️

```
Temperature exceeds 44°C for 3+ consecutive hours (IMD data)

Insurly System:
  → Trigger fired: EXTREME\_HEAT
  → Partial payout triggered (afternoon hours covered)
  → Workers notified with heat advisory + payout confirmation
```

### Scenario 4 — Attempted Fraud 🚨

```
Worker claims disruption but GPS shows they were active and completing orders

Insurly AI:
  → Anomaly detected: delivery activity logged during claimed disruption window
  → Claim flagged with fraud score: 91/100
  → Claim sent to manual review queue
  → Worker notified of review process
```

\---

## 💰 Weekly Premium Model

Insurly operates on a **weekly pricing model** aligned with the typical payout cycle of gig workers. Workers subscribe week-to-week with no long-term commitment.

### Base Premium Tiers

| Coverage Tier | Weekly Premium | Max Weekly Payout | Best For |
|---------------|----------------|-------------------|----------|
| Basic | ₹29/week | ₹500 | Low-risk zones, part-time workers |
| Standard | ₹59/week | ₹1,100 | Most delivery partners |
| Premium | ₹99/week | ₹2,000 | High-risk zones, full-time workers |

### AI-Driven Dynamic Pricing

The base premium is adjusted dynamically each week using our AI risk engine:

**Premium Calculation Formula:**
```
Final Weekly Premium = Base Premium × Zone Risk Factor × Weather Forecast Factor × History Factor

Where:
  Zone Risk Factor      = 0.8–1.3 (based on historical disruption frequency in the zone)
  Weather Forecast Factor = 0.9–1.4 (based on next 7-day forecast severity)
  History Factor        = 0.85–1.1 (based on worker's claim history, loyalty discount)
```

**Example — Raju's premium calculation for Monsoon Week:**

```
Base:             ₹59  (Standard tier)
Zone Risk:        × 1.2  (Patia zone — moderate flood history)
Weather Forecast: × 1.3  (Heavy rain forecasted for 3 days this week)
History Factor:   × 0.9  (Loyal customer, no fraudulent claims)

Final Premium:    ₹59 × 1.2 × 1.3 × 0.9 = ₹83/week
```

### Payout Calculation

```
Daily Payout = (Weekly Avg Earnings / 6 working days) × Disruption Severity Multiplier

Disruption Severity:
  Full Day (Cyclone/Flood):    100% of daily avg
  Half Day (Heavy Rain):        50% of daily avg
  Partial (Extreme Heat PM):    30% of daily avg
```

---

## ⚡ Parametric Triggers

Insurly monitors **5 automated triggers** using real-time APIs. Claims fire automatically when thresholds are crossed — no manual input needed from workers.

| Trigger | Data Source | Threshold | Payout Type |
|---------|-------------|-----------|-------------|
| 🌧️ Heavy Rain | OpenWeatherMap API | Rainfall > 15mm/hr | Half-day or Full-day |
| 🌡️ Extreme Heat | OpenWeatherMap API | Temp > 43°C for 3+ hrs | Partial (afternoon) |
| 🌀 Cyclone / Storm | OpenWeatherMap + IMD alerts | Wind > 60 km/hr OR official alert | Full-day |
| 🌫️ Severe Pollution | OpenAQ API | AQI > 300 (Hazardous) | Half-day |
| 🚫 Zone Lockdown | Government alert feed (mock) | Official curfew/strike notice | Full-day |

---

## 🤖 AI/ML Integration Plan

### 1. Dynamic Premium Calculation Engine

* **Approach:** Supervised regression model trained on historical weather data, zone-level disruption frequency, and claim payout history
* **Tech:** Brain.js (JavaScript neural network) + rule-based scoring
* **Input features:** Worker's zone, delivery platform, avg weekly earnings, time of year, 7-day weather forecast, historical claim frequency in zone
* **Output:** Adjusted weekly premium price

### 2. Fraud Detection System

* **Approach:** Anomaly detection using a combination of rule-based checks and an ML scoring model
* **Tech:** Anthropic Claude API for reasoning-based fraud explanation + custom scoring logic
* **Fraud signals monitored:**
  * GPS location vs claimed disruption zone mismatch
  * Active delivery orders logged during claimed disruption window
  * Duplicate claims within same time window
  * Claim pattern outliers vs peer group behavior
* **Output:** Fraud score (0–100), auto-approve below 30, manual review above 70

### 3. Risk Profiling

* **Approach:** Worker onboarding data + historical zone data used to generate a risk profile
* **Tech:** Anthropic Claude API for intelligent profiling summaries
* **Factors:** Zone flood history, delivery platform, working hours, season

### 4. Predictive Disruption Alerts

* **Approach:** 7-day weather forecast analysis to predict upcoming high-risk weeks
* **Output:** Workers notified in advance; premium adjusted proactively

---

## 🏗️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React.js 14 | React framework |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Recharts | Analytics dashboard charts |
| Leaflet.js | Interactive zone maps |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | REST API server |
| JavaScript | Type safety across codebase |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| Node-cron | Scheduled trigger monitoring |

### Database

| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Primary database (workers, policies, claims) |

### AI & External APIs

| Service | Purpose |
|---------|---------|
| Gemini API (Google) | Fraud reasoning, risk profiling |
| Brain.js | Premium calculation ML model |
| OpenWeatherMap API | Weather disruption triggers |
| OpenAQ API | Air quality (AQI) triggers |
| Razorpay Test Mode | Simulated UPI payout processing |
| Mapbox | Zone mapping and geolocation |

### Deployment

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Railway |
| Database | MongoDB Atlas (Free Tier) |

---

## 📁 Project Structure

```
Insurly/
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── onboard/       # Worker registration flow
│   │   ├── worker/
│   │   │   └── dashboard/     # Worker's personal dashboard
│   │   └── admin/
│   │       └── dashboard/     # Insurer/admin analytics
│   ├── components/
│   └── lib/
│
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── policies.ts
│   │   │   ├── claims.ts
│   │   │   └── triggers.ts
│   │   ├── services/
│   │   │   ├── weather.service.ts    # OpenWeatherMap integration
│   │   │   ├── ai.service.ts         # Claude API + Brain.js
│   │   │   ├── claims.service.ts     # Auto claim processing
│   │   │   ├── fraud.service.ts      # Fraud detection
│   │   │   └── payout.service.ts     # Razorpay integration
│   │   ├── models/
│   │   │   ├── Worker.ts
│   │   │   ├── Policy.ts
│   │   │   ├── Claim.ts
│   │   │   └── DisruptionEvent.ts
│   │   └── jobs/
│   │       └── triggerMonitor.ts     # Cron job — checks triggers every 15 min
│
└── README.md
```

---

## 🗺️ Application Workflow

```
1. ONBOARDING
   Worker registers → provides name, phone, platform (Zomato/Swiggy),
   zone (pincode), avg weekly earnings
   → AI generates risk profile
   → Weekly premium calculated and presented

2. POLICY PURCHASE
   Worker selects coverage tier → pays weekly premium (Razorpay)
   → Policy activated for 7 days
   → Worker receives confirmation SMS

3. TRIGGER MONITORING (Background — every 15 minutes)
   System polls OpenWeatherMap + OpenAQ for Bhubaneswar zones
   → If threshold crossed → DisruptionEvent created
   → All workers in affected zone with active policies identified

4. AUTO CLAIM
   For each matched worker:
   → Fraud check run (GPS validation, activity check)
   → If fraud score < 30: Auto-approved → payout initiated
   → If fraud score 30–70: Conditional approval
   → If fraud score > 70: Flagged for manual review

5. PAYOUT
   Razorpay payout API called with worker's UPI ID
   → Worker notified via SMS
   → Dashboard updated in real-time

6. ANALYTICS
   Admin dashboard shows: active policies, triggered claims,
   payout amounts, loss ratios, fraud flags, zone risk heatmap
```

---

## 📅 Development Plan

### Phase 1 — Seed (March 4–20) ✅ Current

* [x] Problem research and persona definition
* [x] Tech stack finalization
* [x] System architecture design
* [x] Weekly premium model design
* [x] Parametric trigger definition
* [x] GitHub repository setup
* [ ] Initial Next.js + Express project scaffolding
* [ ] MongoDB Atlas setup

### Phase 2 — Scale (March 21 – April 4)

* [ ] Worker registration and onboarding flow
* [ ] Policy creation with dynamic premium calculation (AI)
* [ ] OpenWeatherMap + OpenAQ trigger integration
* [ ] Auto claim processing engine
* [ ] Basic fraud detection (rule-based + Brain.js)
* [ ] Razorpay test mode payout integration
* [ ] Worker dashboard (policy status, payout history)

### Phase 3 — Soar (April 5–17)

* [ ] Advanced fraud detection (Claude AI reasoning layer)
* [ ] Full admin/insurer analytics dashboard
* [ ] Zone risk heatmap (Leaflet.js)
* [ ] Predictive disruption alerts
* [ ] Performance optimization
* [ ] Final demo video production
* [ ] Pitch deck preparation

---

## 🌍 Why Bhubaneswar?

Bhubaneswar, Odisha is one of India's most disruption-prone cities for delivery workers:

* **Monsoon Season (June–September):** Among the heaviest rainfall zones in India
* **Cyclone Corridor:** Odisha coastline is India's most cyclone-affected region (Fani, Amphan, etc.)
* **Extreme Summer Heat:** Temperatures regularly exceed 42–45°C from April–June
* **Growing Gig Economy:** Rapid expansion of Zomato/Swiggy operations in Tier-2 cities like Bhubaneswar

Insurly's model is built for Bhubaneswar first, designed to scale to any Indian city.

---

## ⚙️ Platform Choice: Web App

We chose a **Web App** over a mobile app for the following reasons:

* **Accessibility:** Works on any smartphone browser without app installation — critical for adoption among gig workers with older/budget Android devices
* **Faster Development:** Single codebase (Next.js) deployable across all devices within our 6-week timeline
* **PWA Ready:** Next.js can be configured as a Progressive Web App, giving a near-native mobile experience
* **Admin Dashboard:** The insurer-side analytics dashboard is far more functional on web

---

## 👨‍💻 Getting Started (Phase 1 — Coming Soon)

```bash
# Clone the repository
git clone https://github.com/seronsenapati/Insurly.git
cd Insurly

# Backend setup
cd backend
npm install
cp .env.example .env   # Add your API keys
npm run dev

# Frontend setup
cd ../frontend
npm install
npm run dev
```

> Full setup instructions will be updated as development progresses through each phase.

---

## 📄 License

This project is licensed under the MIT License.

---

*Built with ❤️ for Guidewire DEVTrails 2026 — Unicorn Chase  
Team Insurly | Bhubaneswar, Odisha*
