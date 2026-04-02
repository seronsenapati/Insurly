const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Worker = require('./src/models/Worker.model');
const Admin = require('./src/models/Admin.model');
const Policy = require('./src/models/Policy.model');
const Claim = require('./src/models/Claim.model');
const DisruptionEvent = require('./src/models/DisruptionEvent.model');
const Payout = require('./src/models/Payout.model');

const ZONES = ['Patia', 'Nayapalli', 'Saheed Nagar', 'Khandagiri', 'Rasulgarh', 'Unit-4', 'Chandrasekharpur'];
const PLATFORMS = ['zomato', 'swiggy'];
const TIERS = ['basic', 'standard', 'premium'];
const TIER_PAYOUTS = { basic: 500, standard: 1100, premium: 2000 };
const TIER_PREMIUMS = { basic: 29, standard: 59, premium: 99 };

const ZONE_COORDS = {
  'Patia': { lat: 20.3555, lng: 85.8190 },
  'Nayapalli': { lat: 20.2950, lng: 85.8010 },
  'Saheed Nagar': { lat: 20.2870, lng: 85.8400 },
  'Khandagiri': { lat: 20.2560, lng: 85.7780 },
  'Rasulgarh': { lat: 20.3020, lng: 85.8590 },
  'Unit-4': { lat: 20.2730, lng: 85.8300 },
  'Chandrasekharpur': { lat: 20.3340, lng: 85.8140 }
};

const PINCODES = {
  'Patia': '751024', 'Nayapalli': '751012', 'Saheed Nagar': '751007',
  'Khandagiri': '751030', 'Rasulgarh': '751010', 'Unit-4': '751001',
  'Chandrasekharpur': '751016'
};

/**
 * Generate random number in range
 */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Seed the database
 */
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await Promise.all([
      Worker.deleteMany({}),
      Admin.deleteMany({}),
      Policy.deleteMany({}),
      Claim.deleteMany({}),
      DisruptionEvent.deleteMany({}),
      Payout.deleteMany({})
    ]);
    console.log('🗑️ Cleared existing data');

    // Seed Admin
    const admin = await Admin.create({
      name: 'Insurly Admin',
      email: 'admin@insurly.com',
      password: 'Admin@1234'
    });
    console.log(`👤 Admin created: admin@insurly.com / Admin@1234`);

    // Seed 10 Workers
    const workerNames = [
      'Rajesh Kumar', 'Priya Patel', 'Amit Singh', 'Sunita Devi',
      'Manoj Pradhan', 'Kavita Mohanty', 'Ravi Sharma', 'Deepa Nayak',
      'Suresh Behera', 'Anita Rath'
    ];

    const workers = [];
    for (let i = 0; i < 10; i++) {
      const zone = ZONES[i % ZONES.length];
      const platform = PLATFORMS[i % 2];
      const avgWeeklyEarnings = rand(1800, 3200);

      const worker = await Worker.create({
        name: workerNames[i],
        phone: `98765${String(i).padStart(5, '0')}`,
        email: `${workerNames[i].toLowerCase().replace(' ', '.')}@example.com`,
        password: 'Worker@1234',
        platform,
        zone: {
          city: 'Bhubaneswar',
          pincode: PINCODES[zone],
          area: zone,
          coordinates: ZONE_COORDS[zone]
        },
        avgWeeklyEarnings,
        workingDaysPerWeek: rand(5, 7),
        workingHoursPerDay: rand(8, 12),
        riskScore: rand(30, 80),
        riskProfile: `Worker in ${zone} zone with ${platform} platform. ${zone === 'Patia' || zone === 'Rasulgarh' ? 'Elevated' : 'Moderate'} disruption risk based on zone history.`,
        upiId: `${workerNames[i].toLowerCase().replace(' ', '')}@upi`,
        isVerified: true
      });
      workers.push(worker);
    }
    console.log(`👷 ${workers.length} workers created`);

    // Seed active policies for all workers
    const policies = [];
    for (let i = 0; i < workers.length; i++) {
      const tier = TIERS[i % 3];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - rand(1, 5));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      const policy = await Policy.create({
        workerId: workers[i]._id,
        tier,
        weeklyPremium: TIER_PREMIUMS[tier] + rand(-5, 10),
        maxWeeklyPayout: TIER_PAYOUTS[tier],
        activeTriggers: ['heavy_rain', 'extreme_heat', 'cyclone_storm', 'severe_pollution', 'zone_lockdown'],
        status: 'active',
        startDate,
        endDate,
        premiumBreakdown: {
          basePremium: TIER_PREMIUMS[tier],
          zoneRiskFactor: parseFloat((0.8 + Math.random() * 0.5).toFixed(2)),
          weatherForecastFactor: parseFloat((0.9 + Math.random() * 0.5).toFixed(2)),
          historyFactor: parseFloat((0.85 + Math.random() * 0.25).toFixed(2))
        },
        transactionId: `INS${Date.now()}${rand(100, 999)}`
      });
      policies.push(policy);
    }
    console.log(`📋 ${policies.length} active policies created`);

    // Seed 5 past disruption events
    const disruptionTypes = ['heavy_rain', 'extreme_heat', 'cyclone_storm', 'severe_pollution', 'zone_lockdown'];
    const disruptionReadings = [25, 45, 75, 320, 1];
    const disruptionUnits = ['mm/hr', 'celsius', 'km/hr', 'AQI', 'manual'];
    const disruptionSeverities = ['half_day', 'partial', 'half_day', 'partial', 'full_day'];
    const disruptionSources = ['OpenWeatherMap', 'OpenWeatherMap', 'OpenWeatherMap', 'OpenAQ', 'Manual Admin'];

    const events = [];
    for (let i = 0; i < 5; i++) {
      const daysAgo = rand(1, 20);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);

      const affectedZones = ZONES.slice(0, rand(2, 5));

      const event = await DisruptionEvent.create({
        type: disruptionTypes[i],
        city: 'Bhubaneswar',
        affectedZones,
        reading: disruptionReadings[i],
        unit: disruptionUnits[i],
        severity: disruptionSeverities[i],
        source: disruptionSources[i],
        affectedWorkerIds: workers.filter(w => affectedZones.includes(w.zone.area)).map(w => w._id),
        claimsTriggered: rand(1, 4),
        totalPayoutTriggered: rand(200, 800),
        timestamp
      });
      events.push(event);
    }
    console.log(`⚡ ${events.length} disruption events created`);

    // Seed 15 claims with distribution: 8 auto_approved/paid, 3 conditionally_approved, 3 flagged_fraud, 1 rejected
    const claimStatuses = [
      ...Array(8).fill('paid'),
      ...Array(3).fill('conditionally_approved'),
      ...Array(3).fill('flagged_fraud'),
      'rejected'
    ];

    let claimsCreated = 0;
    let payoutsCreated = 0;

    for (let i = 0; i < 15; i++) {
      const workerIndex = i % workers.length;
      const worker = workers[workerIndex];
      const policy = policies[workerIndex];
      const event = events[i % events.length];
      const status = claimStatuses[i];

      const dailyAvg = worker.avgWeeklyEarnings / worker.workingDaysPerWeek;
      const severityMultiplier = { full_day: 1.0, half_day: 0.5, partial: 0.3 }[event.severity];
      const payoutAmount = Math.min(parseFloat((dailyAvg * severityMultiplier).toFixed(2)), policy.maxWeeklyPayout);

      const fraudScore = status === 'paid' ? rand(0, 25) :
                         status === 'conditionally_approved' ? rand(35, 60) :
                         status === 'flagged_fraud' ? rand(72, 95) :
                         rand(50, 80);

      const createdAt = new Date(event.timestamp);
      createdAt.setHours(createdAt.getHours() + rand(0, 3));

      const claim = await Claim.create({
        workerId: worker._id,
        policyId: policy._id,
        disruptionEventId: event._id,
        triggerType: event.type,
        triggerValue: event.reading,
        triggerThreshold: { heavy_rain: 15, extreme_heat: 43, cyclone_storm: 60, severe_pollution: 300, zone_lockdown: 0 }[event.type],
        disruptionSeverity: event.severity,
        payoutAmount,
        status,
        fraudScore,
        fraudReasons: fraudScore > 50 ? ['Elevated claim frequency', 'Zone boundary proximity'] : [],
        fraudAnalysis: fraudScore > 50
          ? `Elevated risk indicators detected. Fraud score: ${fraudScore}/100.`
          : `No significant fraud signals detected. Claim appears legitimate. Score: ${fraudScore}/100.`,
        autoProcessed: status === 'paid',
        processedAt: ['paid', 'rejected'].includes(status) ? createdAt : null,
        createdAt
      });

      claimsCreated++;

      // Create payouts for paid claims
      if (status === 'paid') {
        await Payout.create({
          workerId: worker._id,
          claimId: claim._id,
          amount: payoutAmount,
          upiId: worker.upiId,
          transactionId: `INS${Date.now()}${rand(100, 999)}`,
          status: 'completed',
          processedAt: createdAt,
          createdAt
        });
        payoutsCreated++;
      }
    }
    console.log(`📝 ${claimsCreated} claims created (${payoutsCreated} with payouts)`);

    console.log('\n✅ Seed completed successfully!');
    console.log(`  Admin: admin@insurly.com / Admin@1234`);
    console.log(`  Workers: [name]@example.com / Worker@1234`);
    console.log(`  Example: rajesh.kumar@example.com / Worker@1234\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error stack:', error.stack);
    process.exit(1);
  }
};

seedDB();
