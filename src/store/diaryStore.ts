import { create } from 'zustand';
import { DiaryState, DiaryEntry } from '../types/diary';

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  
  addEntry: (entry) => set((state) => ({
    entries: [...state.entries, { ...entry, id: crypto.randomUUID() }]
  })),
  
  deleteEntry: (id) => set((state) => ({
    entries: state.entries.filter(entry => entry.id !== id)
  })),
  
  updateEntry: (id, updatedEntry) => set((state) => ({
    entries: state.entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    )
  })),
  
  searchEntries: (query) => {
    const { entries } = get();
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.content.toLowerCase().includes(lowercaseQuery)
    );
  }
}));