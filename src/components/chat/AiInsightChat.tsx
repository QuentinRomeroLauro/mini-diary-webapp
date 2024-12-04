import React, { useRef, useEffect } from 'react';
import { Brain, ChevronDown, ChevronUp, Send, Info, Loader2 } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { useAI } from '../../contexts/AIContext';

interface Props {
  isOpen: boolean;
  isGenerating: boolean;
  messages: ChatMessage[];
  onMinimize: () => void;
  isMinimized: boolean;
  onSendMessage: (message: string) => void;
}

export const AiInsightChat: React.FC<Props> = ({
  isOpen,
  isGenerating,
  messages,
  onMinimize,
  isMinimized,
  onSendMessage
}) => {
  const [input, setInput] = React.useState('');
  const [showInfo, setShowInfo] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isLoading, loadingProgress, isAIReady } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating || !isAIReady) return;
    
    onSendMessage(input);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-200 ${
        isMinimized ? 'h-12' : 'h-[400px]'
      }`}>
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="font-medium">Thought Collector</span>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-xs">Loading AI...</span>
              </div>
            )}
            <button
              onClick={() => setShowInfo(true)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              title="Security Information"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {!isMinimized && (
          <>
            <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <Loader2 className="w-8 h-8 mb-4 animate-spin" />
                  <p className="text-sm text-center">Loading AI Model...</p>
                  {loadingProgress && (
                    <p className="text-xs mt-2 text-center max-w-[200px]">{loadingProgress}</p>
                  )}
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLoading ? "AI is loading..." : "Type a message..."}
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  disabled={isGenerating || isLoading || !isAIReady}
                />
                <button
                  type="submit"
                  disabled={isGenerating || !input.trim() || isLoading || !isAIReady}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Security Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Security & Privacy Information
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>End-to-End Encryption:</strong> All your journal entries and conversations are encrypted using AES-GCM encryption before being stored. Only you can access your data with your unique encryption key.
              </p>
              <p>
                <strong>Local AI Processing:</strong> The AI assistant runs entirely in your web browser using WebLLM technology. Your data never leaves your device for AI processing, ensuring complete privacy.
              </p>
              <p>
                <strong>Secure Storage:</strong> While your encrypted data is stored in the cloud for backup and sync purposes, it remains unreadable without your personal encryption key.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 