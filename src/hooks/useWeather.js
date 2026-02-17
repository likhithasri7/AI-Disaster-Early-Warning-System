import { useState, useEffect } from 'react';
import { getCurrentWeather, getWeatherForecast, getWeatherDescription, getWeatherIcon } from '../services/weatherApi';

const transformWeatherData = (apiData) => {
  if (!apiData || !apiData.current) return null;

  const { current, location } = apiData;
  const values = current.values;

  const locationParts = location?.name ? location.name.split(',').map(p => p.trim()) : [];
  const city = location?.cityName || locationParts[0] || 'Unknown';
  const country = locationParts[locationParts.length - 1] || '';

  return {
    city: city,
    country: country,
    temperature: values.temperature || 0,
    humidity: values.humidity || 0,
    pressure: values.pressureSeaLevel || values.pressureSurfaceLevel || 0,
    windSpeed: values.windSpeed || 0,
    rainfall: values.rainIntensity || values.precipitationIntensity || 0,
    weatherCondition: getWeatherDescription(values.weatherCode),
    weatherIcon: getWeatherIcon(values.weatherCode),
    visibility: values.visibility || 0,
    cloudCover: values.cloudCover || 0,
    uvIndex: values.uvIndex || 0,
    timestamp: current.time,
    coordinates: {
      lat: location?.lat || 0,
      lon: location?.lon || 0,
    },
  };
};

const weatherCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; 

export const useWeather = (city = '', autoFetch = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    const cacheKey = cityName.toLowerCase();
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached weather data for', cityName);
      setData(cached.data);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weatherData = await getCurrentWeather(cityName);
      const transformedData = transformWeatherData(weatherData);
      
      weatherCache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });
      
      setData(transformedData);
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch weather data';
      setError(errorMsg);
      console.error('Weather API Error:', errorMsg);
      setData(getDummyWeatherData(cityName));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && city) {
      fetchWeather(city);
    }
  }, [city, autoFetch]);

  return {
    data,
    loading,
    error,
    fetchWeather,
    refetch: () => fetchWeather(city),
  };
};

const transformForecastData = (apiData, city) => {
  if (!apiData || !apiData.timelines?.daily) return null;

  const dailyData = apiData.timelines.daily;

  return {
    city: city || 'Unknown',
    forecast: dailyData.map((day) => ({
      date: day.time,
      temperature: day.values.temperatureAvg || day.values.temperature || 0,
      temperatureMax: day.values.temperatureMax || 0,
      temperatureMin: day.values.temperatureMin || 0,
      humidity: day.values.humidityAvg || day.values.humidity || 0,
      rainfall: day.values.precipitationIntensityAvg || day.values.precipitationIntensity || 0,
      windSpeed: day.values.windSpeedAvg || day.values.windSpeed || 0,
      condition: getWeatherDescription(day.values.weatherCodeMax || day.values.weatherCode),
      weatherIcon: getWeatherIcon(day.values.weatherCodeMax || day.values.weatherCode),
      uvIndex: day.values.uvIndexAvg || 0,
      cloudCover: day.values.cloudCoverAvg || 0,
    })),
  };
};

export const useWeatherForecast = (city = '', days = 7) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForecast = async (cityName, forecastDays) => {
    if (!cityName) return;

    setLoading(true);
    setError(null);

    try {
      const forecastData = await getWeatherForecast(cityName, '1d');
      const transformedData = transformForecastData(forecastData, cityName);
      
      if (transformedData && transformedData.forecast) {
        transformedData.forecast = transformedData.forecast.slice(0, forecastDays);
      }
      
      setData(transformedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch forecast data');
      setData(getDummyForecastData(cityName, forecastDays));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchForecast(city, days);
    }
  }, [city, days]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchForecast(city, days),
  };
};

const getDummyWeatherData = (city) => ({
  city: city || 'Mumbai',
  country: 'IN',
  temperature: 28 + Math.random() * 10,
  humidity: 60 + Math.random() * 30,
  pressure: 1010 + Math.random() * 20,
  windSpeed: 5 + Math.random() * 15,
  rainfall: Math.random() * 50,
  weatherCondition: ['Clear', 'Cloudy', 'Rainy', 'Thunderstorm'][Math.floor(Math.random() * 4)],
  timestamp: new Date().toISOString(),
  coordinates: {
    lat: 19.0760,
    lon: 72.8777,
  },
});

const getDummyForecastData = (city, days) => ({
  city: city || 'Mumbai',
  forecast: Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
    temperature: 25 + Math.random() * 15,
    humidity: 50 + Math.random() * 40,
    rainfall: Math.random() * 60,
    windSpeed: 5 + Math.random() * 20,
    condition: ['Clear', 'Cloudy', 'Rainy', 'Thunderstorm'][Math.floor(Math.random() * 4)],
  })),
});

export default useWeather;
