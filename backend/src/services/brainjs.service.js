/**
 * Lightweight Neural Network for dynamic premium calculation
 * Custom implementation — replaces brain.js to avoid native dependency issues on Windows
 * Implements a simple feedforward neural network with backpropagation
 */

class NeuralNetwork {
  /**
   * @param {{ inputSize: number, hiddenSize: number, outputSize: number, learningRate: number }} options
   */
  constructor({ inputSize = 7, hiddenSize = 10, outputSize = 1, learningRate = 0.1 } = {}) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    this.learningRate = learningRate;

    // Initialize weights with Xavier initialization
    this.weightsIH = this._initMatrix(inputSize, hiddenSize);
    this.biasH = new Array(hiddenSize).fill(0);
    this.weightsHO = this._initMatrix(hiddenSize, outputSize);
    this.biasO = new Array(outputSize).fill(0);
    this.trained = false;
  }

  /**
   * Initialize weight matrix with Xavier/Glorot initialization
   * @param {number} rows
   * @param {number} cols
   * @returns {number[][]}
   */
  _initMatrix(rows, cols) {
    const scale = Math.sqrt(2.0 / (rows + cols));
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() * 2 - 1) * scale)
    );
  }

  /** @param {number} x */
  _sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); }

  /** @param {number} x */
  _sigmoidDerivative(x) { return x * (1 - x); }

  /**
   * Forward pass through the network
   * @param {number[]} inputs
   * @returns {{ hidden: number[], output: number[] }}
   */
  _forward(inputs) {
    const hidden = this.biasH.map((bias, j) => {
      let sum = bias;
      for (let i = 0; i < this.inputSize; i++) {
        sum += inputs[i] * this.weightsIH[i][j];
      }
      return this._sigmoid(sum);
    });

    const output = this.biasO.map((bias, k) => {
      let sum = bias;
      for (let j = 0; j < this.hiddenSize; j++) {
        sum += hidden[j] * this.weightsHO[j][k];
      }
      return this._sigmoid(sum);
    });

    return { hidden, output };
  }

  /**
   * Train the network on a dataset
   * @param {Array<{ input: number[], output: number[] }>} trainingData
   * @param {{ iterations: number, errorThresh: number }} options
   */
  train(trainingData, { iterations = 5000, errorThresh = 0.005 } = {}) {
    for (let epoch = 0; epoch < iterations; epoch++) {
      let totalError = 0;

      for (const sample of trainingData) {
        const { hidden, output } = this._forward(sample.input);

        // Calculate output error
        const outputErrors = sample.output.map((target, k) => target - output[k]);
        totalError += outputErrors.reduce((sum, err) => sum + err * err, 0);

        // Output layer gradients
        const outputDeltas = outputErrors.map((err, k) => err * this._sigmoidDerivative(output[k]));

        // Hidden layer error
        const hiddenErrors = hidden.map((_, j) => {
          let err = 0;
          for (let k = 0; k < this.outputSize; k++) {
            err += outputDeltas[k] * this.weightsHO[j][k];
          }
          return err;
        });

        const hiddenDeltas = hiddenErrors.map((err, j) => err * this._sigmoidDerivative(hidden[j]));

        // Update weights: hidden -> output
        for (let j = 0; j < this.hiddenSize; j++) {
          for (let k = 0; k < this.outputSize; k++) {
            this.weightsHO[j][k] += this.learningRate * outputDeltas[k] * hidden[j];
          }
        }
        for (let k = 0; k < this.outputSize; k++) {
          this.biasO[k] += this.learningRate * outputDeltas[k];
        }

        // Update weights: input -> hidden
        for (let i = 0; i < this.inputSize; i++) {
          for (let j = 0; j < this.hiddenSize; j++) {
            this.weightsIH[i][j] += this.learningRate * hiddenDeltas[j] * sample.input[i];
          }
        }
        for (let j = 0; j < this.hiddenSize; j++) {
          this.biasH[j] += this.learningRate * hiddenDeltas[j];
        }
      }

      const avgError = totalError / trainingData.length;
      if (avgError < errorThresh) {
        break;
      }
    }
    this.trained = true;
  }

  /**
   * Run inference on the trained network
   * @param {number[]} inputs
   * @returns {number[]}
   */
  run(inputs) {
    if (!this.trained) {
      console.warn('Neural network not trained yet — returning default');
      return [0.5];
    }
    return this._forward(inputs).output;
  }
}

/** @type {NeuralNetwork|null} */
let premiumNetwork = null;

/** Zone risk scores for Bhubaneswar areas */
const ZONE_RISK_SCORES = {
  'Patia': 0.75,
  'Nayapalli': 0.65,
  'Saheed Nagar': 0.60,
  'Khandagiri': 0.55,
  'Rasulgarh': 0.70,
  'Unit-4': 0.50,
  'Chandrasekharpur': 0.45
};

/**
 * Generate synthetic training data for the premium network
 * @param {number} count - Number of samples to generate
 * @returns {Array<{ input: number[], output: number[] }>}
 */
const generateTrainingData = (count = 500) => {
  const samples = [];

  for (let i = 0; i < count; i++) {
    const zoneRisk = Math.random();
    const avgEarnings = Math.random();
    const rainProb = Math.random();
    const maxTemp = Math.random();
    const seasonIndex = Math.random();
    const claimHistory = Math.random();
    const platformRisk = Math.random() > 0.5 ? 0.5 : 0.5;

    // Calculate expected premium multiplier based on features
    const riskScore = (zoneRisk * 0.25) + (rainProb * 0.2) + (maxTemp * 0.15) +
                      (seasonIndex * 0.2) + (claimHistory * 0.15) + ((1 - avgEarnings) * 0.05);

    // Map risk score to premium multiplier (0.5 to 2.0)
    // Higher risk = higher premium; output is sigmoid so target between 0 and 1
    // We map 0.5-2.0 to 0-1 range: (multiplier - 0.5) / 1.5
    const multiplier = 0.5 + (riskScore * 1.5);
    const normalizedOutput = (multiplier - 0.5) / 1.5;

    samples.push({
      input: [zoneRisk, avgEarnings, rainProb, maxTemp, seasonIndex, claimHistory, platformRisk],
      output: [Math.max(0.01, Math.min(0.99, normalizedOutput))]
    });
  }

  return samples;
};

/**
 * Initialize and train the premium neural network
 * Should be called once on server startup
 */
const trainPremiumNetwork = () => {

  premiumNetwork = new NeuralNetwork({
    inputSize: 7,
    hiddenSize: 12,
    outputSize: 1,
    learningRate: 0.3
  });

  const trainingData = generateTrainingData(500);
  premiumNetwork.train(trainingData, { iterations: 3000, errorThresh: 0.01 });

};

/**
 * Calculate premium multiplier using the trained neural network
 * @param {{ zoneRisk: number, avgEarnings: number, rainProb: number, maxTemp: number, seasonIndex: number, claimHistory: number, platformRisk: number }} features
 * @returns {number} Premium multiplier between 0.5 and 2.0
 */
const calculatePremiumMultiplier = (features) => {
  if (!premiumNetwork || !premiumNetwork.trained) {
    console.warn('Neural network not trained — using rule-based fallback');
    return calculateFallbackMultiplier(features);
  }

  const input = [
    features.zoneRisk || 0.5,
    features.avgEarnings || 0.5,
    features.rainProb || 0.3,
    features.maxTemp || 0.5,
    features.seasonIndex || 0.5,
    features.claimHistory || 0,
    features.platformRisk || 0.5
  ];

  const result = premiumNetwork.run(input);
  // Convert back from sigmoid range to 0.5-2.0
  const multiplier = (result[0] * 1.5) + 0.5;
  return Math.max(0.5, Math.min(2.0, parseFloat(multiplier.toFixed(2))));
};

/**
 * Rule-based fallback for premium calculation
 * @param {{ zoneRisk: number, avgEarnings: number, rainProb: number, maxTemp: number, seasonIndex: number, claimHistory: number }} features
 * @returns {number}
 */
const calculateFallbackMultiplier = (features) => {
  const base = 1.0;
  const zoneAdjust = (features.zoneRisk - 0.5) * 0.6;
  const weatherAdjust = ((features.rainProb || 0) + (features.maxTemp || 0)) * 0.2;
  const seasonAdjust = (features.seasonIndex || 0) * 0.3;
  const historyAdjust = (features.claimHistory || 0) * 0.2;

  const multiplier = base + zoneAdjust + weatherAdjust + seasonAdjust - historyAdjust;
  return Math.max(0.5, Math.min(2.0, parseFloat(multiplier.toFixed(2))));
};

/**
 * Get the current season index for Bhubaneswar
 * Monsoon (June-Sept) = 1.0, Pre-monsoon (Apr-May) = 0.7, Post-monsoon (Oct-Nov) = 0.5, Winter (Dec-Mar) = 0.3
 * @returns {number}
 */
const getSeasonIndex = () => {
  const month = new Date().getMonth(); // 0-indexed
  if (month >= 5 && month <= 8) return 1.0;   // June-Sept: Monsoon
  if (month >= 3 && month <= 4) return 0.7;   // Apr-May: Pre-monsoon
  if (month >= 9 && month <= 10) return 0.5;  // Oct-Nov: Post-monsoon
  return 0.3;                                   // Dec-Mar: Winter
};

module.exports = {
  trainPremiumNetwork,
  calculatePremiumMultiplier,
  getSeasonIndex,
  ZONE_RISK_SCORES,
  NeuralNetwork
};
