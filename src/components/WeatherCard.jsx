import {
  CloudIcon,
  SunIcon,
  CloudIcon as RainIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

const WeatherCard = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No weather data available
        </p>
      </div>
    );
  }

  const getWeatherIcon = (condition) => {
    const lowerCondition = condition?.toLowerCase() || '';
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return <SunIcon className="h-16 w-16 text-yellow-500" />;
    } else if (lowerCondition.includes('cloud')) {
      return <CloudIcon className="h-16 w-16 text-gray-500" />;
    } else if (lowerCondition.includes('rain')) {
      return <RainIcon className="h-16 w-16 text-blue-500" />;
    } else if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
      return <BoltIcon className="h-16 w-16 text-purple-500" />;
    }
    return <CloudIcon className="h-16 w-16 text-gray-500" />;
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-900 dark:to-blue-950 rounded-xl shadow-lg p-6 text-white">
      {}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">{data.city}</h3>
          <p className="text-blue-100 text-sm">{data.country || 'India'}</p>
        </div>
        {data.weatherIcon ? (
          <span className="text-6xl">{data.weatherIcon}</span>
        ) : (
          getWeatherIcon(data.weatherCondition)
        )}
      </div>

      {}
      <div className="mb-6">
        <div className="text-5xl font-bold">
          {Math.round(data.temperature)}°C
        </div>
        <p className="text-blue-100 text-lg capitalize mt-2">
          {data.weatherCondition || 'Clear'}
        </p>
      </div>

      {}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400">
        <div>
          <p className="text-blue-100 text-sm">Humidity</p>
          <p className="text-lg font-semibold">{Math.round(data.humidity)}%</p>
        </div>
        <div>
          <p className="text-blue-100 text-sm">Wind Speed</p>
          <p className="text-lg font-semibold">{Math.round(data.windSpeed)} km/h</p>
        </div>
        <div>
          <p className="text-blue-100 text-sm">Pressure</p>
          <p className="text-lg font-semibold">{Math.round(data.pressure)} hPa</p>
        </div>
        <div>
          <p className="text-blue-100 text-sm">Rainfall</p>
          <p className="text-lg font-semibold">{Math.round(data.rainfall)} mm</p>
        </div>
      </div>

      {}
      {data.timestamp && (
        <div className="mt-4 text-xs text-blue-100 text-right">
          Updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
