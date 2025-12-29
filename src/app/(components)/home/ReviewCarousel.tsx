// Conceptual ReviewCarousel.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarouselCard from "@/app/(components)/home/carouselCard";
import { Review } from "@/app/utils/fakes/HomeFakes";

interface Props {
  reviews: Review[];
}

const ReviewCarousel: React.FC<Props> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <>
      <div className="flex self-center">
        <h1 className="font-bold text-title my-10">Why use Kvv for your project ?</h1>
      </div>
      <div className="relative max-w-6xl flex justify-center self-center w-full overflow-hidden">
        <AnimatePresence initial={false} custom={reviews[currentIndex]?.id}>
          <motion.div
            key={reviews[currentIndex]?.id}
            custom={currentIndex}
            className="p-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ damping: 20 }}
          >
            <CarouselCard review={reviews[currentIndex]} />
          </motion.div>
        </AnimatePresence>

        {/* Glimpses of previous and next reviews */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer"
          onClick={goToPrev}
        >
          {reviews[(currentIndex - 1 + reviews.length) % reviews.length]
            ?.id && (
            <motion.div
              key={
                reviews[(currentIndex - 1 + reviews.length) % reviews.length]
                  ?.id
              } // Use review ID
              className="opacity-5"
            >
              <CarouselCard
                review={
                  reviews[(currentIndex - 1 + reviews.length) % reviews.length]
                }
              />
            </motion.div>
          )}
        </div>
        <div
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
          onClick={goToNext}
        >
          {reviews[(currentIndex + 1) % reviews.length]?.id && (
            <motion.div
              key={reviews[(currentIndex + 1) % reviews.length]?.id} // Use review ID
              className="opacity-5"
            >
              <CarouselCard
                review={reviews[(currentIndex + 1) % reviews.length]}
              />
            </motion.div>
          )}
        </div>

        {/* Optional: Navigation dots */}
        {/* <div className="absolute bottom-2 flex justify-center mt-4">
      {reviews.map((review, index) => (
        <button
          key={review.id || index}
          className={`w-3 h-3 rounded-full mx-1 ${
            currentIndex === index ? 'bg-yellow-500' : 'bg-gray-300'
          }`}
          onClick={() => setCurrentIndex(index)}
        ></button>
      ))}
    </div> */}
      </div>
    </>
  );
};

export default ReviewCarousel;
