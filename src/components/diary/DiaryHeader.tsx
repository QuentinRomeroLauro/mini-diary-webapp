import React from 'react';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { Brain, Loader2 } from 'lucide-react';

interface Props {
  selectedDate: Date;
  saveStatus: 'saved' | 'saving' | 'generating-insight' | null;
}

export const DiaryHeader: React.FC<Props> = ({ 
  selectedDate, 
  saveStatus,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </h1>
      <div className="flex items-center gap-4">
        {saveStatus && (
          <span className={`flex items-center gap-1 text-sm ${
            saveStatus === 'saved' ? 'text-green-400' : 
            saveStatus === 'generating-insight' ? 'text-purple-400' : 
            'text-blue-400'
          }`}>
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};