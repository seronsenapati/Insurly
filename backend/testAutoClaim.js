const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models and services
const DisruptionEvent = require('./src/models/DisruptionEvent.model');
const Worker = require('./src/models/Worker.model');
const Policy = require('./src/models/Policy.model');
const Claim = require('./src/models/Claim.model');
const { autoCreateClaims } = require('./src/services/claims.service');

async function testAutoClaim() {
  try {
    console.log('🚀 Starting Auto-Claim System Test...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/insurly');
    console.log('✅ Connected to MongoDB');

    // Check for existing workers and policies
    const worker = await Worker.findOne();
    if (!worker) {
      console.log('❌ No workers found. Please register a worker first.');
      process.exit(1);
    }
    console.log(`✅ Found worker: ${worker.name} in zone: ${worker.zone.area}`);

    const policy = await Policy.findOne({ workerId: worker._id, status: 'active' });
    if (!policy) {
      console.log('❌ No active policy found. Please purchase a policy first.');
      process.exit(1);
    }
    console.log(`✅ Found active policy: ${policy.tier} tier, ₹${policy.weeklyPremium}/week`);

    // Create a test disruption event
    console.log('\n🌧️ Creating test HEAVY_RAIN disruption event...');
    const event = await DisruptionEvent.create({
      type: 'heavy_rain',
      city: 'Bhubaneswar',
      affectedZones: [worker.zone.area],
      reading: 25, // Above threshold of 15mm/hr
      unit: 'mm/hr',
      severity: 'half_day',
      source: 'Manual Admin'
    });
    
    console.log(`✅ DisruptionEvent created: ${event._id}`);
    console.log(`   - Type: ${event.type}`);
    console.log(`   - Reading: ${event.reading}${event.unit}`);
    console.log(`   - Affected Zones: ${event.affectedZones.join(', ')}`);

    // Test auto-claim creation
    console.log('\n🤖 Testing auto-claim creation...');
    const result = await autoCreateClaims(event);
    
    console.log('\n📊 AUTO-CLAIM RESULTS:');
    console.log(`   - Claims Created: ${result.claimsCreated}`);
    console.log(`   - Payouts Processed: ${result.payoutsProcessed}`);
    console.log(`   - Total Payout Amount: ₹${result.totalPayoutAmount}`);

    // Verify claim was created
    if (result.claimsCreated > 0) {
      const claim = await Claim.findOne({ disruptionEventId: event._id });
      if (claim) {
        console.log('\n📋 CLAIM DETAILS:');
        console.log(`   - Claim ID: ${claim._id}`);
        console.log(`   - Worker: ${worker.name}`);
        console.log(`   - Status: ${claim.status}`);
        console.log(`   - Fraud Score: ${claim.fraudScore}`);
        console.log(`   - Payout Amount: ₹${claim.payoutAmount}`);
        console.log(`   - Auto Processed: ${claim.autoProcessed ? 'Yes' : 'No'}`);
        
        if (claim.fraudReasons && claim.fraudReasons.length > 0) {
          console.log(`   - Fraud Reasons: ${claim.fraudReasons.join(', ')}`);
        }
      }
    }

    console.log('\n✅ Auto-claim system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the test
testAutoClaim();
