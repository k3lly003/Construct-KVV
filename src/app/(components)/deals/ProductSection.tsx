"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Package, Clock, BadgeCheck } from 'lucide-react';
import ReactPaginate from 'react-paginate';
// import type { DealProduct } from '../types/deals'; // Assuming this type exists


export interface DealProduct {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    minOrder: number;
    unit: string;
    image: string;
    marketPrice: number;
    availability: 'In Stock' | 'Made to Order' | 'Limited Stock';
    leadTime: string;
    features: string[];
    certifications: string[];
}

interface PaginatedProductGridProps {
  products: DealProduct[];
  itemsPerPage: number;
  onQuoteRequest: (product: DealProduct) => void;
}

const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = ({
  products,
  itemsPerPage,
  onQuoteRequest,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(products.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentProducts = products.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {currentProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-48">
              <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow">
                {product.availability}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500">Market Price:</span>
                <span className="ml-2 text-lg font-semibold text-gray-900">${product.marketPrice}/{product.unit}</span>
                <span className="ml-4 text-sm text-gray-500">Base Price:</span>
                <span className="ml-2 text-lg font-semibold text-green-600">${product.basePrice}/{product.unit}</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-2" />
                  <span>Min. Order: {product.minOrder} {product.unit}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Lead Time: {product.leadTime}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {product.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs text-gray-600"
                  >
                    <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
                    {cert}
                  </div>
                ))}
              </div>
              <button
                onClick={() => onQuoteRequest(product)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Request Quote
              </button>
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center items-center space-x-2 mt-8"
          pageClassName="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          previousLinkClassName="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          nextLinkClassName="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          activeClassName="bg-blue-500 text-white hover:bg-blue-600"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      )}
    </div>
  );
};

export default PaginatedProductGrid;