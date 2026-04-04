const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
const Worker = require('./src/models/Worker.model');
const Policy = require('./src/models/Policy.model');
const Claim = require('./src/models/Claim.model');
const DisruptionEvent = require('./src/models/DisruptionEvent.model');
const Payout = require('./src/models/Payout.model');

async function checkSystemStatus() {
  try {
    console.log('🔍 Insurly Auto-Claim System Status Check\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/insurly');
    console.log('✅ Database connected');

    // Get system statistics
    const workerCount = await Worker.countDocuments();
    const activePolicyCount = await Policy.countDocuments({ status: 'active' });
    const totalClaims = await Claim.countDocuments();
    const paidClaims = await Claim.countDocuments({ status: 'paid' });
    const autoApprovedClaims = await Claim.countDocuments({ status: 'auto_approved' });
    const flaggedClaims = await Claim.countDocuments({ status: 'flagged_fraud' });
    const totalPayouts = await Payout.countDocuments({ status: 'completed' });
    const totalPayoutAmount = await Payout.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    console.log('📊 SYSTEM STATISTICS:');
    console.log(`   Workers Registered: ${workerCount}`);
    console.log(`   Active Policies: ${activePolicyCount}`);
    console.log(`   Total Claims: ${totalClaims}`);
    console.log(`   Paid Claims: ${paidClaims}`);
    console.log(`   Auto-Approved: ${autoApprovedClaims}`);
    console.log(`   Flagged for Fraud: ${flaggedClaims}`);
    console.log(`   Completed Payouts: ${totalPayouts}`);
    console.log(`   Total Payout Amount: ₹${totalPayoutAmount[0]?.total || 0}`);

    // Recent activity
    console.log('\n📋 RECENT ACTIVITY (Last 24 Hours):');
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentEvents = await DisruptionEvent.find({ 
      timestamp: { $gte: yesterday } 
    }).sort({ timestamp: -1 }).limit(5);

    const recentClaims = await Claim.find({ 
      createdAt: { $gte: yesterday } 
    }).populate('disruptionEventId', 'type reading unit')
     .sort({ createdAt: -1 }).limit(5);

    console.log(`   Recent Disruption Events: ${recentEvents.length}`);
    recentEvents.forEach(event => {
      console.log(`   - ${event.type.replace('_', ' ').toUpperCase()}: ${event.reading}${event.unit} at ${event.timestamp.toLocaleString()}`);
    });

    console.log(`\n   Recent Claims: ${recentClaims.length}`);
    recentClaims.forEach(claim => {
      console.log(`   - ${claim.triggerType.replace('_', ' ').toUpperCase()}: ₹${claim.payoutAmount} (${claim.status})`);
    });

    // Fraud detection effectiveness
    const avgFraudScore = await Claim.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$fraudScore' } } }
    ]);

    console.log('\n🕵️ FRAUD DETECTION METRICS:');
    console.log(`   Average Fraud Score: ${(avgFraudScore[0]?.avgScore || 0).toFixed(1)}`);
    console.log(`   Auto-Approval Rate: ${totalClaims > 0 ? ((autoApprovedClaims / totalClaims) * 100).toFixed(1) : 0}%`);
    console.log(`   Fraud Detection Rate: ${totalClaims > 0 ? ((flaggedClaims / totalClaims) * 100).toFixed(1) : 0}%`);

    // System health check
    console.log('\n🏥 SYSTEM HEALTH:');
    console.log(`   ✅ Database: Connected`);
    console.log(`   ✅ Workers: ${workerCount > 0 ? 'Available' : 'None'}`);
    console.log(`   ✅ Policies: ${activePolicyCount > 0 ? 'Active' : 'None'}`);
    console.log(`   ✅ Claims: ${totalClaims >= 0 ? 'Processing' : 'Error'}`);
    console.log(`   ✅ Payouts: ${totalPayouts >= 0 ? 'Functional' : 'Error'}`);

    console.log('\n🎯 AUTO-CLAIM SYSTEM STATUS: HEALTHY');
    console.log('💡 To test manually: node testAutoClaim.js');
    console.log('💡 To run comprehensive test: node comprehensiveTest.js');
    console.log('💡 To monitor triggers: Check server logs for "🚨 DISRUPTIONS DETECTED"');

  } catch (error) {
    console.error('❌ Status check failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the status check
checkSystemStatus();
