import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { MainLayout } from '../layout/MainLayout';
import { Calendar } from '../Calendar';
import { RichTextEditor } from '../RichTextEditor';
import { DiaryHeader } from '../diary/DiaryHeader';
import { useDiaryEntries } from '../../hooks/useDiaryEntries';
import { SearchResults } from '../diary/SearchResults';
import { DiaryEntry } from '../../types/diary';
import { format } from 'date-fns';
import { AiInsightChat } from '../chat/AiInsightChat';

export const DiaryApp: React.FC = () => {
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

  const searchResults = useMemo(() => {
    console.log('Search query:', searchQuery);
    console.log('Available entries:', entries.length);

    if (!searchQuery) {
      console.log('No search query, returning empty results');
      return [];
    }

    const query = searchQuery.toLowerCase();
    console.log('Lowercase query:', query);

    const results = entries.filter(entry => {
      const dateText = format(new Date(entry.date), 'EEEE, MMMM d, yyyy').toLowerCase();
      const contentText = entry.content.toLowerCase();
      
      const matchesDate = dateText.includes(query);
      const matchesContent = contentText.includes(query);

      console.log('Entry date:', dateText);
      console.log('Entry content preview:', contentText.slice(0, 50));
      console.log('Matches date:', matchesDate);
      console.log('Matches content:', matchesContent);

      return matchesContent || matchesDate;
    });

    console.log('Search results:', results.length);
    return results;
  }, [entries, searchQuery]);

  const handleSearchResultClick = (entry: DiaryEntry) => {
    console.log('Search result clicked:', {
      id: entry.id,
      date: format(new Date(entry.date), 'yyyy-MM-dd'),
      contentPreview: entry.content.slice(0, 50)
    });

    setSelectedDate(new Date(entry.date));
    setSearchQuery('');
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Search input changed:', value);
    setSearchQuery(value);
  };

  const sidebar = (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={handleSearchInputChange}
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

      {/* Show search results in sidebar */}
      {searchQuery && (
        <SearchResults
          entries={searchResults}
          searchQuery={searchQuery}
          onEntryClick={handleSearchResultClick}
        />
      )}
    </div>
  );

  const main = (
    <div className="space-y-6">
      <DiaryHeader 
        selectedDate={selectedDate}
        saveStatus={saveStatus}
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <RichTextEditor
          content={content}
          onChange={(newContent) => {
            setContent(newContent);
          }}
        />
      </div>
    </div>
  );

  return (
    <MainLayout sidebar={sidebar} main={main} />
  );
}; 