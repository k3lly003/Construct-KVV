"use client";

import { BadgeCheck, Clock, FolderOpen, Package } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/app/(components)/Button";
import { singleDealProduct } from "@/app/utils/fakes/ProductFakes";
import QuoteFormModal from "@/app/(components)/deals/QuotaModal";
import { DealProductDto, FormDataDto } from "@/app/utils/dtos/deals.dtos";

const DetailedSection: React.FC = () => {
  const product: DealProductDto = singleDealProduct;

  const [quantity, setQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<DealProductDto | null>(
    null
  );
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState<FormDataDto>({
    company: "",
    contact: "",
    email: "",
    phone: "",
    requirements: "",
    deliveryLocation: "",
    preferredDeliveryDate: "",
  });

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(0, value));
  };

  const calculateTotal = () => {
    if (!selectedProduct || quantity < selectedProduct.minOrder) return 0;
    let price = selectedProduct.price ?? 0;

    // Volume discount tiers
    if (quantity >= selectedProduct.minOrder * 5) {
      price *= 0.85; // 15% discount
    } else if (quantity >= selectedProduct.minOrder * 3) {
      price *= 0.9; // 10% discount
    } else if (quantity >= selectedProduct.minOrder * 2) {
      price *= 0.95; // 5% discount
    }

    return price * quantity;
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote submitted:", {
      product: selectedProduct,
      quantity,
      ...formData,
    });
    setShowQuoteForm(false);
    setFormData({
      company: "",
      contact: "",
      email: "",
      phone: "",
      requirements: "",
      deliveryLocation: "",
      preferredDeliveryDate: "",
    });
  };

  // PRODUCT GRID
  const handleQuoteRequest = (product: DealProductDto) => {
    setSelectedProduct(product);
    setQuantity(product.minOrder);
    setShowQuoteForm(true);
  };
  return (
    <>
      <div className="flex flex-col gap-5 py-5">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            {product.name}
          </h1>
          <div className="flex items-center mb-2">
            <FolderOpen className="h-5 w-5 text-yellow-400 mr-1" />
            <p className="text-md text-gray-500 ml-2">
              <span className="text-green-400">15</span> Placed Bids
            </p>
          </div>
          {/* ... rest of the details section ... */}
          <div className="flex gap-3 items-center mb-3">
            {product.saleInfo?.onSale ? (
              <>
                <p className="font-semibold text-xl text-green-500 mr-2">
                  {product.price?.toFixed(0)}Rwf
                </p>
                <p className="text-red-500 line-through mr-2">
                  Was {product.saleInfo.originalPrice?.toFixed(0)}Rwf
                </p>
                {product.saleInfo.discountPercentage && (
                  <span className="text-sm text-green-500">
                    ({product.saleInfo.discountPercentage}% Off)
                  </span>
                )}
                {product.saleInfo.offerEnds && (
                  <span className="text-xs text-gray-600 ml-2">
                    Limited time offer ends {product.saleInfo.offerEnds}
                  </span>
                )}
              </>
            ) : (
              <p className="font-semibold text-xl text-yellow-400">
                ${product.price?.toFixed(2)} / {product.unit}
              </p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Style:</h3>
            <div className="flex items-center gap-2">
              {product.availableStyles?.map((style) => (
                <button
                  key={style}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    product.selectedStyle === style
                      ? "border-blue-500 font-semibold"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mb-4 space-y-2">
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
            <div className="flex items-center text-sm text-gray-600">
              <BadgeCheck className="h-4 w-4 text-green-500 mr-2" />
              <span>Certification: {product.certifications.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Button
          text={"Request Quote"}
          texSize={"text-sm"}
          hoverBg={"bg-amber-500"}
          borderCol={"border-0"}
          bgCol={"bg-amber-400"}
          textCol={"text-white"}
          border={"border-1"}
          handleButton={() => handleQuoteRequest(product)} // Call handleQuoteRequest with the current product
          padding={"p-3"}
          round={"rounded-md"}
        />
        {/* QUOTE MODEL */}
        <QuoteFormModal
          isOpen={showQuoteForm}
          onClose={() => setShowQuoteForm(false)}
          product={selectedProduct}
          initialQuantity={quantity}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmitQuote={handleSubmitQuote}
          onQuantityChange={handleQuantityChange}
          calculateTotal={calculateTotal}
        />
      </div>
    </>
  );
};

export default DetailedSection;
