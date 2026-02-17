import { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import WeatherCard from '../components/WeatherCard';
import WeatherDetails from '../components/WeatherDetails';
import GraphCard from '../components/GraphCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const LiveWeather = () => {
  const [city, setCity] = useState('');
  const [searchedCity, setSearchedCity] = useState('Mumbai');
  const { data, loading, error, fetchWeather } = useWeather();

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setSearchedCity(city.trim());
      fetchWeather(city.trim());
    }
  };

  const generateTemperatureTrend = () => {
    if (!data) return null;

    const baseTemp = data.temperature;
    return {
      labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [
            baseTemp - 3,
            baseTemp - 1,
            baseTemp + 2,
            baseTemp + 4,
            baseTemp + 1,
            baseTemp - 2,
          ],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const generateHumidityTrend = () => {
    if (!data) return null;

    const baseHumidity = data.humidity;
    return {
      labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
      datasets: [
        {
          label: 'Humidity (%)',
          data: [
            baseHumidity + 5,
            baseHumidity + 2,
            baseHumidity - 5,
            baseHumidity - 8,
            baseHumidity - 3,
            baseHumidity,
          ],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  return (
    <div className="space-y-6">
      {}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Live Weather Monitoring
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Search and track real-time weather conditions for any location
        </p>
      </div>

      {}
      <form onSubmit={handleSearch} className="max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore...)"
            className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {}
      <div className="flex flex-wrap gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 w-full mb-2">
          Quick select:
        </p>
        {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'].map(
          (quickCity) => (
            <button
              key={quickCity}
              onClick={() => {
                setCity(quickCity);
                setSearchedCity(quickCity);
                fetchWeather(quickCity);
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              {quickCity}
            </button>
          )
        )}
      </div>



      {}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Fetching weather data for {city}...
          </p>
        </div>
      )}

      {}
      {!loading && data && (
        <>
          {}
          <WeatherCard data={data} />

          {}
          <WeatherDetails data={data} loading={loading} />

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraphCard
              title="Temperature Trend (Today)"
              type="line"
              data={generateTemperatureTrend()}
            />
            <GraphCard
              title="Humidity Trend (Today)"
              type="line"
              data={generateHumidityTrend()}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LiveWeather;
