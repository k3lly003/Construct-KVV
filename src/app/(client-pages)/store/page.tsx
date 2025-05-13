"use client"

import React from 'react'
import { StoreData } from '../../utils/fakes/StoreFakes'
import DefaultPageBanner from '../../(components)/DefaultPageBanner'
import { Products } from '@/app/(components)/Product'

const page = () => {
  const { backgroundImage, title} = StoreData;
  return (
    <>
      <DefaultPageBanner title={title} backgroundImage={backgroundImage} />
      <Products/>
    </>
  )
}

export default page