import React from 'react';
import { ReviewType } from '@/app/utils/fakes/ProductFakes';
import ReviewCard from '@/app/(components)/product/ReviewCard';
import { DialogDemo } from '@/app/(components)/shad/ShadDialog';
import { Shop } from '@/types/shop';

interface ReviewsProps {
  reviews: ReviewType[];
  shop?: Shop;
  showReviewDialog?: () => void;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, shop, showReviewDialog }) => {
  const shopName = shop?.name || shop?.seller?.businessName || 'this shop';
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-[100%] p-3 sm:w-[60%] m-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <p className='text-red-400'>No reviews yet for {shopName}.</p>
        {showReviewDialog && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={showReviewDialog}
          >
            Write a Review
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-[100%] p-3 sm:w-[60%] my-8">
      <div className='flex justify-between'>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews for {shopName}</h2>
        <DialogDemo shop={shop}/>
        {showReviewDialog && (
          <button
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={showReviewDialog}
          >
            Write a Review
          </button>
        )}
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