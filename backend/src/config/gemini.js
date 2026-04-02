const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Initialize Google Gemini AI client
 * @returns {{ model: GenerativeModel, isConfigured: boolean }}
 */
const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key') {
    console.warn(`[${new Date().toISOString()}] ⚠️ Gemini API key not configured — using rule-based fallback`);
    return { model: null, isConfigured: false };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    return { model, isConfigured: true };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Gemini initialization error:`, error.message);
    return { model: null, isConfigured: false };
  }
};

module.exports = initGemini;
