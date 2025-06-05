"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, Clock, BadgeCheck } from "lucide-react";
import ReactPaginate from "react-paginate";
import Button from "../Button";
import type { DealProductDto } from "../../utils/dtos/deals.dtos";

export interface PaginatedProductGridProps {
  products: DealProductDto[];
  itemsPerPage: number;
  onQuoteRequest: (product: DealProductDto) => void;
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
          <div
            key={product.id}
            className="bg-white overflow-hidden m-4 rounded-xl shadow-md"
          >
            <div className="relative">
              <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                <Image
                  src={product.productThumbnail || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80'}
                  alt="Waterproof Laminate Flooring"
                  width={100}
                  height={100}
                  className="w-full h-56 object-cover rounded-xl"
                />
              </div>
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow">
                {product.availability}
              </div>
            </div>
            <div className="p-3 flex flex-col gap-2">
              <div className="flex justify-between">
                <h3 className="text-lg w-[60%] font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <div className="flex flex-col">
                  <p className="font-semibold text-lg text-yellow-400">
                    {product.price}
                    <span className="text-sm text-yellow-400"> Rwf</span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2 overflow">
                {product.description}
              </p>
              <div className="mb-3 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-2" />
                  <span>
                    Min. Order: {product.minOrder} {product.unit}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Lead Time: {product.leadTime}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
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
              <div className="flex justify-between">
                <Button
                  text={"Request quote"}
                  texSize={"text-sm"}
                  hoverBg={"bg-yellow-500"}
                  borderCol={"border-0"}
                  bgCol={"bg-amber-400"}
                  textCol={"text-white"}
                  border={"border-1"}
                  handleButton={() => onQuoteRequest(product)}
                  padding={"p-7"}
                  round={"rounded-md"}
                />
                <Button
                  text={"View details"}
                  texSize={"text-sm"}
                  hoverBg={""}
                  borderCol={"border-yellow-400"}
                  bgCol={"bg-white"}
                  textCol={"text-yellow-400"}
                  border={"border-1"}
                  handleButton={() => onQuoteRequest(product)}
                  padding={"p-7"}
                  round={"rounded-md"}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
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
