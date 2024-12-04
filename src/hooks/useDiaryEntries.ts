import { useState, useCallback, useEffect } from 'react';
import { isSameDay, startOfDay, subDays, isAfter } from 'date-fns';
import { ChatMessage } from '../types/chat';
import { aiService } from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';
import * as diaryService from '../services/diaryService';

export interface DiaryEntry {
  id: string;
  content: string;
  date: Date;
}

type Role = 'user' | 'assistant' | 'system';

interface ChatMessage {
  role: Role;
  content: string;
}

export const useDiaryEntries = () => {
  const { user, encryptionKey } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'generating-insight' | null>(null);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  // Load all entries
  const loadEntries = useCallback(async () => {
    if (!user || !encryptionKey) return;
    try {
      const loadedEntries = await diaryService.getUserEntries(user.uid, encryptionKey);
      setEntries(loadedEntries);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  }, [user, encryptionKey]);

  // Initial load
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Save entry
  const saveEntry = useCallback(async (contentToSave: string = content) => {
    if (!user || !encryptionKey || !contentToSave.trim()) {
      setSaveStatus(null);
      return false;
    }

    setSaveStatus('saving');
    try {
      const currentDate = startOfDay(selectedDate);
      const existingEntry = entries.find(entry => 
        isSameDay(new Date(entry.date), currentDate)
      );

      if (existingEntry) {
        await diaryService.updateEntry(user.uid, existingEntry.id, {
          content: contentToSave,
          date: currentDate,
        }, encryptionKey);
        setCurrentEntryId(existingEntry.id);
      } else {
        const entryId = await diaryService.createEntry(user.uid, {
          content: contentToSave,
          date: currentDate,
        }, encryptionKey);
        setCurrentEntryId(entryId);
      }

      setLastSavedContent(contentToSave);
      setSaveStatus('saved');
      
      // Load entries in the background
      loadEntries();
      
      // Clear save status after a short delay
      setTimeout(() => {
        if (contentToSave === content) {
          setSaveStatus(null);
        }
      }, 500);

      return true;
    } catch (error) {
      console.error('Failed to save entry:', error);
      setSaveStatus(null);
      return false;
    }
  }, [user, encryptionKey, selectedDate, entries, content, loadEntries]);

  // Update content with immediate feedback
  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
    if (newContent !== lastSavedContent) {
      setSaveStatus('saving');
    }
  }, [lastSavedContent]);

  // Auto-save when content changes
  useEffect(() => {
    if (!user || !encryptionKey || content === lastSavedContent) {
      return;
    }

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    const timer = setTimeout(() => {
      saveEntry(content);
    }, 300);

    setSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [content, lastSavedContent, saveEntry, user, encryptionKey]);

  // Handle date selection
  const handleDateSelect = useCallback(async (newDate: Date) => {
    const normalizedNewDate = startOfDay(newDate);
    
    // Save current content before switching if there are changes
    if (content !== lastSavedContent) {
      await saveEntry(content);
    }

    setSelectedDate(normalizedNewDate);
    
    // Find entry for the new date
    const entry = entries.find(e => 
      isSameDay(new Date(e.date), normalizedNewDate)
    );
    
    if (entry) {
      setContent(entry.content);
      setLastSavedContent(entry.content);
      setCurrentEntryId(entry.id);
    } else {
      setContent('');
      setLastSavedContent('');
      setCurrentEntryId(null);
    }
    
    setSaveStatus(null);
  }, [content, lastSavedContent, saveEntry, entries]);

  // Load entry when date changes
  useEffect(() => {
    if (!entries.length) return;

    const currentDate = startOfDay(selectedDate);
    const entry = entries.find(e => isSameDay(new Date(e.date), currentDate));
    
    if (entry) {
      setContent(entry.content);
      setLastSavedContent(entry.content);
      setCurrentEntryId(entry.id);
    } else {
      setContent('');
      setLastSavedContent('');
      setCurrentEntryId(null);
    }
  }, [selectedDate, entries]);

  // Get relevant entries for context
  const getRelevantEntries = useCallback(() => {
    console.log('Getting relevant entries...');
    if (!entries.length) {
      console.log('No entries found');
      return [];
    }

    // Sort entries by date, newest first
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    console.log('Sorted entries:', sortedEntries.length);

    // Get recent entries (last 7 days)
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentEntries = sortedEntries.filter(entry => 
      isAfter(new Date(entry.date), sevenDaysAgo)
    );
    console.log('Recent entries:', recentEntries.length);

    // Get current entry if it exists
    const currentEntry = entries.find(e => 
      isSameDay(new Date(e.date), selectedDate)
    );
    console.log('Current entry found:', !!currentEntry);

    // Combine and deduplicate entries
    const relevantEntries = Array.from(new Set([
      ...(currentEntry ? [currentEntry] : []),
      ...recentEntries
    ]));
    console.log('Total relevant entries:', relevantEntries.length);

    return relevantEntries;
  }, [entries, selectedDate]);

  // Send message to AI with context
  const sendMessage = useCallback(async (messageContent: string) => {
    console.log('sendMessage called with:', messageContent);
    
    if (!user || !encryptionKey) {
      console.error('Missing user or encryption key');
      return;
    }
    
    if (isGenerating) {
      console.log('Already generating response, skipping');
      return;
    }
    
    if (!messageContent.trim()) {
      console.log('Empty message, skipping');
      return;
    }

    try {
      console.log('Starting message processing...');
      
      // Add user message immediately
      const userMessage: ChatMessage = { role: 'user', content: messageContent };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsGenerating(true);
      console.log('User message added:', userMessage);

      // Get relevant entries for context
      const relevantEntries = getRelevantEntries();
      console.log('Retrieved relevant entries:', relevantEntries.length);
      
      const context = relevantEntries.map(entry => ({
        date: entry.date.toISOString().split('T')[0],
        content: entry.content
      }));
      console.log('Context prepared:', context.length, 'entries');

      // Create system message with context
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `You are an AI assistant helping with journal entries. Here are some relevant entries for context:
${context.map(e => `[${e.date}]: ${e.content}`).join('\n\n')}

Please use this context to provide insightful responses. Be empathetic and helpful.`
      };
      console.log('System message created');

      // Get AI response with streaming updates
      console.log('Calling AI service...');
      let fullResponse = '';
      await aiService.chat([systemMessage, ...messages, userMessage], (progress) => {
        console.log('Received progress:', progress.slice(0, 50) + '...');
        fullResponse = progress;
        setMessages(prev => {
          const withoutLastAssistant = prev.filter(m => 
            !(m.role === 'assistant' && m === prev[prev.length - 1])
          );
          return [...withoutLastAssistant, { role: 'assistant' as Role, content: progress }];
        });
      });
      console.log('AI response completed');

      // Update messages with final response
      const finalMessages: ChatMessage[] = [
        ...updatedMessages,
        { role: 'assistant', content: fullResponse }
      ];
      setMessages(finalMessages);
      console.log('Final messages updated');

      // Log the conversation
      await diaryService.saveChatHistory(user.uid, finalMessages, encryptionKey);
      console.log('Chat history saved');

    } catch (error) {
      console.error('Error in sendMessage:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      } as ChatMessage]);
    } finally {
      setIsGenerating(false);
      console.log('Message processing completed');
    }
  }, [user, encryptionKey, isGenerating, messages, getRelevantEntries]);

  return {
    selectedDate,
    setSelectedDate: handleDateSelect,
    content,
    setContent: updateContent,
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
    setIsChatMinimized,
  };
};