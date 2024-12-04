import React from 'react';
import { DiaryHeader } from './DiaryHeader';
import { DiaryEditor } from './DiaryEditor';
import { Calendar } from '../Calendar';
import { AiInsightChat } from '../chat/AiInsightChat';
import { useDiaryEntries } from '../../hooks/useDiaryEntries';
import { Search } from 'lucide-react';

export const DiaryPage: React.FC = () => {
  const { 
    selectedDate,
    setSelectedDate,
    content,
    setContent,
    searchQuery,
    setSearchQuery,
    entries,
    saveStatus,
    messages,
    isGenerating,
    sendMessage,
    isChatOpen,
    setIsChatOpen,
    isChatMinimized,
    setIsChatMinimized
  } = useDiaryEntries();

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
        </div>
        
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          entries={entries}
        />

        <AiInsightChat
          isOpen={isChatOpen}
          isGenerating={isGenerating}
          messages={messages}
          onMinimize={() => setIsChatMinimized(!isChatMinimized)}
          isMinimized={isChatMinimized}
          onSendMessage={sendMessage}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <DiaryHeader 
          selectedDate={selectedDate}
          saveStatus={saveStatus}
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-[calc(100vh-12rem)]">
          <DiaryEditor
            value={content}
            onChange={setContent}
            placeholder="Write your thoughts for today..."
            className="h-full prose dark:prose-invert max-w-none"
          />
        </div>
      </div>
    </div>
  );
}; 