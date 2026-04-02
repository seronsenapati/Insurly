const axios = require('axios');

/** @type {{ data: Object|null, timestamp: number }} */
let aqiCache = { data: null, timestamp: 0 };
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Get current AQI data for Bhubaneswar from OpenAQ API
 * No API key needed — completely free
 * @returns {Promise<{ aqi: number, pm25: number, pm10: number, source: string }>}
 */
const getCurrentAQI = async () => {
  const now = Date.now();

  if (aqiCache.data && (now - aqiCache.timestamp) < CACHE_DURATION_MS) {
    return aqiCache.data;
  }

  try {
    // Try Open-Meteo Air Quality API for Bhubaneswar
    const response = await axios.get(
      'https://air-quality-api.open-meteo.com/v1/air-quality', {
        params: {
          latitude: 20.2961,
          longitude: 85.8245,
          current: 'pm10,pm2_5'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data.current) {
      const pm25Value = response.data.current.pm2_5 || 0;
      const pm10Value = response.data.current.pm10 || 0;

      // Convert PM2.5 to approximate AQI using EPA breakpoints
      const aqiValue = calculateAQIFromPM25(pm25Value);

      const aqiData = {
        aqi: aqiValue,
        pm25: pm25Value,
        pm10: pm10Value,
        source: 'Open-Meteo',
        lastUpdated: response.data.current.time || new Date().toISOString()
      };

      aqiCache = { data: aqiData, timestamp: now };
      return aqiData;
    }

    // Fallback if no data available
    return getDefaultAQI();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ AQI API error:`, error.message);
    return getDefaultAQI();
  }
};

/**
 * Convert PM2.5 concentration to AQI using EPA breakpoints
 * @param {number} pm25 - PM2.5 concentration in µg/m³
 * @returns {number} AQI value
 */
const calculateAQIFromPM25 = (pm25) => {
  const breakpoints = [
    { cLow: 0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 }
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow
      );
    }
  }

  return pm25 > 500 ? 500 : 0;
};

/**
 * Get default AQI when API is unavailable
 * @returns {{ aqi: number, pm25: number, pm10: number, source: string }}
 */
const getDefaultAQI = () => ({
  aqi: 85,
  pm25: 28,
  pm10: 45,
  source: 'Default (API unavailable)',
  lastUpdated: new Date().toISOString()
});

/**
 * Clear AQI cache (for testing)
 */
const clearAQICache = () => {
  aqiCache = { data: null, timestamp: 0 };
};

module.exports = {
  getCurrentAQI,
  calculateAQIFromPM25,
  clearAQICache
};
