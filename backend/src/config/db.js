const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[${new Date().toISOString()}] ✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ MongoDB connection error:`, error.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log(`[${new Date().toISOString()}] ⚠️ MongoDB disconnected`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] ❌ MongoDB error:`, err.message);
});

module.exports = connectDB;
