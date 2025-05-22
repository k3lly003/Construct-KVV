"use client"

import React from 'react'
import DefaultPageBanner from '../../(components)/DefaultPageBanner'
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