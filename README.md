# Insurly

### AI-Powered Parametric Income Insurance for Food Delivery Partners

> *"When the rain stops their work, Insurly starts their pay."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Phase](https://img.shields.io/badge/Phase-1%20%7C%20Seed-blue)]()
[![Hackathon](https://img.shields.io/badge/Guidewire-DEVTrails%202026-orange)]()

\---

## ðŸ‘¥ Team

|Name|
|-|
|Seron|
|Subhakanta|
|Subhashree|
|Snehasrita|
|Priyadarshini|

**Repository:** https://github.com/seronsenapati/Insurly.git

\---



\## ðŸŽ¥Demo Video: https://youtu.be/nCXCFgmUV-o

\[Phase 1 Strategy \& Prototype Walkthrough](#) â† paste your YouTube/Drive link here
---

## ðŸ“Œ Problem Statement

India's food delivery ecosystem runs on millions of gig workers delivering for platforms like **Zomato** and **Swiggy**. In cities like **Bhubaneswar, Odisha** â€” which experiences intense monsoon seasons, cyclone alerts (e.g. Cyclone Fani's aftermath), and extreme summer heat â€” these workers are especially vulnerable to income loss caused by uncontrollable external disruptions.

When heavy rain hits, deliveries halt. When a cyclone warning is issued, zones are locked down. When AQI spikes, outdoor work becomes dangerous. The worker earns nothing â€” yet has no protection.

> A Zomato delivery partner in Bhubaneswar earns approximately â‚¹8,000â€“â‚¹12,000/month. A single week of disruption can wipe out **25â€“35% of their monthly income** with zero recourse.

**Insurly** is built to change that.

---

## ðŸ’¡ Our Solution

**Insurly** is an AI-enabled **parametric income insurance platform** exclusively for food delivery partners (Zomato/Swiggy) that:

* Automatically detects external disruptions via real-time data feeds
* Triggers insurance claims **without any manual action from the worker**
* Processes payouts **instantly** to the worker's UPI/bank account
* Prices weekly premiums **dynamically** using AI risk modeling based on the worker's zone, weather history, and delivery patterns

> We insure **lost income only** â€” not vehicles, not health, not accidents. Pure income protection, nothing else.

---

## ðŸŽ¯ Persona & Scenario Walkthrough

### Target Persona

**Raju, 28 â€” Swiggy delivery partner, Bhubaneswar**

* Works 10â€“12 hours/day, 6 days/week
* Earns approx. â‚¹2,200/week
* Operates primarily in Patia, Nayapalli, and Saheed Nagar zones
* Has no savings buffer; every working day matters

### Scenario 1 â€” Heavy Monsoon Rain ðŸŒ§ï¸

```
Monday, 3:00 PM â€” OpenWeatherMap detects rainfall > 15mm/hr in Bhubaneswar

Insurly System:
  â†’ Trigger fired: HEAVY_RAIN in zones [Patia, Nayapalli, Saheed Nagar]
  â†’ Raju's active policy matched to trigger zone âœ“
  â†’ Fraud check passed: Raju's GPS is in the affected zone âœ“
  â†’ Claim auto-approved
  â†’ â‚¹314 payout (proportional to lost hours) sent to Raju's UPI ID
  â†’ Raju receives SMS: "Your Insurly payout of â‚¹314 has been processed."

Total time from trigger to payout: < 2 minutes
Manual effort from Raju: Zero
```

### Scenario 2 â€” Cyclone/Storm Alert ðŸŒ€

```
Odisha State Disaster Management Authority issues cyclone alert

Insurly System:
  â†’ Trigger fired: CYCLONE_ALERT â€” entire Bhubaneswar coverage zone
  â†’ All active policyholders in affected zones identified
  â†’ Bulk auto-claims initiated for all matched workers
  â†’ Full-day coverage payout processed per policy terms
```

### Scenario 3 â€” Extreme Heat ðŸŒ¡ï¸

```
Temperature exceeds 44Â°C for 3+ consecutive hours (IMD data)

Insurly System:
  â†’ Trigger fired: EXTREME_HEAT
  â†’ Partial payout triggered (afternoon hours covered)
  â†’ Workers notified with heat advisory + payout confirmation
```

### Scenario 4 â€” Attempted Fraud ðŸš¨

```
Worker claims disruption but GPS shows they were active and completing orders

Insurly AI:
  â†’ Anomaly detected: delivery activity logged during claimed disruption window
  â†’ Claim flagged with fraud score: 91/100
  â†’ Claim sent to manual review queue
  â†’ Worker notified of review process
```

---

## ðŸ’° Weekly Premium Model

Insurly operates on a **weekly pricing model** aligned with the typical payout cycle of gig workers. Workers subscribe week-to-week with no long-term commitment.

### Base Premium Tiers

| Coverage Tier | Weekly Premium | Max Weekly Payout | Best For |
|---------------|----------------|-------------------|----------|
| Basic | â‚¹29/week | â‚¹500 | Low-risk zones, part-time workers |
| Standard | â‚¹59/week | â‚¹1,100 | Most delivery partners |
| Premium | â‚¹99/week | â‚¹2,000 | High-risk zones, full-time workers |

### AI-Driven Dynamic Pricing

The base premium is adjusted dynamically each week using our AI risk engine:

**Premium Calculation Formula:**
```
Final Weekly Premium = Base Premium Ã— Zone Risk Factor Ã— Weather Forecast Factor Ã— History Factor

Where:
  Zone Risk Factor      = 0.8â€“1.3 (based on historical disruption frequency in the zone)
  Weather Forecast Factor = 0.9â€“1.4 (based on next 7-day forecast severity)
  History Factor        = 0.85â€“1.1 (based on worker's claim history, loyalty discount)
```

**Example â€” Raju's premium calculation for Monsoon Week:**

```
Base:             â‚¹59  (Standard tier)
Zone Risk:        Ã— 1.2  (Patia zone â€” moderate flood history)
Weather Forecast: Ã— 1.3  (Heavy rain forecasted for 3 days this week)
History Factor:   Ã— 0.9  (Loyal customer, no fraudulent claims)

Final Premium:    â‚¹59 Ã— 1.2 Ã— 1.3 Ã— 0.9 = â‚¹83/week
```

### Payout Calculation

```
Daily Payout = (Weekly Avg Earnings / 6 working days) Ã— Disruption Severity Multiplier

Disruption Severity:
  Full Day (Cyclone/Flood):    100% of daily avg
  Half Day (Heavy Rain):        50% of daily avg
  Partial (Extreme Heat PM):    30% of daily avg
```

---

## âš¡ Parametric Triggers

Insurly monitors **5 automated triggers** using real-time APIs. Claims fire automatically when thresholds are crossed â€” no manual input needed from workers.

| Trigger | Data Source | Threshold | Payout Type |
|---------|-------------|-----------|-------------|
| ðŸŒ§ï¸ Heavy Rain | OpenWeatherMap API | Rainfall > 15mm/hr | Half-day or Full-day |
| ðŸŒ¡ï¸ Extreme Heat | OpenWeatherMap API | Temp > 43Â°C for 3+ hrs | Partial (afternoon) |
| ðŸŒ€ Cyclone / Storm | OpenWeatherMap + IMD alerts | Wind > 60 km/hr OR official alert | Full-day |
| ðŸŒ«ï¸ Severe Pollution | OpenAQ API | AQI > 300 (Hazardous) | Half-day |
| ðŸš« Zone Lockdown | Government alert feed (mock) | Official curfew/strike notice | Full-day |

---

## ðŸ¤– AI/ML Integration Plan

### 1. Dynamic Premium Calculation Engine

* **Approach:** Supervised regression model trained on historical weather data, zone-level disruption frequency, and claim payout history
* **Tech:** Brain.js (JavaScript neural network) + rule-based scoring
* **Input features:** Worker's zone, delivery platform, avg weekly earnings, time of year, 7-day weather forecast, historical claim frequency in zone
* **Output:** Adjusted weekly premium price

### 2. Fraud Detection System

* **Approach:** Anomaly detection using a combination of rule-based checks and an ML scoring model
* **Tech:** Google Gemini API for reasoning-based fraud explanation + custom scoring logic
* **Fraud signals monitored:**
  * GPS location vs claimed disruption zone mismatch
  * Active delivery orders logged during claimed disruption window
  * Duplicate claims within same time window
  * Claim pattern outliers vs peer group behavior
* **Output:** Fraud score (0â€“100), auto-approve below 30, manual review above 70

### 3. Risk Profiling

* **Approach:** Worker onboarding data + historical zone data used to generate a risk profile
* **Tech:** Google Gemini API for intelligent profiling summaries
* **Factors:** Zone flood history, delivery platform, working hours, season

### 4. Predictive Disruption Alerts

* **Approach:** 7-day weather forecast analysis to predict upcoming high-risk weeks
* **Output:** Workers notified in advance; premium adjusted proactively

---

## ðŸ—ï¸ Tech Stack

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
| Mock Payment Service | Simulated UPI payout processing (no signup required) |
| Leaflet.js + OpenStreetMap | Zone mapping and geolocation |

### Deployment

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Railway |
| Database | MongoDB Atlas (Free Tier) |

---

## ðŸ“ Project Structure

```
Insurly/
â”œâ”€â”€ frontend/                  # Next.js application
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ (auth)/
â”‚   â”‚   â”‚   â””â”€â”€ onboard/       # Worker registration flow
â”‚   â”‚   â”œâ”€â”€ worker/
â”‚   â”‚   â”‚   â””â”€â”€ dashboard/     # Worker's personal dashboard
â”‚   â”‚   â””â”€â”€ admin/
â”‚   â”‚       â””â”€â”€ dashboard/     # Insurer/admin analytics
â”‚   â”œâ”€â”€ components/
â”‚   â””â”€â”€ lib/
â”‚
â”œâ”€â”€ backend/                   # Node.js + Express API
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.js
â”‚   â”‚   â”‚   â”œâ”€â”€ policies.js
â”‚   â”‚   â”‚   â”œâ”€â”€ claims.js
â”‚   â”‚   â”‚   â””â”€â”€ triggers.js
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â”œâ”€â”€ weather.service.js    # OpenWeatherMap integration
â”‚   â”‚   â”‚   â”œâ”€â”€ ai.service.js         # Gemini API + Brain.js
â”‚   â”‚   â”‚   â”œâ”€â”€ claims.service.js     # Auto claim processing
â”‚   â”‚   â”‚   â”œâ”€â”€ fraud.service.js      # Fraud detection
â”‚   â”‚   â”‚   â””â”€â”€ payout.service.js     # Mock payment service
â”‚   â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”‚   â”œâ”€â”€ Worker.js
â”‚   â”‚   â”‚   â”œâ”€â”€ Policy.js
â”‚   â”‚   â”‚   â”œâ”€â”€ Claim.js
â”‚   â”‚   â”‚   â””â”€â”€ DisruptionEvent.js
â”‚   â”‚   â””â”€â”€ jobs/
â”‚   â”‚       â””â”€â”€ triggerMonitor.js     # Cron job â€” checks triggers every 15 min
â”‚
â””â”€â”€ README.md
```

---

## ðŸ—ºï¸ Application Workflow

```
1. ONBOARDING
   Worker registers â†’ provides name, phone, platform (Zomato/Swiggy),
   zone (pincode), avg weekly earnings
   â†’ AI generates risk profile
   â†’ Weekly premium calculated and presented

2. POLICY PURCHASE
  Worker selects coverage tier â†’ completes weekly premium payment in mock modal
   â†’ Policy activated for 7 days
   â†’ Worker receives confirmation SMS

3. TRIGGER MONITORING (Background â€” every 15 minutes)
   System polls OpenWeatherMap + OpenAQ for Bhubaneswar zones
   â†’ If threshold crossed â†’ DisruptionEvent created
   â†’ All workers in affected zone with active policies identified

4. AUTO CLAIM
   For each matched worker:
   â†’ Fraud check run (GPS validation, activity check)
   â†’ If fraud score < 30: Auto-approved â†’ payout initiated
   â†’ If fraud score 30â€“70: Conditional approval
   â†’ If fraud score > 70: Flagged for manual review

5. PAYOUT
  Mock payout response generated with worker's UPI ID
   â†’ Worker notified via SMS
   â†’ Dashboard updated in real-time

6. ANALYTICS
   Admin dashboard shows: active policies, triggered claims,
   payout amounts, loss ratios, fraud flags, zone risk heatmap
```

---

## ðŸ“… Development Plan

### Phase 1 â€” Seed (March 4â€“20) âœ… Current

* [x] Problem research and persona definition
* [x] Tech stack finalization
* [x] System architecture design
* [x] Weekly premium model design
* [x] Parametric trigger definition
* [x] GitHub repository setup
* [x] Initial Next.js + Express project scaffolding
* [x] MongoDB Atlas setup

### Phase 2 â€” Scale (March 21 â€“ April 4)

* [x] Worker registration and onboarding flow
* [x] Policy creation with dynamic premium calculation (AI)
* [x] OpenWeatherMap + OpenAQ trigger integration
* [x] Auto claim processing engine
* [x] Basic fraud detection (rule-based + Brain.js)
* [x] Mock payout response integration
* [x] Worker dashboard (policy status, payout history)

### Phase 3 â€” Soar (April 5â€“17)

* [x] Advanced fraud detection (Gemini AI reasoning layer)
* [x] Full admin/insurer analytics dashboard
* [x] Zone risk heatmap (Leaflet.js)
* [x] Predictive disruption alerts
* [x] Performance optimization
* [x] Final demo video production
* [x] Pitch deck preparation

---

## ðŸŒ Why Bhubaneswar?

Bhubaneswar, Odisha is one of India's most disruption-prone cities for delivery workers:

* **Monsoon Season (Juneâ€“September):** Among the heaviest rainfall zones in India
* **Cyclone Corridor:** Odisha coastline is India's most cyclone-affected region (Fani, Amphan, etc.)
* **Extreme Summer Heat:** Temperatures regularly exceed 42â€“45Â°C from Aprilâ€“June
* **Growing Gig Economy:** Rapid expansion of Zomato/Swiggy operations in Tier-2 cities like Bhubaneswar

Insurly's model is built for Bhubaneswar first, designed to scale to any Indian city.

---

## âš™ï¸ Platform Choice: Web App

We chose a **Web App** over a mobile app for the following reasons:

* **Accessibility:** Works on any smartphone browser without app installation â€” critical for adoption among gig workers with older/budget Android devices
* **Faster Development:** Single codebase (Next.js) deployable across all devices within our 6-week timeline
* **PWA Ready:** Next.js can be configured as a Progressive Web App, giving a near-native mobile experience
* **Admin Dashboard:** The insurer-side analytics dashboard is far more functional on web

---

## ðŸ‘¨â€ðŸ’» Getting Started (Phase 1 â€” Coming Soon)

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

## ðŸ“„ License

This project is licensed under the MIT License.

---

*Built with â¤ï¸ for Guidewire DEVTrails 2026 â€” Unicorn Chase  
Team Insurly | Bhubaneswar, Odisha*


## ?? Demo Video

| Phase | Video | Description |
|---|---|---|
| Phase 1 — Seed | [Watch Walkthrough](YOUR_YOUTUBE_OR_DRIVE_LINK) | Strategy and prototype |
| Phase 2 — Scale | [Watch Demo](YOUR_PHASE2_VIDEO_LINK) | Working product demo — Registration, Policy, Premium, Claims |

## ?? Quick Setup

```bash
# Clone
git clone https://github.com/seronsenapati/Insurly.git
cd Insurly

# Backend
cd backend
npm install
cp .env.example .env
# Fill in your API keys in .env
node seed.js
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Demo Credentials:**
```
Admin:  admin@insurly.com  /  Admin@1234
Worker: raju@test.com      /  Test@1234
```

## ? Phase 2 Features

- [x] **Registration Process** — 6-step onboarding with Gemini AI risk profiling
- [x] **Policy Management** — Weekly policies with Brain.js dynamic pricing
- [x] **Dynamic Premium Calculation** — Neural network trained on zone and weather data
- [x] **Claims Management** — Automated parametric claims with 10-signal fraud detection
