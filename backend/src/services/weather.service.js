const axios = require('axios');

/** @type {{ data: Object|null, timestamp: number }} */
let weatherCache = { data: null, timestamp: 0 };
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Get current weather data for Bhubaneswar from OpenWeatherMap API
 * Caches results for 10 minutes to avoid rate limiting
 * @returns {Promise<{ rain: number, temp: number, windSpeed: number, humidity: number, description: string, icon: string }>}
 */
const getCurrentWeather = async () => {
  const now = Date.now();

  if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_DURATION_MS) {
    return weatherCache.data;
  }

  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const lat = process.env.BHUBANESWAR_LAT || '20.2961';
    const lon = process.env.BHUBANESWAR_LON || '85.8245';

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      rain: response.data.rain ? (response.data.rain['1h'] || response.data.rain['3h'] || 0) : 0,
      temp: response.data.main?.temp || 0,
      feelsLike: response.data.main?.feels_like || 0,
      humidity: response.data.main?.humidity || 0,
      windSpeed: (response.data.wind?.speed || 0) * 3.6, // Convert m/s to km/hr
      description: response.data.weather?.[0]?.description || 'N/A',
      icon: response.data.weather?.[0]?.icon || '01d',
      visibility: response.data.visibility || 10000,
      clouds: response.data.clouds?.all || 0
    };

    weatherCache = { data: weatherData, timestamp: now };
    return weatherData;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Weather API error:`, error.message);
    // Return safe defaults on error
    return {
      rain: 0, temp: 30, feelsLike: 32, humidity: 60,
      windSpeed: 10, description: 'unavailable', icon: '01d',
      visibility: 10000, clouds: 0
    };
  }
};

/**
 * Get 7-day weather forecast for Bhubaneswar
 * @returns {Promise<Array<{ date: string, tempMax: number, tempMin: number, rain: number, windSpeed: number, description: string }>>}
 */
const getWeatherForecast = async () => {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const lat = process.env.BHUBANESWAR_LAT || '20.2961';
    const lon = process.env.BHUBANESWAR_LON || '85.8245';

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const dailyForecasts = [];
    const processedDates = new Set();

    for (const item of response.data.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!processedDates.has(date)) {
        processedDates.add(date);
        dailyForecasts.push({
          date,
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          rain: item.rain ? (item.rain['3h'] || 0) : 0,
          windSpeed: (item.wind?.speed || 0) * 3.6,
          description: item.weather?.[0]?.description || 'N/A'
        });
      }
    }

    return dailyForecasts.slice(0, 7);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Forecast API error:`, error.message);
    return [];
  }
};

/**
 * Calculate weather forecast severity factor for premium calculation
 * @returns {Promise<number>} Factor between 0.9 and 1.4
 */
const getWeatherForecastFactor = async () => {
  const forecast = await getWeatherForecast();
  if (forecast.length === 0) return 1.0;

  let riskPoints = 0;
  for (const day of forecast) {
    if (day.rain > 15) riskPoints += 2;
    if (day.tempMax > 43) riskPoints += 2;
    if (day.windSpeed > 60) riskPoints += 3;
    if (day.rain > 5) riskPoints += 1;
    if (day.tempMax > 40) riskPoints += 1;
  }

  const maxPoints = forecast.length * 5;
  const normalizedRisk = Math.min(riskPoints / maxPoints, 1);
  return 0.9 + (normalizedRisk * 0.5); // Range: 0.9 to 1.4
};

/**
 * Clear the weather cache (for testing)
 */
const clearWeatherCache = () => {
  weatherCache = { data: null, timestamp: 0 };
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherForecastFactor,
  clearWeatherCache
};
