import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Bell, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState(true);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          Account Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div className="mt-1 text-gray-600 dark:text-gray-400">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Moon className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable dark mode for the application</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Enable dark mode</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive daily writing reminders</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
          Privacy & Security
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Encryption</label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your journal entries are encrypted end-to-end
            </p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
              Enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 