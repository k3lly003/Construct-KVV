'use client'

import React, { useEffect, useState } from 'react';

interface PageLoaderProps {
  isLoading: boolean;
  duration?: number;
}

const PageLoader: React.FC<PageLoaderProps> = ({ isLoading, duration = 2000 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);
      
      // Simulate realistic loading progress
      const intervals: NodeJS.Timeout[] = [];
      
      // Fast initial progress (0-60%)
      const fastProgress = setInterval(() => {
        setProgress(prev => {
          if (prev >= 60) {
            clearInterval(fastProgress);
            return prev;
          }
          return prev + 2;
        });
      }, duration * 0.01);
      intervals.push(fastProgress);
      
      // Medium progress (60-85%)
      setTimeout(() => {
        const mediumProgress = setInterval(() => {
          setProgress(prev => {
            if (prev >= 85) {
              clearInterval(mediumProgress);
              return prev;
            }
            return prev + 0.5;
          });
        }, duration * 0.02);
        intervals.push(mediumProgress);
      }, duration * 0.6);
      
      // Slow final progress (85-95%)
      setTimeout(() => {
        const slowProgress = setInterval(() => {
          setProgress(prev => {
            if (prev >= 95) {
              clearInterval(slowProgress);
              return prev;
            }
            return prev + 0.1;
          });
        }, duration * 0.05);
        intervals.push(slowProgress);
      }, duration * 0.85);
      
      return () => {
        intervals.forEach(interval => clearInterval(interval));
      };
    } else {
      // Complete the progress bar quickly when loading finishes
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 200);
    }
  }, [isLoading, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div 
        className="h-full bg-gradient-to-r from-amber-500 via-amber-600 transition-all duration-200 ease-out shadow-lg"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(139, 92, 246, 0.6), 0 0 5px rgba(139, 92, 246, 0.8)'
        }}
      >
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-transparent to-white opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
};

export default PageLoader;