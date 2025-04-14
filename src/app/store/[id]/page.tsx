'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { MdOutlineShoppingCart } from 'react-icons/md';
import Image from 'next/image';
import { fakeProductCards } from '../../utils/fakes/ProductFakes';
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';
import Reviews from '@/app/(components)/product/Reviews';
import RelatedProducts from '@/app/(components)/product/RelatedProducts';
import Button from '@/app/(components)/Button';



function ProductPage({ params }: { params: { id: string } }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
  const product = fakeProductCards.find(item => item.id === params.id) || fakeProductCards[0];
  
  const {
    productName,
    productPrice,
    discountedPrice,
    productDescription,
    productThumbnail,
    imageSrc,
    altText,
  } = product;

  // COMBINE THUMBNAIL WITH OTHER SUB-IMAGES
  const allImages = [productThumbnail, ...imageSrc];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSwiper = (swiper: any) => {
    setThumbsSwiper(swiper);
  };

  return (
    <div className="w-[100%] my-5">
      <DefaultPageBanner title="Product View" backgroundImage={''} />
      <div className="w-[100%] flex flex-col gap-[30px] p-3 sm:w-[60%] m-auto my-10">
        <div className="w-[100%] gap-0 sm:gap-8 flex-col sm:flex-row flex">
          <div className="w-[100%] sm:w-1/2">
            <div className="flex justify-center py-2">
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="rounded-lg min-w-[100%] box-border"
              >
                {allImages.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className="w-[100%] rounded-lg shadow-lg"
                  >
                    <Image
                      src={image}
                      alt={altText}
                      width={500}
                      height={500}
                      className="h-[400px] object-cover min-w-[100%]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/product.png';
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="w-full flex space-x-4 justify-start mt-3">
              <div className="w-[100%] h-[5em] flex">
                <Swiper
                  onSwiper={handleSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="min-w-[100%] max-h-[100px] mySwiper4"
                >
                  {allImages.map((image, index) => (
                    <SwiperSlide
                      key={index}
                      className="opacity-[0.4] hover:opacity-100 transition-opacity"
                    >
                      <Image
                        src={image}
                        alt={`${altText} thumbnail ${index}`}
                        width={100}
                        height={80}
                        className="h-[100%] text-left rounded-lg object-cover w-[100%]"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <div className='flex flex-col gap-5'>
              <h1 className="font-bold mt-5 text-2xl capitalize-first">
                {productName}
              </h1>
              <p className="mt-2 text-gray-600">{productDescription}</p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 mt-5">
                {/* <div className="p-3 rounded-full bg-gray-200 hover:bg-green-500 hover:text-white cursor-pointer transition-colors">
                  <FaRegHeart />
                </div> */}
                <div className="p-3 rounded-full hover:bg-green-500 hover:text-white cursor-pointer pointer-events-auto bg-gray-200 transition-colors">
                  <MdOutlineShoppingCart />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {discountedPrice < productPrice && (
                  <span className="font-medium text-xl line-through text-gray-500">
                    {productPrice.toLocaleString()} RWF
                  </span>
                )}
                <span className="font-medium text-2xl text-green-400">
                  <span className="font-bold text-3xl">
                    {discountedPrice.toLocaleString()}
                  </span>{' '}
                  RWF
                </span>
              </div>
              <div>
                <Button text='Buy'/>
              </div>
            </div>
          </div>
        </div>
        <div>
         <RelatedProducts />
        </div>
        <div>
         <Reviews reviews ={product.reviews} />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;