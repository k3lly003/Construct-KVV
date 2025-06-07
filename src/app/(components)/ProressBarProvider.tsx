'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import PageLoader from '@/app/(components)/Navbar/PageLoader';

interface ProgressBarContextType {
  startLoading: () => void;
  stopLoading: () => void;
  isLoading: boolean;
}

// Create a context
const ProgressBarContext = createContext<ProgressBarContextType | undefined>(undefined);

interface ProgressBarProviderProps {
  children: React.ReactNode;
}

export const ProgressBarProvider: React.FC<ProgressBarProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Functions to control loading state
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Use useEffect to listen for route changes
  useEffect(() => {
    // This effect runs on route changes (pathname or searchParams)
    // and when the component mounts on the client.
    startLoading(); // Start loading when a new route is initiated or on initial load
    
    // The clean-up function runs when the component unmounts or before the effect re-runs.
    // In this case, it helps stop loading after the page content is rendered.
    const timer = setTimeout(() => {
      stopLoading(); // Stop loading after a short delay to ensure content is ready
    }, 300); // Small delay to show progress bar even on fast navigations

    return () => clearTimeout(timer); // Clean up the timer
  }, [pathname, searchParams, startLoading, stopLoading]); // Re-run effect when pathname or searchParams change

  return (
    //  <Suspense fallback={<div>Loading...</div>}>
    <ProgressBarContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      <PageLoader isLoading={isLoading} /> {/* Render the visual loader */}
      {children}
    </ProgressBarContext.Provider>
    // </Suspense>
  );
};

// Custom hook to use the progress bar context
export const useProgressBar = () => {
  const context = useContext(ProgressBarContext);
  if (context === undefined) {
    throw new Error('useProgressBar must be used within a ProgressBarProvider');
  }
  return context;
};

export default ProgressBarProvider; // Export as default for your layout