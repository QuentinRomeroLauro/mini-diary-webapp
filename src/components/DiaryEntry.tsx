import React from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, MessageSquareMore } from 'lucide-react';
import { DiaryEntry as DiaryEntryType } from '../types/diary';

interface Props {
  entry: DiaryEntryType;
  onDelete: (id: string) => void;
  onEdit: (entry: DiaryEntryType) => void;
  onRequestAiInsight: (entry: DiaryEntryType) => void;
}

export const DiaryEntry: React.FC<Props> = ({
  entry,
  onDelete,
  onEdit,
  onRequestAiInsight
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {format(entry.date, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
          <button
            onClick={() => onRequestAiInsight(entry)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <MessageSquareMore className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{entry.content}</p>

    </div>
  );
};