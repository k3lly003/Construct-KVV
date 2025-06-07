"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { reviewsData } from '@/app/utils/fakes/HomeFakes';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GenericButton } from "@/components/ui/generic-button";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewsData.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviewsData.length) % reviewsData.length);
  }, []);

  useEffect(() => {
    const startTimer = () => {
      return setInterval(() => {
        nextSlide();
      }, 5000);
    };

    const timer = startTimer();
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={reviewsData[currentIndex].image.toString()} alt={reviewsData[currentIndex].name} />
              <AvatarFallback>{reviewsData[currentIndex].name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{reviewsData[currentIndex].name}</h3>
              {reviewsData[currentIndex].affiliation && (
                <p className="text-sm text-gray-500">{reviewsData[currentIndex].affiliation}</p>
              )}
            </div>
          </div>
          <p className="mt-4 text-gray-600 italic">&quot{reviewsData[currentIndex].quote}&quot</p>
        </CardContent>
      </Card>

      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
        <GenericButton
          variant="outline"
          size="sm"
          onClick={prevSlide}
          className="rounded-full bg-white/80 hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </GenericButton>
        <GenericButton
          variant="outline"
          size="sm"
          onClick={nextSlide}
          className="rounded-full bg-white/80 hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </GenericButton>
      </div>
    </div>
  );
};

export default TestimonialCarousel;