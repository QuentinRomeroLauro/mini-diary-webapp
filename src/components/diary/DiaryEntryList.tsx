import React from 'react';
import { DiaryEntry as DiaryEntryType } from '../../types/diary';

interface Props {
  entries: DiaryEntryType[];
}

export const DiaryEntryList: React.FC<Props> = ({ entries }) => {
  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <div key={entry.id} className="bg-gray-900 rounded-lg p-6">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>
      ))}
    </div>
  );
};