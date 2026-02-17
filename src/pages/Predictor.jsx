import { useState } from 'react';
import { usePredict } from '../hooks/usePredict';
import PredictionCard from '../components/PredictionCard';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Predictor = () => {
  const { prediction, loading, error, predict, reset } = usePredict();
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    pressure: '',
    rainfall: '',
    windSpeed: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = Object.values(formData);
    if (values.some((val) => val === '' || isNaN(val))) {
      alert('Please fill all fields with valid numbers');
      return;
    }

    const weatherData = {
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      pressure: parseFloat(formData.pressure),
      rainfall: parseFloat(formData.rainfall),
      windSpeed: parseFloat(formData.windSpeed),
    };

    const result = await predict(weatherData);

    if (result?.severity?.toLowerCase() === 'high') {
      setShowAlert(true);
    }
  };

  const handleReset = () => {
    setFormData({
      temperature: '',
      humidity: '',
      pressure: '',
      rainfall: '',
      windSpeed: '',
    });
    reset();
    setShowAlert(false);
  };

  const loadSampleData = () => {
    setFormData({
      temperature: '38',
      humidity: '85',
      pressure: '1005',
      rainfall: '65',
      windSpeed: '45',
    });
  };

  return (
    <div className="space-y-6">
      {}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Disaster Predictor
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Input weather parameters to predict disaster risk and severity
        </p>
      </div>

      {}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full animate-bounce-slow">
            <div className="text-center">
              <ExclamationTriangleIcon className="h-20 w-20 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                HIGH RISK ALERT!
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Severe weather conditions detected. Immediate action recommended.
              </p>
              <button
                onClick={() => setShowAlert(false)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Weather Parameters
            </h3>
            <button
              onClick={loadSampleData}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Load Sample Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature (°C)
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g., 28.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Range: -10°C to 50°C
              </p>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Humidity (%)
              </label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g., 65"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Range: 0% to 100%
              </p>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pressure (hPa)
              </label>
              <input
                type="number"
                name="pressure"
                value={formData.pressure}
                onChange={handleChange}
                step="0.1"
                placeholder="e.g., 1013"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Range: 950 hPa to 1050 hPa
              </p>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rainfall (mm)
              </label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="e.g., 25"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Range: 0 mm to 500 mm
              </p>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wind Speed (km/h)
              </label>
              <input
                type="number"
                name="windSpeed"
                value={formData.windSpeed}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="e.g., 15"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Range: 0 km/h to 200 km/h
              </p>
            </div>

            {}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  {error} - Using fallback prediction model
                </p>
              </div>
            )}

            {}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Predicting...
                  </span>
                ) : (
                  'Predict Disaster Risk'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {}
        <div>
          <PredictionCard prediction={prediction} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Predictor;
