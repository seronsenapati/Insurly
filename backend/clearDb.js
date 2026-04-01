require('dotenv').config();
const connectDB = require('./src/config/db');

const clearData = async () => {
  try {
    await connectDB();
    console.log('Clearing data... keeping Admin data intact.');
    const Claim = require('./src/models/Claim.model');
    const DisruptionEvent = require('./src/models/DisruptionEvent.model');
    const Payout = require('./src/models/Payout.model');
    const Policy = require('./src/models/Policy.model');
    const Worker = require('./src/models/Worker.model');
    
    await Claim.deleteMany({});
    await DisruptionEvent.deleteMany({});
    await Payout.deleteMany({});
    await Policy.deleteMany({});
    await Worker.deleteMany({});
    
    console.log('Data cleared successfully (Admin data untouched).');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

clearData();
