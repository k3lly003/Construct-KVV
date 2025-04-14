"use client"

import React from 'react'
import Product from '../(components)/Product'
import DefaultPageBanner from '../(components)/DefaultPageBanner'

const page = () => {
  return (
    <>
      <DefaultPageBanner title="Products" backgroundImage={''} />
      <Product />
    </>
  )
}

export default page