import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const PredictionCard = ({ prediction, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Submit weather data to get predictions
        </p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'moderate':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />;
      case 'moderate':
        return <ExclamationCircleIcon className="h-16 w-16 text-yellow-500" />;
      case 'low':
        return <CheckCircleIcon className="h-16 w-16 text-green-500" />;
      default:
        return <ExclamationCircleIcon className="h-16 w-16 text-gray-500" />;
    }
  };

  const getSeverityBorderColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'border-red-500';
      case 'moderate':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${getSeverityBorderColor(
        prediction.severity
      )}`}
    >
      {}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Prediction Result
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(prediction.timestamp).toLocaleString()}
          </p>
        </div>
        {getSeverityIcon(prediction.severity)}
      </div>

      {}
      <div className="mb-6">
        <span
          className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${getSeverityColor(
            prediction.severity
          )}`}
        >
          {prediction.severity} Risk
        </span>
      </div>

      {}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Disaster Probability
        </p>
        <div className="flex items-center">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-4">
            <div
              className={`h-4 rounded-full ${
                prediction.severity?.toLowerCase() === 'high'
                  ? 'bg-red-500'
                  : prediction.severity?.toLowerCase() === 'moderate'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${(prediction.probability * 100).toFixed(0)}%` }}
            ></div>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {(prediction.probability * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {}
      {prediction.disasterType && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Predicted Disaster Type
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {prediction.disasterType}
          </p>
        </div>
      )}

      {}
      {prediction.recommendations && prediction.recommendations.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Recommendations:
          </p>
          <ul className="space-y-2">
            {prediction.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700 dark:text-gray-300"
              >
                <span className="text-primary-600 mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
