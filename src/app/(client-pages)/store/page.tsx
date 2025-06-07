"use client"

import React from 'react'
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner'
import { Products } from '@/app/(components)/Product'

const page = () => {
  return (
    <>
      <DefaultPageBanner title='store' backgroundImage='/store-img.jpg' />
      <Products/>
    </>
  )
}

export default page