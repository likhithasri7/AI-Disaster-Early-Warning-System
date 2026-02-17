import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

const AlertCard = ({ alert }) => {
  if (!alert) return null;

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-500',
          icon: 'text-red-600',
          badge: 'bg-red-500',
          text: 'text-red-900 dark:text-red-100',
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-500',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-500',
          text: 'text-yellow-900 dark:text-yellow-100',
        };
      case 'low':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-500',
          icon: 'text-green-600',
          badge: 'bg-green-500',
          text: 'text-green-900 dark:text-green-100',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-500',
          icon: 'text-gray-600',
          badge: 'bg-gray-500',
          text: 'text-gray-900 dark:text-gray-100',
        };
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <ExclamationTriangleIcon className="h-6 w-6" />;
      case 'moderate':
        return <ExclamationCircleIcon className="h-6 w-6" />;
      case 'low':
        return <CheckCircleIcon className="h-6 w-6" />;
      default:
        return <BellAlertIcon className="h-6 w-6" />;
    }
  };

  const styles = getSeverityStyles(alert.severity);

  return (
    <div
      className={`${styles.bg} rounded-lg border-l-4 ${styles.border} p-4 shadow-md hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="flex items-start">
        {}
        <div className={`${styles.icon} flex-shrink-0 mt-1`}>
          {getSeverityIcon(alert.severity)}
        </div>

        {}
        <div className="ml-4 flex-1">
          {}
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-lg font-bold ${styles.text}`}>
              {alert.title}
            </h4>
            <span
              className={`${styles.badge} text-white text-xs font-semibold px-3 py-1 rounded-full`}
            >
              {alert.severity}
            </span>
          </div>

          {}
          <p className={`${styles.text} text-sm mb-3`}>{alert.message}</p>

          {}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className={`${styles.text} font-medium flex items-center mb-2 sm:mb-0`}>
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {alert.location}
            </div>
            <div className={`${styles.text} opacity-75`}>
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>

          {}
          {alert.active && (
            <div className="mt-3 flex items-center">
              <span className="relative flex h-3 w-3 mr-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${styles.badge} opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${styles.badge}`}
                ></span>
              </span>
              <span className={`${styles.text} text-xs font-semibold`}>
                Active Alert
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
