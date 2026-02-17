import { useEffect, useState } from 'react';
import { useAlerts } from '../hooks/usePredict';
import AlertCard from '../components/AlertCard';
import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Alerts = () => {
  const { alerts, loading, error, fetchAlerts } = useAlerts();
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [activeOnly, setActiveOnly] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (!alerts) return;

    let filtered = [...alerts];

    if (filter !== 'all') {
      filtered = filtered.filter(
        (alert) => alert.severity.toLowerCase() === filter.toLowerCase()
      );
    }

    if (activeOnly) {
      filtered = filtered.filter((alert) => alert.active);
    }

    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredAlerts(filtered);
  }, [alerts, filter, activeOnly]);

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alerts & Warnings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor active disaster alerts and warnings
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowPathIcon
            className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity Level
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="high">High Risk Only</option>
              <option value="moderate">Moderate Risk Only</option>
              <option value="low">Low Risk Only</option>
            </select>
          </div>

          {}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Alerts Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {alerts.length}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-red-600 dark:text-red-400">High Risk</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            {alerts.filter((a) => a.severity.toLowerCase() === 'high').length}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Moderate Risk</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
            {alerts.filter((a) => a.severity.toLowerCase() === 'moderate').length}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-4">
          <p className="text-sm text-green-600 dark:text-green-400">Active Alerts</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {alerts.filter((a) => a.active).length}
          </p>
        </div>
      </div>

      {}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            {error} - Showing sample data
          </p>
        </div>
      )}

      {}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading alerts...</p>
        </div>
      )}

      {}
      {!loading && filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ) : !loading && filteredAlerts.length === 0 ? (
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
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No Alerts Found
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            {filter !== 'all' || activeOnly
              ? 'Try adjusting your filters'
              : 'No active alerts at the moment'}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Alerts;
