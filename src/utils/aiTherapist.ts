import { aiService } from '../services/aiService';
import { ChatMessage } from '../types/chat';

export const generateAiInsight = async (
  content: string, 
  onProgress?: (text: string) => void
): Promise<string> => {
  try {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `Analyze this diary entry: ${content}`
      }
    ];
    return await aiService.chat(messages, onProgress);
  } catch (error) {
    console.error('Failed to generate AI insight:', error);
    return "I'm currently taking a break. Please try again later.";
  }
};