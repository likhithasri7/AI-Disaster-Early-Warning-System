import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CloudIcon,
  ChartBarIcon,
  BellIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard', protected: false },
    { path: '/live-weather', icon: CloudIcon, label: 'Live Weather', protected: false },
    { path: '/predictor', icon: ChartBarIcon, label: 'Predictor', protected: true },
    { path: '/alerts', icon: BellIcon, label: 'Alerts', protected: false },
    { path: '/history', icon: ClockIcon, label: 'History', protected: false },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <>
      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#5b6ee1] text-white shadow-lg"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen
          w-64 bg-white dark:bg-[#1a1d2e] shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-[#22283a]">
          <div className="flex items-center space-x-2">
            <CloudIcon className="h-8 w-8 text-[#5b6ee1]" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              DisasterWatch
            </span>
          </div>
        </div>

        {}
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isProtected = item.protected && !user;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-[#5b6ee1] text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22283a]'
                  }
                  ${isProtected ? 'opacity-75' : ''}
                `}
                title={isProtected ? 'Login required to access this feature' : ''}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isProtected && (
                  <LockClosedIcon className="h-4 w-4" />
                )}
              </Link>
            );
          })}
        </nav>

        {}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-[#22283a]">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p className="font-semibold">Capstone Project</p>
            <p>LPU 2025</p>
            <p className="mt-2">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
