export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isGenerating: boolean;
} 