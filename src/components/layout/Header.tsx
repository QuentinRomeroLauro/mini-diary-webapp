import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { logOut } from '../../services/authService';

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/diary" className="flex items-center gap-2">
            <Book className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Mini Diary</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            <Link
              to="/settings"
              className="p-2 rounded-lg text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}; 