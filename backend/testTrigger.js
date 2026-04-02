const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const DisruptionEvent = require('./src/models/DisruptionEvent.model');
const Worker = require('./src/models/Worker.model');
const Policy = require('./src/models/Policy.model');
const { autoCreateClaims } = require('./src/services/claims.service');

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/insurly');
  
  const worker = await Worker.findOne();
  console.log('Worker:', worker ? worker.name : 'No worker');
  
  const policy = await Policy.findOne({ workerId: worker?._id, status: 'active' });
  console.log('Policy:', policy ? policy._id : 'No policy');
  if (worker) console.log('Worker Zone:', worker.zone);
  
  const event = await DisruptionEvent.create({
    type: 'heavy_rain',
    city: 'Bhubaneswar',
    affectedZones: ['Patia', 'Nayapalli', 'Saheed Nagar'],
    reading: 20,
    unit: 'mm/hr',
    severity: 'high',
    source: 'Manual Admin'
  });
  
  console.log('Event:', event._id);
  
  const result = await autoCreateClaims(event);
  console.log('Result:', result);
  process.exit(0);
}
run().catch(console.error);
