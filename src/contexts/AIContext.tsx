import React, { createContext, useContext, useEffect, useState } from 'react';
import { aiService } from '../services/aiService';

interface AIContextType {
  isAIReady: boolean;
  isLoading: boolean;
  loadingProgress: string;
}

const AIContext = createContext<AIContextType>({
  isAIReady: false,
  isLoading: true,
  loadingProgress: ''
});

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIReady, setIsAIReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState('');

  useEffect(() => {
    const initAI = async () => {
      try {
        setIsLoading(true);
        await aiService.init((progress: string) => {
          console.log('AI Loading Progress:', progress);
          setLoadingProgress(progress);
        });
        setIsAIReady(true);
      } catch (error) {
        console.error('Failed to initialize AI:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAI();
  }, []);

  return (
    <AIContext.Provider value={{ isAIReady, isLoading, loadingProgress }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}; 