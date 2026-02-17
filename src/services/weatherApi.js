
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.tomorrow.io/v4/weather/forecast';

/**
 * Fetch weather forecast for a location
 * @param {string} location - Location name (e.g., "new york", "london")
 * @param {string} timesteps - Comma-separated timesteps (e.g., "1m,1h,1d")
 * @returns {Promise<Object>} Weather data
 */
export const getWeatherForecast = async (location, timesteps = '1h,1d') => {
  try {
    const url = `${BASE_URL}?location=${encodeURIComponent(location)}&timesteps=${timesteps}&apikey=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'accept-encoding': 'deflate, gzip, br'
      }
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Get current weather conditions
 * @param {string} location - Location name
 * @returns {Promise<Object>} Current weather data
 */
export const getCurrentWeather = async (location) => {
  try {
    const data = await getWeatherForecast(location, '1h');
    
    if (data.timelines?.hourly && data.timelines.hourly.length > 0) {
      // Extract city name from full location string
      const locationName = data.location?.name || location;
      const cityName = locationName.split(',')[0].trim();
      
      return {
        location: {
          ...data.location,
          cityName: cityName
        },
        current: data.timelines.hourly[0],
        timestamp: new Date(data.timelines.hourly[0].time)
      };
    }
    
    throw new Error('No weather data available');
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

/**
 * Get weather by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} timesteps - Comma-separated timesteps
 * @returns {Promise<Object>} Weather data
 */
export const getWeatherByCoordinates = async (lat, lon, timesteps = '1h,1d') => {
  try {
    const location = `${lat},${lon}`;
    return await getWeatherForecast(location, timesteps);
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};

/**
 * Get user's location weather
 * @returns {Promise<Object>} Weather data for user's location
 */
export const getUserLocationWeather = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherByCoordinates(latitude, longitude);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(new Error('Unable to retrieve your location'));
      }
    );
  });
};

/**
 * Weather code descriptions
 * @param {number} code - Weather code
 * @returns {string} Weather description
 */
export const getWeatherDescription = (code) => {
  const weatherCodes = {
    1000: 'Clear',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    1001: 'Cloudy',
    2000: 'Fog',
    2100: 'Light Fog',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6001: 'Freezing Rain',
    6200: 'Light Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Heavy Ice Pellets',
    7102: 'Light Ice Pellets',
    8000: 'Thunderstorm'
  };

  return weatherCodes[code] || 'Unknown';
};

/**
 * Get weather icon based on weather code
 * @param {number} code - Weather code
 * @returns {string} Icon name or emoji
 */
export const getWeatherIcon = (code) => {
  const iconMap = {
    1000: '☀️',
    1100: '🌤️',
    1101: '⛅',
    1102: '🌥️',
    1001: '☁️',
    2000: '🌫️',
    2100: '🌫️',
    4000: '🌦️',
    4001: '🌧️',
    4200: '🌦️',
    4201: '⛈️',
    5000: '❄️',
    5001: '🌨️',
    5100: '🌨️',
    5101: '❄️',
    6000: '🌧️',
    6001: '🌧️',
    6200: '🌧️',
    6201: '🌧️',
    7000: '🧊',
    7101: '🧊',
    7102: '🧊',
    8000: '⛈️'
  };

  return iconMap[code] || '🌡️';
};

export default {
  getWeatherForecast,
  getCurrentWeather,
  getWeatherByCoordinates,
  getUserLocationWeather,
  getWeatherDescription,
  getWeatherIcon
};
