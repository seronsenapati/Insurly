const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Test registration directly
async function testRegistration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Worker = require('./src/models/Worker.model');
    
    // Test worker data
    const testWorker = {
      name: 'Test User',
      phone: '9876543210',
      email: 'testuser@example.com',
      password: 'password123',
      platform: 'zomato',
      zone: {
        area: 'Patia',
        pincode: '751024',
        city: 'Bhubaneswar'
      },
      avgWeeklyEarnings: 5000,
      workingDaysPerWeek: 6,
      workingHoursPerDay: 8,
      upiId: 'testuser@ybl'
    };

    console.log('Creating test worker:', testWorker);
    
    // Check if worker already exists
    const existing = await Worker.findOne({ 
      $or: [{ email: testWorker.email }, { phone: testWorker.phone }] 
    });
    
    if (existing) {
      console.log('⚠️ Worker already exists:', existing.email);
      await Worker.deleteOne({ email: testWorker.email });
      console.log('🗑️ Deleted existing worker');
    }

    // Create new worker
    const worker = await Worker.create(testWorker);
    console.log('✅ Worker created successfully:', worker._id);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
    console.error('Full error:', error);
  }
}

testRegistration();
