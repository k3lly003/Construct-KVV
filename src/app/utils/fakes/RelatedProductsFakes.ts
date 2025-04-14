export interface ReviewType {
    id: string;
    rating: number;
    comment: string;
    user: string;
    date: string;
  }
  
  export interface ProductType {
    id: string;
    productName: string;
    productPrice: number;
    productThumbnail: string;
    productDescription: string;
    reviews: ReviewType[];
    category?: string;
  }
  
  export const relatedProducts: ProductType[] = [
    {
      id: '1',
      productName: 'Wireless Bluetooth Earbuds',
      productPrice: 35000,
      productThumbnail: '/products/earbuds.jpg',
      productDescription: 'Premium sound quality with 24hr battery life',
      reviews: [
        {
          id: 'rev1',
          rating: 4,
          comment: 'Great sound quality!',
          user: 'John D.',
          date: '2023-10-15',
        },
        {
          id: 'rev2',
          rating: 5,
          comment: 'Excellent battery life',
          user: 'Sarah M.',
          date: '2023-09-28',
        },
      ],
    },
    {
      id: '2',
      productName: 'Smart Fitness Watch',
      productPrice: 55000,
      productThumbnail: '/products/smartwatch.jpg',
      productDescription: 'Track your workouts and health metrics',
      reviews: [
        {
          id: 'rev3',
          rating: 5,
          comment: 'Very accurate heart rate monitor',
          user: 'Mike T.',
          date: '2023-11-02',
        },
      ],
    },
    {
      id: '3',
      productName: 'Portable Bluetooth Speaker',
      productPrice: 45000,
      productThumbnail: '/products/speaker.jpg',
      productDescription: '360° surround sound with deep bass',
      reviews: [
        {
          id: 'rev4',
          rating: 4,
          comment: 'Loud and clear sound',
          user: 'Lisa K.',
          date: '2023-10-20',
        },
        {
          id: 'rev5',
          rating: 3,
          comment: 'Good but battery could be better',
          user: 'David P.',
          date: '2023-09-15',
        },
      ],
    },
    {
      id: '4',
      productName: 'Wireless Charging Pad',
      productPrice: 25000,
      productThumbnail: '/products/charger.jpg',
      productDescription: 'Fast charging for all Qi-enabled devices',
      reviews: [],
    },
  ];