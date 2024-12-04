import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { ChatMessage } from '../types/chat';

const initProgressCallback = (initProgress: any) => {
  console.log(initProgress);
}

const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";

class AIService {
  private engine: Awaited<ReturnType<typeof CreateMLCEngine>> | null = null;
  private isInitialized: boolean = false;

  async init() {
    if (!this.isInitialized) {
      this.engine = await CreateMLCEngine(
        selectedModel,
        { initProgressCallback }
      );
      await this.engine.reload(selectedModel);
      this.isInitialized = true;
    }
  }

  async chat(messages: ChatMessage[], onProgress?: (text: string) => void): Promise<string> {
    await this.init();
    
    if (!this.engine) {
      return "Unable to respond at this time.";
    }

    try {
      const chunks = await this.engine.chat.completions.create({
        messages: messages,
        temperature: 0.7,
        stream: true,
        stream_options: { include_usage: true }
      });

      let reply = "";
      for await (const chunk of chunks) {
        const newContent = chunk.choices[0]?.delta.content || "";
        reply += newContent;
        
        if (onProgress) {
          onProgress(reply);
        }
      }

      return reply.trim();
    } catch (error) {
      console.error('Error in chat:', error);
      return "Unable to respond at this time.";
    }
  }

  async cleanup() {
    if (this.engine) {
      await this.engine.terminate();
      this.isInitialized = false;
    }
  }
}

export const aiService = new AIService(); 