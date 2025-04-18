"use client";

import React, { useState, useEffect } from "react";
import { sampleProducts } from "../../utils/fakes/ProductFakes";
import QuoteFormModal from "./QuotaModal";
import PaginatedProductGrid from "./ProductSection";
import SearchFilter from "../sections/Seach_Filter";
import HeaderSection from "./HeaderSection";

export interface DealProduct {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  minOrder: number;
  unit: string;
  image: string;
  marketPrice: number;
  availability: "In Stock" | "Made to Order" | "Limited Stock";
  leadTime: string;
  features: string[];
  certifications: string[];
}

export interface FormData {
  company: string;
  contact: string;
  email: string;
  phone: string;
  requirements: string;
  deliveryLocation: string;
  preferredDeliveryDate: string;
}

const ITEMS_PER_PAGE = 3;

const Page: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<DealProduct | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(0);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    company: "",
    contact: "",
    email: "",
    phone: "",
    requirements: "",
    deliveryLocation: "",
    preferredDeliveryDate: "",
  });

  // SEARCH-FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortBy, setSortBy] = useState<"basePrice" | "marketPrice" | "name">(
    "basePrice"
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(0);

  // FILTER-SORT LOGIC FOR PRODUCTS
  const filteredProducts = sampleProducts
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a[sortBy] - b[sortBy];
    });

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(0, value));
  };

  const calculateTotal = () => {
    if (!selectedProduct || quantity < selectedProduct.minOrder) return 0;
    let price = selectedProduct.basePrice;

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

  // FILTER & SEARCH

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  // PRODUCT GRID
  const handleQuoteRequest = (product: DealProduct) => {
    setSelectedProduct(product);
    setQuantity(product.minOrder);
    setShowQuoteForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <HeaderSection
          header="Bulk Deals & Custom Quotes"
          description="Get competitive prices on bulk orders and custom requirements. Compare market rates and negotiate deals directly."
        />

        {/* SEARCH & FILTER */}
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

        {/* PRODUCT GRID PAGINATION */}
        <PaginatedProductGrid
          products={filteredProducts}
          itemsPerPage={ITEMS_PER_PAGE}
          onQuoteRequest={handleQuoteRequest}
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
    </div>
  );
};
export default Page;