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

## 🛡️ Adversarial Defense & Anti-Spoofing Strategy

### 1. The Differentiation: Genuine vs. Spoofed Location

Our AI/ML architecture employs **multi-layered verification** to distinguish between genuinely stranded delivery partners and bad actors attempting to spoof their location:

**Primary Authentication Layer:**
- **GPS Triangulation Validation**: Cross-references GPS coordinates with cell tower data and WiFi hotspot mapping to detect location spoofing apps
- **Device Fingerprinting**: Analyzes device hardware signatures, sensor data patterns, and network configuration inconsistencies
- **Movement Pattern Analysis**: Uses velocity and acceleration sensors to verify realistic human movement vs. simulated teleportation

**Behavioral Verification Layer:**
- **Delivery Platform Integration**: Validates against Zomato/Swiggy APIs to confirm the worker was actually logged into their delivery app during the claimed disruption
- **Historical Pattern Matching**: Compares current location behavior against the worker's established movement patterns and zone preferences
- **Peer Correlation**: Analyzes whether other delivery partners in the same zone are experiencing similar disruptions

**Technical Implementation:**
```javascript
// Fraud detection scoring algorithm
const fraudScore = calculateFraudRisk({
  gpsConsistency: validateGPSTriangulation(gpsData),
  deviceAuthenticity: checkDeviceFingerprint(deviceId),
  movementRealism: analyzeMovementPatterns(sensorData),
  platformActivity: verifyDeliveryPlatformStatus(workerId),
  peerValidation: correlateWithPeerBehavior(zone, timestamp)
});
```

### 2. The Data: Beyond Basic GPS Coordinates

To detect coordinated fraud rings, our system analyzes **12 distinct data points** beyond simple location:

**Environmental & Contextual Data:**
- **Barometric Pressure**: Phone sensor readings to verify altitude changes consistent with claimed location
- **Network Quality Metrics**: Signal strength, connection type, and latency patterns typical of disrupted areas
- **Weather Station Correlation**: Cross-references local IMD weather stations with claimed weather conditions
- **Power Grid Status**: Monitors electricity outage reports in claimed disruption zones

**Behavioral & Transactional Data:**
- **App Usage Patterns**: Screens which apps are active during claimed disruptions (delivery app vs. entertainment apps)
- **Battery Consumption**: Analyzes battery drain patterns consistent with outdoor delivery work vs. stationary phone usage
- **Communication Patterns**: Monitors call/SMS activity during disruptions (genuine workers often contact customers/restaurant)
- **Financial Transaction Flow**: Tracks UPI transaction locations and timing during claimed disruption windows

**Social Network Analysis for Fraud Ring Detection:**
- **Registration Pattern Clustering**: Identifies groups of workers who registered simultaneously with similar device patterns
- **Claim Synchronization**: Detects multiple claims filed within seconds of each other across different zones
- **IP Address Correlation**: Maps network infrastructure usage patterns across multiple accounts
- **Referral Chain Analysis**: Traces recruitment patterns to identify coordinated fraud networks

**Coordinated Fraud Ring Indicators:**
```javascript
const fraudRingSignals = {
  synchronizedClaims: detectClaimClusters(timeWindow: '5min'),
  deviceSimilarity: calculateDeviceFingerprintSimilarity(accounts),
  networkProximity: analyzeIPGeographicClustering(),
  behavioralMirroring: compareActivityPatterns(accounts),
  financialLinkages: traceUPIConnectionPatterns()
};
```

### 3. The UX Balance: Fair Treatment of Honest Workers

Our workflow implements a **graded response system** that protects against fraud while minimizing impact on honest gig workers:

**Tiered Flagging System:**

**🟢 Low Risk (Score 0-30) - Auto-Approved**
- GPS and environmental data consistent
- No historical fraud indicators
- Peer validation confirms disruption
- Payout processed in <2 minutes

**🟡 Medium Risk (Score 31-70) - Enhanced Verification**
- Requires additional verification steps:
  - Photo verification of current location (landmark + timestamp)
  - Brief voice note explaining disruption situation
  - Secondary confirmation from delivery platform API
- Processing time: 5-10 minutes
- Worker receives friendly notification: "We're verifying your location to ensure fair coverage"

**🔴 High Risk (Score 71-100) - Manual Review**
- Flagged for human review by fraud specialists
- Worker receives transparent communication about review process
- Temporary hold on payout (maximum 24 hours)
- Appeals process available with dedicated support

**Network Drop & Bad Weather Accommodations:**
- **Grace Period System**: Automatically allows 15-minute grace periods for GPS connectivity issues during severe weather
- **Fallback Verification**: When GPS is unreliable, system switches to cell tower triangulation + last known location validation
- **Weather-Aware Thresholds**: Fraud detection thresholds are automatically relaxed during officially declared severe weather events
- **Peer Support System**: Honest workers can be vouched for by other verified delivery partners in their zone

**Worker-Centric Design Principles:**
```javascript
const workerProtection = {
  transparentCommunication: 'clear explanations for any delays',
  minimalFriction: 'verification steps under 30 seconds',
  fairAppeals: 'human review within 24 hours',
  weatherEmpathy: 'relaxed thresholds during genuine disruptions',
  reputationBuilding: 'trust scores improve with honest claims history'
};
```

**Continuous Learning Loop:**
- False positive feedback is used to retrain the fraud detection models
- Worker trust scores improve over time with verified legitimate claims
- Seasonal adjustments account for weather pattern variations
- Regional calibration accounts for infrastructure differences across zones

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
