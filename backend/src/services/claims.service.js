const Claim = require('../models/Claim.model');
const Policy = require('../models/Policy.model');
const Worker = require('../models/Worker.model');
const Payout = require('../models/Payout.model');
const DisruptionEvent = require('../models/DisruptionEvent.model');
const { runAllFraudChecks, getClaimStatusFromFraudScore } = require('./fraud.service');
const { processPayout } = require('./payout.service');
const { calculatePayout } = require('../utils/payoutCalculator');

/**
 * Auto-create claims for all affected workers when a disruption event occurs
 * @param {Object} disruptionEvent - The disruption event document
 * @returns {Promise<{ claimsCreated: number, payoutsProcessed: number, totalPayoutAmount: number }>}
 */
const autoCreateClaims = async (disruptionEvent) => {
  let claimsCreated = 0;
  let payoutsProcessed = 0;
  let totalPayoutAmount = 0;

  try {
    // Find all workers in affected zones with active policies
    const affectedWorkers = await Worker.find({
      'zone.area': { $in: disruptionEvent.affectedZones }
    });

    const workerIds = affectedWorkers.map(w => w._id);

    // Find active policies for these workers
    const activePolicies = await Policy.find({
      workerId: { $in: workerIds },
      status: 'active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
      activeTriggers: disruptionEvent.type
    });


    for (const policy of activePolicies) {
      try {
        const worker = affectedWorkers.find(w => w._id.toString() === policy.workerId.toString());
        if (!worker) continue;

        // Calculate payout amount
        const payoutAmount = calculatePayout(
          worker.avgWeeklyEarnings,
          worker.workingDaysPerWeek,
          disruptionEvent.severity,
          policy.maxWeeklyPayout
        );

        // Determine trigger threshold
        const thresholds = {
          heavy_rain: 15, extreme_heat: 43,
          cyclone_storm: 60, severe_pollution: 300, zone_lockdown: 0
        };

        // Run fraud checks
        const tempClaim = { 
          id: 'temp',
          triggerType: disruptionEvent.type,
          createdAt: new Date()
        };
        const fraudResult = await runAllFraudChecks(worker, policy, tempClaim, disruptionEvent);
        
        // Log fraud check results for debugging
        console.log(`[${new Date().toISOString()}] 🕵️ Fraud check for ${worker.name}: Score ${fraudResult.fraudScore}, Reasons: ${fraudResult.fraudReasons.join(', ')}`);
        
        // Skip if duplicate claim detected (fraud score 100)
        if (fraudResult.fraudScore >= 100) {
          console.log(`[${new Date().toISOString()}] ⚠️ Skipping duplicate claim for ${worker.name}`);
          continue;
        }

        const claimStatus = getClaimStatusFromFraudScore(fraudResult.fraudScore);

        console.log(`[${new Date().toISOString()}] 📋 Creating claim for ${worker.name}: ${claimStatus}, Amount: ₹${payoutAmount}`);

        // Create claim
        const claim = await Claim.create({
          workerId: worker._id,
          policyId: policy._id,
          disruptionEventId: disruptionEvent._id,
          triggerType: disruptionEvent.type,
          triggerValue: disruptionEvent.reading,
          triggerThreshold: thresholds[disruptionEvent.type] || 0,
          disruptionSeverity: disruptionEvent.severity,
          payoutAmount,
          status: claimStatus,
          fraudScore: fraudResult.fraudScore,
          fraudReasons: fraudResult.fraudReasons,
          fraudAnalysis: JSON.stringify(fraudResult.checkResults),
          autoProcessed: ['auto_approved', 'conditionally_approved'].includes(claimStatus),
          processedAt: ['auto_approved', 'conditionally_approved'].includes(claimStatus) ? new Date() : null
        });

        claimsCreated++;

        // Auto-process payout for auto_approved and conditionally_approved claims
        if (['auto_approved', 'conditionally_approved'].includes(claimStatus)) {
          try {
            const payoutResult = await processPayout(
              worker._id.toString(),
              payoutAmount,
              worker.upiId || 'default@upi'
            );

            await Payout.create({
              workerId: worker._id,
              claimId: claim._id,
              amount: payoutAmount,
              upiId: worker.upiId || 'default@upi',
              transactionId: payoutResult.transactionId,
              status: 'completed',
              processedAt: payoutResult.processedAt
            });

            // Update claim status to paid
            claim.status = 'paid';
            await claim.save();

            payoutsProcessed++;
            totalPayoutAmount += payoutAmount;
            console.log(`[${new Date().toISOString()}] ✅ Payout completed for ${worker.name}: ₹${payoutAmount} to ${worker.upiId}`);

          } catch (payoutError) {
            console.error(`[${new Date().toISOString()}] ❌ Payout failed for ${worker.name}:`, payoutError.message);
            // Create failed payout record
            await Payout.create({
              workerId: worker._id,
              claimId: claim._id,
              amount: payoutAmount,
              upiId: worker.upiId || 'default@upi',
              transactionId: `FAILED_${Date.now()}`,
              status: 'failed',
              processedAt: new Date()
            });
          }
        } else {
          console.log(`[${new Date().toISOString()}] ⏳ Claim ${claim._id} status: ${claimStatus} - requires manual review`);
        }
      } catch (workerError) {
        console.error(`[${new Date().toISOString()}] ❌ Error processing worker:`, workerError.message);
      }
    }

    // Update disruption event with stats
    disruptionEvent.affectedWorkerIds = workerIds;
    disruptionEvent.claimsTriggered = claimsCreated;
    disruptionEvent.totalPayoutTriggered = totalPayoutAmount;
    await disruptionEvent.save();

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Auto-create claims error:`, error.message);
  }

  return { claimsCreated, payoutsProcessed, totalPayoutAmount };
};

module.exports = {
  autoCreateClaims
};

