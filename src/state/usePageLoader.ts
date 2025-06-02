'use client'
import { useState, useCallback } from 'react';

interface UsePageLoaderReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  simulateNavigation: () => Promise<void>;
}

export const usePageLoader = (): UsePageLoaderReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const simulateNavigation = useCallback(async (): Promise<void> => {
    startLoading();
    
    // Simulate navigation/loading time
    const loadTime = Math.random() * 3000 + 2000;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        stopLoading();
        resolve();
      }, loadTime);
    });
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    simulateNavigation,
  };
};