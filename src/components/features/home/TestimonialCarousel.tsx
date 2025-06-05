"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { reviewsData } from '@/app/utils/fakes/HomeFakes';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
  }, []);

  useEffect(() => {
    const startTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(nextTestimonial, 4000);
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    startTimer();

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener('mouseenter', stopTimer);
      carouselElement.addEventListener('mouseleave', startTimer);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (carouselElement) {
        carouselElement.removeEventListener('mouseenter', stopTimer);
        carouselElement.removeEventListener('mouseleave', startTimer);
      }
    };
  }, [nextTestimonial]);

  return (
    <div ref={carouselRef} className="relative w-full max-w-md mx-auto transition-all duration-300">
      {reviewsData.map((review, index) => (
        <div
          key={review.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4">
              <Image
                src={review.image}
                alt={review.name}
                width={typeof review.image === 'object' && 'width' in review.image ? review.image.width : 64}
                height={typeof review.image === 'object' && 'height' in review.image ? review.image.height : 64}
                objectFit="cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{review.name}</h3>
            {review.affiliation && <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{review.affiliation}</p>}
            <p className="text-gray-700 dark:text-gray-300 text-sm italic">&quot;{review.quote}&quot;</p>
          </div>
        </div>
      ))}
      {/* {reviewsData.length > 1 && (
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black">
          <button onClick={stopTimer} onMouseUp={startTimer} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L7.414 10l5.293 5.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )} */}
      {/* {reviewsData.length > 1 && (
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
          <button onClick={nextTestimonial} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L12.586 10 7.293 4.707a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )} */}
    </div>
  );
};

export default TestimonialCarousel;