import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export const ToolbarButton: React.FC<Props> = ({ icon: Icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
      }`}
    >
      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
    </button>
  );
};