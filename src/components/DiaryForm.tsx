import React, { useState } from 'react';
import { PenLine } from 'lucide-react';

interface Props {
  onSubmit: (content: string, mood: 'happy' | 'neutral' | 'sad') => void;
}

export const DiaryForm: React.FC<Props> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, mood);
      setContent('');
      setMood('neutral');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <PenLine className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">New Entry</h2>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling?
        </label>
        <div className="flex gap-4">
          {(['happy', 'neutral', 'sad'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMood(option)}
              className={`px-4 py-2 rounded-full ${
                mood === option
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Entry
      </button>
    </form>
  );
};