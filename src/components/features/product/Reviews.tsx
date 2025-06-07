import React from 'react';
import { ReviewType } from '@/app/utils/fakes/ProductFakes';
import ReviewCard from './ReviewCard';
import { DialogDemo } from '@/app/(components)/shad/ShadDialog';

interface ReviewsProps {
  reviews: ReviewType[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-[100%] p-3 sm:w-[60%] m-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <p className='text-red-400'>No reviews yet for this product.</p>
      </div>
    );
  }

  return (
    <div className="w-[100%] p-3 sm:w-[60%] my-8">
      <div className='flex justify-between'>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <DialogDemo/>
      </div>
      <div className="flex flex-col sm:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id || review.user}
            rating={review.rating}
            comment={review.comment}
            image={review.image}
            user={review.user}
          />
        ))}
      </div>
    </div>
  );
};

export default Reviews;