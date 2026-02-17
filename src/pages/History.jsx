import { useEffect, useState } from 'react';
import { usePredictionHistory } from '../hooks/usePredict';
import GraphCard from '../components/GraphCard';
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const History = () => {
  const { predictions, loading, error, fetchPredictions } = usePredictionHistory();
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    if (!predictions) return;

    let filtered = [...predictions];

    if (severityFilter !== 'all') {
      filtered = filtered.filter(
        (p) => p.severity.toLowerCase() === severityFilter.toLowerCase()
      );
    }

    const now = Date.now();
    if (dateRange === '24h') {
      filtered = filtered.filter(
        (p) => now - new Date(p.timestamp).getTime() < 24 * 60 * 60 * 1000
      );
    } else if (dateRange === '7d') {
      filtered = filtered.filter(
        (p) => now - new Date(p.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000
      );
    } else if (dateRange === '30d') {
      filtered = filtered.filter(
        (p) => now - new Date(p.timestamp).getTime() < 30 * 24 * 60 * 60 * 1000
      );
    }

    setFilteredPredictions(filtered);
  }, [predictions, severityFilter, dateRange]);

  const exportToCSV = () => {
    if (filteredPredictions.length === 0) return;

    const headers = [
      'ID',
      'Timestamp',
      'Location',
      'Severity',
      'Probability',
      'Temperature',
      'Humidity',
      'Rainfall',
      'Wind Speed',
    ];

    const csvData = filteredPredictions.map((p) => [
      p.id,
      new Date(p.timestamp).toLocaleString(),
      p.location,
      p.severity,
      p.probability,
      p.temperature,
      p.humidity,
      p.rainfall,
      p.windSpeed,
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const generateSeverityTrend = () => {
    if (filteredPredictions.length === 0) return null;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const highCount = Array(7).fill(0);
    const moderateCount = Array(7).fill(0);
    const lowCount = Array(7).fill(0);

    filteredPredictions.forEach((p) => {
      const predDate = new Date(p.timestamp);
      const dayDiff = Math.floor((Date.now() - predDate.getTime()) / (24 * 60 * 60 * 1000));
      if (dayDiff < 7) {
        const index = 6 - dayDiff;
        if (p.severity.toLowerCase() === 'high') highCount[index]++;
        else if (p.severity.toLowerCase() === 'moderate') moderateCount[index]++;
        else lowCount[index]++;
      }
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'High',
          data: highCount,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        },
        {
          label: 'Moderate',
          data: moderateCount,
          backgroundColor: 'rgba(251, 191, 36, 0.8)',
          borderColor: 'rgb(251, 191, 36)',
          borderWidth: 1,
        },
        {
          label: 'Low',
          data: lowCount,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Prediction History
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyze past disaster predictions and trends
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPredictions}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
          >
            <ArrowPathIcon
              className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredPredictions.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity Level
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="high">High Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Predictions</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {filteredPredictions.length}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-red-600 dark:text-red-400">High Risk</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            {filteredPredictions.filter((p) => p.severity.toLowerCase() === 'high').length}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Moderate Risk</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {
              filteredPredictions.filter((p) => p.severity.toLowerCase() === 'moderate')
                .length
            }
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-green-600 dark:text-green-400">Low Risk</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {filteredPredictions.filter((p) => p.severity.toLowerCase() === 'low').length}
          </p>
        </div>
      </div>

      {}
      {filteredPredictions.length > 0 && (
        <GraphCard
          title="Severity Trend (Last 7 Days)"
          type="bar"
          data={generateSeverityTrend()}
        />
      )}

      {}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading prediction history...
          </p>
        </div>
      )}

      {}
      {!loading && filteredPredictions.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Weather Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPredictions.map((prediction) => (
                  <tr
                    key={prediction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      #{prediction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(prediction.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {prediction.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityBadgeClass(
                          prediction.severity
                        )}`}
                      >
                        {prediction.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {(prediction.probability * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="space-y-1">
                        <div>Temp: {prediction.temperature.toFixed(1)}°C</div>
                        <div>Humidity: {prediction.humidity.toFixed(0)}%</div>
                        <div>Rainfall: {prediction.rainfall.toFixed(1)}mm</div>
                        <div>Wind: {prediction.windSpeed.toFixed(1)} km/h</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : !loading && filteredPredictions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <svg
            className="h-24 w-24 text-gray-400 mx-auto mb-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Predictions Found
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Try adjusting your filters or make some predictions first
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default History;
