import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from './Button';

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const thumbnail = product.thumbnailUrl || (product.images && product.images[0]?.url) || '/products/placeholder.jpg';
  const altText = product.images && product.images[0]?.alt || product.name;
  const name = product.name;
  const price = product.discountedPrice || product.price;
  const originalPrice = product.discountedPrice ? product.price : null;
  const productId = product.id;

  return (
    <Link href={`/product/${productId}`} className="block">
      <div className="bg-white overflow-hidden w-64 m-2 hover:shadow-lg cursor-pointer hover:rounded-xl transition-shadow">
        <div className="relative">
          <Image
            src={thumbnail}
            alt={altText}
            width={300}
            height={224}
            className="w-full h-56 object-cover rounded-xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/products/placeholder.jpg';
            }}
          />
          <div className="absolute top-2 right-2 border text-gray-100 rounded-full p-3 flex items-center justify-center cursor-pointer shadow-sm hover:bg-yellow-400 hover:border-yellow-400 transition-colors">
            <Heart className="text-gray-100" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <h3 className="text-md font-semibold text-gray-900 w-[60%] mb-1">
              {name}
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-2 overflow">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div>
              {originalPrice && (
                <span className="line-through text-gray-400 text-sm mr-2">
                  RwF {originalPrice.toLocaleString()}
                </span>
              )}
              <span className="font-semibold text-md text-yellow-400">
                {price} <span className="text-sm text-yellow-400">Rwf</span>
              </span>
            </div>
          </div>
          <Button
            text={"Add to cart"}
            texSize={"text-sm"}
            hoverBg={"hover:bg-yellow-400"}
            borderCol={"border-yellow-300"}
            bgCol={"white"}
            textCol={"text-gray-800"}
            border={"border-1"}
            handleButton={() => alert(`Add to Cart clicked for ${product.name}`)}
            padding={"p-3"}
            round={"rounded-full"}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;