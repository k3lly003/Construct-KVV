"use client"

import React, { useState } from 'react';
import { Search, Star, ArrowRight, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  isVerified?: boolean;
}

const initialProducts: Service[] = [
  {
    id: '1',
    name: 'Premium Portland Cement',
    category: 'Building Materials',
    price: 12.99,
    stock: 500,
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 128,
    description: 'High-quality Portland cement suitable for all construction needs. Meets ASTM C150 standards.',
    features: ['Type I/II', '94 lb bag', 'Fast setting', 'High strength'],
    isVerified: true
  },
  {
    id: '2',
    name: 'Professional Power Drill',
    category: 'Tools & Equipment',
    price: 199.99,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 89,
    description: 'Heavy-duty cordless drill with brushless motor and variable speed control.',
    features: ['20V Max', '2 batteries included', 'LED light', '1/2" chuck'],
    isVerified: true
  },
  {
    id: '3',
    name: 'Safety Helmet',
    category: 'Safety Gear',
    price: 29.99,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1578874691223-64558a3ca096?auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 156,
    description: 'Type 1 hard hat with 4-point suspension and comfortable padding.',
    features: ['ANSI Z89.1 certified', 'UV resistant', 'Adjustable', 'Ventilated'],
    isVerified: true
  },
  {
    id: '4',
    name: 'Industrial LED Floodlight',
    category: 'Electrical',
    price: 89.99,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1556132208-beefd277390a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SW5kdXN0cmlhbCUyMExFRHxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.6,
    reviews: 42,
    description: 'High-output LED floodlight perfect for construction sites and outdoor areas.',
    features: ['50W', 'IP65 rated', '5000K daylight', 'Mounting bracket included'],
    isVerified: false
  },
  {
    id: '5',
    name: 'Reinforced Concrete Rebar',
    category: 'Building Materials',
    price: 8.50,
    stock: 1000,
    image: 'https://images.unsplash.com/photo-1616621859311-19dff47afafc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UmVpbmZvcmNlZCUyMENvbmNyZXRlJTIwUmViYXJ8ZW58MHx8MHx8fDA%3D',
    rating: 4.5,
    reviews: 67,
    description: 'High-strength steel rebar for concrete reinforcement. Grade 60.',
    features: ['10mm diameter', '20 ft length', 'Corrosion resistant', 'Meets ASTM A706'],
    isVerified: true
  },
  {
    id: '6',
    name: 'Cordless Circular Saw',
    category: 'Tools & Equipment',
    price: 149.50,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1657095544219-6328434702a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Q29yZGxlc3MlMjBDaXJjdWxhciUyMFNhd3xlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.7,
    reviews: 51,
    description: 'Lightweight and powerful cordless circular saw with a 7-1/4 inch blade.',
    features: ['18V Lithium-Ion', '0-50 degree bevel', 'Dust port', 'Blade brake'],
    isVerified: true
  },
  {
    id: '7',
    name: 'Work Gloves (Pair)',
    category: 'Safety Gear',
    price: 15.99,
    stock: 300,
    image: 'https://images.unsplash.com/photo-1644308411047-bd8947ec39e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdvcmtlciUyMGdsb3Zlc3xlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.6,
    reviews: 92,
    description: 'Durable leather work gloves with reinforced palms for extra protection.',
    features: ['Premium leather', 'Adjustable wrist strap', 'Breathable back', 'Excellent grip'],
    isVerified: true
  },
  {
    id: '8',
    name: 'Electrical Wiring Kit',
    category: 'Electrical',
    price: 49.99,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1597766380552-36f5c673637a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RWxlY3RyaWNhbCUyMFdpcmluZyUyMEtpdHxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.4,
    reviews: 38,
    description: 'Comprehensive kit for basic electrical wiring projects. Includes various wires and connectors.',
    features: ['14 and 12 AWG wire', 'Assorted wire nuts', 'Electrical tape', 'Circuit tester'],
    isVerified: false
  },
  {
    id: '9',
    name: 'Insulation Roll (Fiberglass)',
    category: 'Building Materials',
    price: 35.75,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 78,
    description: 'R-13 fiberglass insulation roll for walls and ceilings. 100 sq ft coverage.',
    features: ['R-value 13', 'Unfaced', 'Easy to install', 'Sound dampening'],
    isVerified: true
  },
];
  


export const ShopProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="w-full h-48 object-cover"
                    />
                    {product.isVerified && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <BadgeCheck className="h-4 w-4 mr-1" />
                        Sold
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        {/* <span className="ml-1 text-sm text-gray-500">({product.reviews})</span> */}
                      </div>
                    </div>
                    {/* <p className="text-sm text-gray-600 mb-4">{product.description}</p> */}
                    {/* <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div> */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-900">${product.price}</span>
                        {/* <span className="ml-2 text-sm text-gray-500">In stock: {product.stock}</span> */}
                      </div>
                      <button className="flex items-center text-yellow-400 font-medium hover:text-yellow-700 transition-colors group">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* PAGINATION BUTTONS */}
        <div className="mt-6 flex justify-center space-x-2">
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
            <ChevronLeft className="h-5 w-5 text-amber-300" />
          </button>
          <div className='flex justify-center items-center gap-3'>
          <Link href={''}>01</Link><Link href={''}>02</Link><Link href={''}>03</Link><Link href={''}>04</Link>
          </div>
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        </div>
      </div>
      
    </div>
  );
};