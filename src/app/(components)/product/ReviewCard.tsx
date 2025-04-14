import Image from 'next/image';
import React from 'react';
import { StaticImageData } from 'next/image';

interface ReviewInterface {
  rating: number;
  comment: string;
  image: StaticImageData;
  user: string;
  id?: string;
}

const ReviewCard: React.FC<ReviewInterface> = ({
  rating,
  comment,
  image,
  user,
}) => {
  return (
    <>
      <div className="flex gap-5 rounded-2xl">
        <div className="flex items-center justify-center">
          <Image
            src={image}
            alt=""
            className="rounded-full h-[60px] w-[60px] border-black-1 "
          />
        </div>
        <div className="flex flex-col py-4">
          <span className="text-[13px] font-bold">
            {user}
          </span>
          <span className="text-[12px]">{'⭐'.repeat(rating)}</span>
          <span className="text-[13px] bold">
            {comment.length > 30
              ? comment.substring(0, 30) + '...'
              : comment}
          </span>
        </div>
      </div>
    </>
  );
};
export default ReviewCard;
