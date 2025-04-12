import React from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { FaStar } from 'react-icons/fa';

// Sample product data (replace with your actual data)
interface Product {
  name: string;
  imageSrc: string;
  altText: string;
  rating: string;
  originalPrice: number;
  discountedPrice: number;
}

const productData: Product[] = [
  {
    name: 'Constructor Jacket',
    imageSrc: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80',
    altText: 'Constructor Jacket',
    rating: '4.5',
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: 'Black cable Restorer',
    imageSrc: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80',
    altText: 'Black cable Restorer',
    rating: '4.5',
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: 'Black Die Grinder',
    imageSrc: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
    altText: 'Black Die Grinder',
    rating: '4.5',
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: 'Boots',
    imageSrc: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
    altText: 'Black Die Grinder Drill',
    rating: '4.5',
    originalPrice: 56000,
    discountedPrice: 19000,
  },
];

const ProductCarousel: React.FC = () => {
  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 space-x-5">
          {productData.map((product) => (
            <div key={product.name} className="relative hover:shadow-md transition-shadow duration-200 space-y-3">
              <div className="aspect-w-1 h-40 w-full overflow-hidden">
                <Image
                  src={product.imageSrc}
                  alt={product.altText}
                  layout="responsive"
                  width={300}
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="p-4 h-30 flex flex-col gap-3">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href="#">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <div className="mt-1 flex items-center">
                  <FaStar  className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <p className="ml-1 text-sm text-gray-500">{product.rating}</p>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="ml-2 font-semibold text-red-500 line-through">RwF {product.originalPrice.toLocaleString()}</p>
                  <p className="font-semibold text-gray-900">RwF {product.discountedPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* NAVIGATION BUTTONS */}
        <div className="mt-6 flex justify-end space-x-2">
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
             <ChevronLeft className="h-5 w-5 text-amber-300"/>
          </button>
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
             <ChevronRight className="h-5 w-5"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;