import React from 'react';
import { ReviewType } from '@/app/utils/fakes/ProductFakes';
import ReviewCard from '@/app/(components)/product/ReviewCard';
import { DialogDemo } from '@/app/(components)/shad/ShadDialog';
import { Shop } from '@/types/shop';

interface ReviewsProps {
  reviews: ReviewType[];
  shop?: Shop;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, shop }) => {
  console.log('=== Reviews Component ===');
  console.log('Received shop prop:', shop);
  console.log('Shop name:', shop?.name);
  console.log('Shop seller businessName:', shop?.seller?.businessName);
  console.log('Reviews array:', reviews);
  
  const shopName = shop?.name || shop?.seller?.businessName || 'this shop';
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-[100%] p-3 sm:w-[60%] m-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <p className='text-red-400'>No reviews yet for {shopName}.</p>
      </div>
    );
  }

  return (
    <div className="w-[100%] p-3 sm:w-[60%] my-8">
      <div className='flex justify-between'>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews for {shopName}</h2>
        <DialogDemo shop={shop}/>
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