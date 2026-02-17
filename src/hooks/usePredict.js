import { useState } from 'react';
import { predictDisaster, getPredictions, getAlerts } from '../services/api';

export const usePredict = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = async (weatherData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await predictDisaster(weatherData);
      setPrediction(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to predict disaster');
      const dummyResult = generateDummyPrediction(weatherData);
      setPrediction(dummyResult);
      return dummyResult;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPrediction(null);
    setError(null);
  };

  return {
    prediction,
    loading,
    error,
    predict,
    reset,
  };
};

export const usePredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPredictions();
      setPredictions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch predictions');
      setPredictions(getDummyPredictions());
    } finally {
      setLoading(false);
    }
  };

  return {
    predictions,
    loading,
    error,
    fetchPredictions,
  };
};

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
      setAlerts(getDummyAlerts());
    } finally {
      setLoading(false);
    }
  };

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
  };
};

const generateDummyPrediction = (weatherData) => {
  const { temperature = 30, humidity = 70, rainfall = 20, windSpeed = 15 } = weatherData;

  let riskScore = 0;
  if (rainfall > 50) riskScore += 30;
  if (windSpeed > 40) riskScore += 25;
  if (humidity > 80) riskScore += 20;
  if (temperature > 40 || temperature < 10) riskScore += 15;

  const severity = riskScore > 60 ? 'High' : riskScore > 30 ? 'Moderate' : 'Low';
  const probability = Math.min(riskScore / 100, 0.95);

  return {
    severity,
    probability: probability.toFixed(2),
    riskScore,
    disasterType: severity === 'High' ? 'Flood/Storm' : severity === 'Moderate' ? 'Heavy Rain' : 'Normal',
    timestamp: new Date().toISOString(),
    recommendations: severity === 'High' 
      ? ['Stay indoors', 'Avoid travel', 'Keep emergency supplies ready']
      : severity === 'Moderate'
      ? ['Monitor weather updates', 'Carry umbrella', 'Plan indoor activities']
      : ['Normal weather conditions', 'No special precautions needed'],
  };
};

const getDummyPredictions = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    severity: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
    probability: (Math.random() * 0.9 + 0.1).toFixed(2),
    location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 5)],
    temperature: 25 + Math.random() * 15,
    humidity: 50 + Math.random() * 40,
    rainfall: Math.random() * 100,
    windSpeed: 5 + Math.random() * 40,
  }));
};

const getDummyAlerts = () => {
  const now = Date.now();
  return [
    {
      id: 1,
      severity: 'High',
      title: 'Heavy Rainfall Warning',
      message: 'Extreme rainfall expected in coastal regions. Flood risk high.',
      location: 'Mumbai, Maharashtra',
      timestamp: new Date(now - 1800000).toISOString(),
      active: true,
    },
    {
      id: 2,
      severity: 'Moderate',
      title: 'Strong Wind Advisory',
      message: 'Wind speeds may reach 50 km/h. Secure loose objects.',
      location: 'Delhi, NCR',
      timestamp: new Date(now - 3600000).toISOString(),
      active: true,
    },
    {
      id: 3,
      severity: 'Low',
      title: 'Weather Update',
      message: 'Cloudy skies expected with light drizzle.',
      location: 'Bangalore, Karnataka',
      timestamp: new Date(now - 7200000).toISOString(),
      active: false,
    },
  ];
};

export default usePredict;
