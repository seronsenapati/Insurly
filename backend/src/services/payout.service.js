/**
 * Mock Payment Service
 * Complete mock payment service — no external gateway, no API key, no signup required
 * Simulates payment processing with realistic delays and success rates
 */

/**
 * Process a mock payout to a worker's UPI ID
 * @param {string} workerId - Worker's MongoDB ObjectId
 * @param {number} amount - Payout amount in INR
 * @param {string} upiId - Worker's UPI ID
 * @returns {Promise<{ success: boolean, transactionId: string, amount: number, upiId: string, status: string, processedAt: Date, mode: string, bank: string, message: string }>}
 */
const processPayout = async (workerId, amount, upiId) => {
  // Simulate 2 second processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 95% success rate
  const isSuccess = Math.random() > 0.05;

  if (!isSuccess) {
    throw new Error('Payment processing failed — please retry');
  }

  const transactionId = `INS${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;

  return {
    success: true,
    transactionId,
    amount,
    upiId,
    status: 'completed',
    processedAt: new Date(),
    mode: 'UPI',
    bank: 'Mock Bank',
    message: `Payout of Rs ${amount} successfully sent to ${upiId}`
  };
};

/**
 * Process a mock premium payment (for policy purchase)
 * @param {string} workerId - Worker's MongoDB ObjectId
 * @param {number} amount - Premium amount in INR
 * @param {string} paymentMethod - Payment method (default: UPI)
 * @returns {Promise<{ success: boolean, transactionId: string, amount: number, status: string, processedAt: Date }>}
 */
const processPayment = async (workerId, amount, paymentMethod = 'UPI') => {
  // Simulate 2 second processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 95% success rate
  const isSuccess = Math.random() > 0.05;

  if (!isSuccess) {
    throw new Error('Payment processing failed — please retry');
  }

  const transactionId = `INS${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;

  return {
    success: true,
    transactionId,
    amount,
    status: 'completed',
    processedAt: new Date(),
    mode: paymentMethod,
    bank: 'Mock Bank',
    message: `Payment of Rs ${amount} received successfully`
  };
};

module.exports = {
  processPayout,
  processPayment
};
