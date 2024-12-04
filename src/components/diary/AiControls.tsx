import React from 'react';
import { Brain, Loader2, Check } from 'lucide-react';

interface Props {
  onRequestInsight: () => void;
  saveStatus: 'saved' | 'saving' | 'generating-insight' | null;
  disabled: boolean;
}

export const AiControls: React.FC<Props> = ({ 
  onRequestInsight, 
  saveStatus,
  disabled 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 font-medium">AI Assistant</h3>
        {saveStatus && (
          <span className={`flex items-center gap-1 text-sm ${
            saveStatus === 'saved' ? 'text-green-400' : 
            saveStatus === 'generating-insight' ? 'text-purple-400' : 
            'text-blue-400'
          }`}>
            {saveStatus === 'generating-insight' ? (
              <>
                <Brain className="w-4 h-4 animate-pulse" />
                Thinking...
              </>
            ) : saveStatus === 'saved' && (
              <>
                <Check className="w-4 h-4" />
                Ready
              </>
            )}
          </span>
        )}
      </div>
      
      <button
        onClick={onRequestInsight}
        disabled={disabled || saveStatus === 'generating-insight'}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        <Brain className="w-4 h-4" />
        Generate Insight
      </button>
    </div>
  );
};
