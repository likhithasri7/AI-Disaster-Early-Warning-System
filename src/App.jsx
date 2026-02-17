import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LiveWeather from './pages/LiveWeather';
import Predictor from './pages/Predictor';
import Alerts from './pages/Alerts';
import History from './pages/History';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {}
          <Route path="/auth" element={<Auth />} />

          {}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-100 dark:bg-[#0f1116] transition-colors duration-200">
                <div className="flex h-screen overflow-hidden">
                  {}
                  <Sidebar />

                  {}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {}
                    <Navbar />

                    {}
                    <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-[#0f1116] p-4 sm:p-6 lg:p-8">
                      <div className="max-w-7xl mx-auto">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/live-weather" element={<LiveWeather />} />
                          <Route
                            path="/predictor"
                            element={
                              <ProtectedRoute>
                                <Predictor />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/alerts" element={<Alerts />} />
                          <Route path="/history" element={<History />} />
                          {}
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </div>
                    </main>

                    {}
                    <footer className="bg-white dark:bg-[#1a1d2e] border-t border-gray-200 dark:border-[#22283a] py-4 px-6">
                      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <p>© 2025 Disaster Response Predictor</p>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
