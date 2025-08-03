"use client"

import React from 'react'
import DefaultPageBanner from '../../(components)/DefaultPageBanner'
import { Products } from '@/app/(components)/Product'
import Head from 'next/head';

const page = () => {
  return (
    <>
      <Head>
        <title>Products | Construct KVV</title>
        <meta name="description" content="Browse and shop the best construction products in Rwanda at KVV Construction. Quality, variety, and great prices." />
        <meta property="og:title" content="Products | Construct KVV" />
        <meta property="og:description" content="Browse and shop the best construction products in Rwanda at KVV Construction. Quality, variety, and great prices." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.constructkvv.com/product" />
        <meta property="og:image" content="/kvv-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Products | Construct KVV" />
        <meta name="twitter:description" content="Browse and shop the best construction products in Rwanda at KVV Construction." />
        <meta name="twitter:image" content="/kvv-logo.png" />
        <link rel="canonical" href="https://www.constructkvv.com/product" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Products',
          url: 'https://www.constructkvv.com/product',
          description: 'Browse and shop the best construction products in Rwanda at KVV Construction.'
        }) }} />
      </Head>
      <DefaultPageBanner title='store' backgroundImage='/store-img.jpg' />
      <Products/>
    </>
  )
}

export default page