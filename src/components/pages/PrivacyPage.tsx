import React from 'react';
import { Shield, Lock, Cpu, Database, Key, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export const PrivacyPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const features = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your journal entries are encrypted before leaving your device. Only you can read them with your unique encryption key.'
    },
    {
      icon: Cpu,
      title: 'Local Processing',
      description: 'AI insights are generated locally on your device using WebLLM. Your thoughts never leave your browser.'
    },
    {
      icon: Database,
      title: 'Secure Storage',
      description: 'Encrypted data is stored in Firebase with industry-standard security practices. Even we cannot read your entries.'
    },
    {
      icon: Key,
      title: 'Personal Encryption Key',
      description: 'Your encryption key is generated during signup and stored securely. It\'s required to decrypt your journal entries.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <Shield className="h-16 w-16 mx-auto mb-6 text-primary-600 dark:text-primary-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Privacy is Our Priority
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              mini-diary is built with privacy and security at its core.
              Here's how we protect your personal thoughts and reflections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Technical Details
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <div className="space-y-2 text-gray-800 dark:text-gray-300">
                <p>Uses AES-GCM encryption with a 256-bit key</p>
                <p>Encryption/decryption happens in your browser using the Web Crypto API</p>
                <p>AI processing runs locally using WebLLM, ensuring your data never leaves your device</p>
                <p>No tracking, no analytics, no third-party scripts</p>
                <p>Open source codebase for transparency</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full py-6 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
              Home
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