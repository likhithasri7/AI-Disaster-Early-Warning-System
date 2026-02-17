import { useEffect, useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useAlerts } from '../hooks/usePredict';
import WeatherCard from '../components/WeatherCard';
import AlertCard from '../components/AlertCard';
import GraphCard from '../components/GraphCard';
import {
  ExclamationTriangleIcon,
  CloudIcon,
  BoltIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { data: weatherData, loading: weatherLoading, fetchWeather } = useWeather();
  const { alerts, loading: alertsLoading, fetchAlerts } = useAlerts();
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  useEffect(() => {
    fetchWeather(selectedCity);
    fetchAlerts();
  }, [selectedCity]);

  const generateRainfallData = () => ({
    labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: [5, 12, 18, 25, 15, 8],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  const generateWindSpeedData = () => ({
    labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
    datasets: [
      {
        label: 'Wind Speed (km/h)',
        data: [10, 15, 20, 25, 22, 18],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  const generateSeverityData = () => ({
    labels: ['Low', 'Moderate', 'High'],
    datasets: [
      {
        label: 'Risk Distribution',
        data: [12, 5, 3],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const calculateRiskLevel = () => {
    if (!weatherData) return 'low';

    const { rainfall = 0, windSpeed = 0, humidity = 0 } = weatherData;

    if (rainfall > 50 || windSpeed > 40) return 'high';
    if (rainfall > 20 || windSpeed > 25 || humidity > 80) return 'moderate';
    return 'low';
  };

  const getRiskStyles = (level) => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-red-500',
          text: 'text-red-500',
          icon: ExclamationTriangleIcon,
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-500',
          text: 'text-yellow-500',
          icon: BoltIcon,
        };
      default:
        return {
          bg: 'bg-green-500',
          text: 'text-green-500',
          icon: CheckCircleIcon,
        };
    }
  };

  const riskLevel = calculateRiskLevel();
  const riskStyles = getRiskStyles(riskLevel);
  const RiskIcon = riskStyles.icon;

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Overview Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time disaster monitoring and predictions
          </p>
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
          <option value="Kolkata">Kolkata</option>
        </select>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {weatherData ? Math.round(weatherData.temperature) : '--'}°C
              </p>
            </div>
            <CloudIcon className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        {}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {weatherData ? Math.round(weatherData.humidity) : '--'}%
              </p>
            </div>
            <div className="h-12 w-12 text-cyan-500">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {weatherData ? Math.round(weatherData.windSpeed) : '--'} km/h
              </p>
            </div>
            <BoltIcon className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Risk Level</p>
              <p className={`text-3xl font-bold ${riskStyles.text} mt-2 capitalize`}>
                {riskLevel}
              </p>
            </div>
            <RiskIcon className={`h-12 w-12 ${riskStyles.text}`} />
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-1">
          <WeatherCard data={weatherData} loading={weatherLoading} />
        </div>

        {}
        <div className="lg:col-span-2 space-y-6">
          <GraphCard
            title="Rainfall Trend"
            type="line"
            data={generateRainfallData()}
          />
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraphCard
          title="Wind Speed Variation"
          type="line"
          data={generateWindSpeedData()}
        />
        <GraphCard
          title="Severity Distribution (Last 24h)"
          type="pie"
          data={generateSeverityData()}
        />
      </div>

      {}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Alerts
        </h3>
        {alertsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.slice(0, 3).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No active alerts at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
