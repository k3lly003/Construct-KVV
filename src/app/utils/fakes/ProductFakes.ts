import jacket01 from "../../../../public/jacket01.webp"
import jacket02 from "../../../../public/jacket02.webp"
import jacket03 from "../../../../public/jacket03.webp"
import jacket04 from "../../../../public/jacket04.webp"
//users
import user1 from "../../../../public/user1.jpeg"
import user2 from "../../../../public/user2.jpeg"
import user3 from "../../../../public/user3.jpeg"
import user4 from "../../../../public/user4.jpeg"
import { StaticImageData } from 'next/image';

// utils/fakes/fakeProductData.ts
export interface ReviewType {
  id?: string;
  image: StaticImageData;
  rating: number;
  comment: string;
  user: string;
}

export interface ProductCardType {
  id: string;
  productThumbnail: StaticImageData;
  productDescription: string;
  reviews: ReviewType[];
  imageSrc: StaticImageData[];
  altText: string;
  productName: string;
  productPrice: number;
  discountedPrice: number;
}

export const fakeProductCards: ProductCardType[] = [
  {
    id: '1',
    productName: 'Wireless Noise-Canceling Headphones',
    productDescription: 'Premium sound with active noise cancellation',
    productPrice: 65000,
    discountedPrice: 55000,
    imageSrc: [jacket02, jacket03, jacket04],
    altText: 'Wireless headphones',
    productThumbnail: jacket01,
    reviews: [
      {
        id: 'rev1',
        image: user1,
        rating: 4,
        comment: 'Great noise cancellation',
        user: 'John D.'
      },
      {
        id: 'rev2',
        image: user2,
        rating: 5,
        comment: 'Excellent battery life',
        user: 'Sarah M.'
      }
    ]
  },
  {
    id: '2',
    productName: 'Smart Fitness Band',
    productDescription: 'Track your workouts and health metrics',
    productPrice: 35000,
    discountedPrice: 29900,
    imageSrc: [jacket02, jacket03, jacket04],
    altText: 'Fitness band',
    productThumbnail: jacket01,
    reviews: [
      {
        id: 'rev3',
        image: user3,
        rating: 4,
        comment: 'Accurate heart rate monitoring',
        user: 'Mike T.'
      }
    ]
  },
  {
    id: '3',
    productName: 'Bluetooth Portable Speaker',
    productDescription: '360° surround sound with deep bass',
    productPrice: 45000,
    discountedPrice: 39900,
    imageSrc: [jacket02, jacket03, jacket04],
    altText: 'Portable speaker',
    productThumbnail: jacket01,
    reviews: [
      {
        id: 'rev4',
        image: user4,
        rating: 5,
        comment: 'Amazing sound quality',
        user: 'Lisa K.'
      },
      {
        id: 'rev5',
        image: user1,
        rating: 3,
        comment: 'Battery could be better',
        user: 'David P.'
      }
    ]
  },
  {
    id: '4',
    productName: 'Wireless Charging Stand',
    productDescription: 'Fast charging for multiple devices',
    productPrice: 30000,
    discountedPrice: 25000,
    imageSrc: [jacket02, jacket03, jacket04],
    altText: 'Wireless charger',
    productThumbnail: jacket01,
    reviews: []
  }
];

// Helper function to calculate average rating
export const getAverageRating = (reviews: ReviewType[]): string => {
  if (!reviews.length) return 'No reviews';
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return average.toFixed(1);
};