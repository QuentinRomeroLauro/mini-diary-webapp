import React from 'react';
import { Link } from 'react-router-dom';
import { BookHeart, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const LandingPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <BookHeart className="h-16 w-16 mx-auto mb-8 text-primary-600 dark:text-primary-400" />
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Personal
            <span className="block text-primary-600 dark:text-primary-400">mini-diary</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Write, reflect, and grow with an intelligent journal that understands you.
            Secure, private, and always by your side built with WebLLM.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 text-lg font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full py-6 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400">
              Privacy
            </Link>
            <span>•</span>
            <p>
            Built with ❤️ by{' '}
            <a
              href="https://quentinromerolauro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Quentin Romero Lauro
              </a>
            </p>
            <span>•</span>
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-lg hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
          
        </div>
      </footer>
    </div>
  );
}; 