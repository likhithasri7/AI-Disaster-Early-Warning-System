import {
  CloudIcon,
  SunIcon,
  EyeIcon,
  ArrowPathIcon,
  BeakerIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const WeatherDetails = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No weather details available. Search for a city to see detailed information.
        </p>
      </div>
    );
  }

  const detailCards = [
    {
      title: 'Temperature',
      value: `${data.temperature.toFixed(2)}°C`,
      icon: SunIcon,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Humidity',
      value: `${data.humidity.toFixed(2)}%`,
      icon: CloudIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Pressure',
      value: `${data.pressure.toFixed(2)} hPa`,
      icon: BeakerIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Wind Speed',
      value: `${data.windSpeed.toFixed(2)} km/h`,
      icon: ArrowPathIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Visibility',
      value: data.visibility ? `${data.visibility.toFixed(2)} km` : 'N/A',
      icon: EyeIcon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      title: 'Cloud Cover',
      value: data.cloudCover ? `${data.cloudCover.toFixed(2)}%` : 'N/A',
      icon: CloudIcon,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-700/20',
    },
    {
      title: 'UV Index',
      value: data.uvIndex || 0,
      icon: SunIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Rainfall',
      value: `${data.rainfall.toFixed(4)} mm`,
      icon: CloudIcon,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
    },
    {
      title: 'Weather Condition',
      value: data.weatherCondition,
      icon: SparklesIcon,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    },
  ];

  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600' };
    return { level: 'Extreme', color: 'text-purple-600' };
  };

  const uvLevel = getUVLevel(data.uvIndex);

  return (
    <div className="space-y-6">
      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.city}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{data.country}</p>
          </div>
          <div className="text-right">
            <div className="text-6xl">{data.weatherIcon}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {data.weatherCondition}
            </p>
          </div>
        </div>
        
        {}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Coordinates: {data.coordinates.lat.toFixed(4)}°, {data.coordinates.lon.toFixed(4)}°
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Last updated: {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Detailed Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detailCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-lg p-4 transition-all hover:scale-105 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
                <card.icon className={`h-10 w-10 ${card.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              UV Index Details
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current UV Index: <span className="font-semibold">{data.uvIndex}</span>
            </p>
            <p className={`text-sm font-semibold mt-1 ${uvLevel.color}`}>
              Level: {uvLevel.level}
            </p>
          </div>
          <SunIcon className="h-16 w-16 text-yellow-500" />
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((data.uvIndex / 11) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
            <span>0</span>
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>11+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
