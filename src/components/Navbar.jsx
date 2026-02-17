import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  SunIcon, 
  MoonIcon, 
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/live-weather') return 'Live Weather';
    if (path === '/predictor') return 'Disaster Predictor';
    if (path === '/alerts') return 'Alerts & Warnings';
    if (path === '/history') return 'Prediction History';
    return 'Disaster Response System';
  };

  return (
    <nav className="bg-white dark:bg-[#1a1d2e] shadow-lg sticky top-0 z-40 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>

          {}
          <div className="flex items-center space-x-4">
            {}
            <Link
              to="/alerts"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#22283a] transition-colors"
            >
              <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </Link>

            {}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#22283a] transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>

            {}
            {user ? (
              <div className="flex items-center space-x-3">
                {}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                
                {}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#22283a] transition-colors"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-[#5b6ee1] text-white rounded-lg hover:bg-[#4c5fd6] transition-colors"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
