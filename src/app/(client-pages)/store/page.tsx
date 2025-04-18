"use client"

import React from 'react'
// import Product from '../../(components)/Product'
import DefaultPageBanner from '../../(components)/DefaultPageBanner'
import { ShopProducts } from '@/app/(components)/supplier/ShopProducts'

const page = () => {
  return (
    <>
      <DefaultPageBanner title="Products" backgroundImage={''} />
      <ShopProducts/>
    </>
  )
}

export default page