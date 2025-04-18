// import Reviews from '@/app/(components)/product/Reviews'
import Reviews from '@/app/(components)/product/Reviews'
import { ContactInfo } from '@/app/(components)/supplier/ContactInfo'
import { ShopBanner } from '@/app/(components)/supplier/ShopBanner'
import { ShopProducts } from '@/app/(components)/supplier/ShopProducts'
// import { fakeProductCards } from '@/app/utils/fakes/ProductFakes'
import React from 'react'

const page = () => {
  // const product = fakeProductCards.find(item => item.id === params.id) || fakeProductCards[0];
    
  return (
    <>
      <ShopBanner/>
      <div className='flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-12'>
       <ContactInfo/>
       <div className='flex flex-col'>
       <ShopProducts/>
        <Reviews reviews={[]}  />
      </div>
      </div>
    </>
  )
}

export default page