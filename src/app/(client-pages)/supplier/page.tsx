import { ContactInfo } from '@/app/(components)/supplier/ContactInfo'
import { ShopBanner } from '@/app/(components)/supplier/ShopBanner'
import { ShopProducts } from '@/app/(components)/supplier/ShopProducts'
import React from 'react'

const page = () => {
  return (
    <>
      <ShopBanner/>
      <div className='flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-12'>
       <ContactInfo/>
       <ShopProducts/>
      </div>
    </>
  )
}

export default page