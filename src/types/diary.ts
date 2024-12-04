export interface DiaryEntry {
  id: string;
  content: string;
  date: Date;
  aiInsight?: string;
}

export interface DiaryState {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  searchEntries: (query: string) => DiaryEntry[];
}