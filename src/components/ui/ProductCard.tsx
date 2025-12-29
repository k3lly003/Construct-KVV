// import Image, { StaticImageData } from 'next/image';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { getAverageRating, ReviewType } from '@/app/utils/fakes/ProductFakes';

interface ProductCardProps  {
  productThumbnail: string | StaticImageData,
  altText: string,
  productName: string,
  reviews: ReviewType[],
  discountedPrice: number
}

const ProductCard = ({
  productThumbnail,
  altText,
  productName,
  reviews,
  discountedPrice
}: ProductCardProps) => {
  const rating = getAverageRating(reviews);

  return (
    <div className="relative hover:shadow-md transition-shadow duration-200 space-y-3 mb-5">
      <div className="aspect-w-1 h-40 w-full overflow-hidden">
        <Image
          src={productThumbnail}
          alt={altText}
          width={300}
          height={300}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/products/placeholder.jpg';
          }}
        />
      </div>
      <div className="p-4 h-30 flex flex-col gap-3">
        <h3 className="text-small font-medium text-gray-900">
          <a href="#">
            <span aria-hidden="true" className="absolute inset-0" />
            {productName}
          </a>
        </h3>
        <div className="mt-1 flex items-center">
          <FaStar className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          <p className="ml-1 text-small text-gray-500">{rating}</p>
        </div>
        <div className="mt-2 flex items-baseline">
          <p className="font-semibold text-gray-900">
            RwF {discountedPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;