const app = require('./app');
const connectDB = require('./src/config/db');
const { trainPremiumNetwork } = require('./src/services/brainjs.service');
const { startTriggerMonitor } = require('./src/jobs/triggerMonitor.job');

const PORT = process.env.PORT || 5000;

/**
 * Start the Insurly backend server
 */
const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB
    await connectDB();

    // Step 2: Train the premium neural network
    trainPremiumNetwork();

    // Step 3: Start the trigger monitor cron job
    startTriggerMonitor();

    // Step 4: Start listening
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`  🛡️  INSURLY API SERVER`);
      console.log(`  📍  http://localhost:${PORT}`);
      console.log(`  🌍  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  ⏰  Started at: ${new Date().toISOString()}`);
      console.log(`${'='.repeat(60)}\n`);
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Server startup error:`, error.message);
    process.exit(1);
  }
};

startServer();
