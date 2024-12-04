import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search your entries..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};