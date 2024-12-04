import React from 'react';
import { format } from 'date-fns';
import { DiaryEntry } from '../../types/diary';

interface Props {
  entries: DiaryEntry[];
  onEntryClick: (entry: DiaryEntry) => void;
  searchQuery: string;
}

const stripHtml = (html: string) => {
  console.log('Stripping HTML from content:', html.slice(0, 50) + '...');
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  console.log('Stripped content:', text.slice(0, 50) + '...');
  return text;
};

const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === searchTerm.toLowerCase() ? 
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-gray-100">{part}</mark> : 
      part
  );
};

export const SearchResults: React.FC<Props> = ({ entries, onEntryClick, searchQuery }) => {
  console.log('SearchResults rendered:', {
    numEntries: entries.length,
    searchQuery
  });

  if (!searchQuery || entries.length === 0) {
    console.log('No results to display');
    return null;
  }

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Search results for "{searchQuery}" ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
      </h2>
      <div className="space-y-3">
        {entries.map(entry => {
          console.log('Rendering entry:', {
            id: entry.id,
            date: format(new Date(entry.date), 'yyyy-MM-dd'),
            contentPreview: entry.content.slice(0, 50)
          });

          const plainContent = stripHtml(entry.content);
          const dateStr = format(new Date(entry.date), 'MMMM d, yyyy');

          return (
            <button
              key={entry.id}
              onClick={() => onEntryClick(entry)}
              className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="text-sm text-primary-600 dark:text-primary-400 mb-2">
                {highlightSearchTerm(dateStr, searchQuery)}
              </div>
              <div className="text-gray-900 dark:text-gray-100 line-clamp-3">
                {highlightSearchTerm(plainContent, searchQuery)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}; 