import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);


export const getLiveWeather = async (city) => {
  try {
    const response = await api.get('/live-weather', {
      params: { city },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const predictDisaster = async (data) => {
  try {
    const response = await api.post('/predict', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPredictions = async () => {
  try {
    const response = await api.get('/predictions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAlerts = async () => {
  try {
    const response = await api.get('/alerts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWeatherForecast = async (city, days = 7) => {
  try {
    const response = await api.get('/forecast', {
      params: { city, days },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
