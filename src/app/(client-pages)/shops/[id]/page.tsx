"use client"

import Reviews from '@/app/(components)/product/Reviews'
import { ShopBanner } from '@/app/(components)/supplier/ShopBanner'
import { ShopProducts } from '@/app/(components)/supplier/ShopProducts'
import React, { useEffect, useState, use } from 'react'
import { ShopService } from '@/app/services/shopServices'
import { Shop } from '@/types/shop'
import { Skeleton } from '@/components/ui/skeleton'
import Head from 'next/head';

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const Page = ({ params }: PageProps) => {
  const { id } = use(params)
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Received shop prop:', shop);
        const shopData = await ShopService.getShopById(id)
        setShop(shopData)
      } catch (err) {
        console.error('Error fetching shop:', err)
        if (err instanceof Error) {
          if (err.message.includes('404')) {
            setError(`Shop with ID "${id}" not found. Please check the URL or try a different shop.`)
          } else if (err.message.includes('Network Error')) {
            setError('Network error. Please check your internet connection and try again.')
          } else {
            setError(`Failed to fetch shop: ${err.message}`)
          }
        } else {
          setError('An unexpected error occurred while fetching the shop.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchShop()
    }
  }, [id])

  if (loading) {
    return (
      <div>
        {/* Banner Skeleton */}
        {/* <Skeleton className="w-full h-48 mb-8" /> */}
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-12">
          {/* Contact Info Skeleton */}
          <div className="w-[35%] mr-8">
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
          {/* Products Skeleton */}
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="container max-w-7xl mx-auto py-10 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Shop</h3>
          <p className="text-gray-600">{error || 'Shop not found'}</p>
        </div>
      </div>
    )
  }
    
  return (
    <>
      <Head>
        <title>{shop?.name ? `${shop.name} | Shop | Construct KVV` : 'Shop | Construct KVV'}</title>
        <meta name="description" content={shop?.description || 'View shop details and products at Construct KVV.'} />
        <meta property="og:title" content={shop?.name ? `${shop.name} | Shop | Construct KVV` : 'Shop | Construct KVV'} />
        <meta property="og:description" content={shop?.description || 'View shop details and products at Construct KVV.'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.constructkvv.com/shops/${shop?.id}`} />
        <meta property="og:image" content={shop?.image || '/kvv-logo.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shop?.name ? `${shop.name} | Shop | Construct KVV` : 'Shop | Construct KVV'} />
        <meta name="twitter:description" content={shop?.description || 'View shop details and products at Construct KVV.'} />
        <meta name="twitter:image" content={shop?.image || '/kvv-logo.png'} />
        <link rel="canonical" href={`https://www.constructkvv.com/shops/${shop?.id}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: shop?.name,
          description: shop?.description,
          image: shop?.image || undefined,
          url: `https://www.constructkvv.com/shops/${shop?.id}`
        }) }} />
      </Head>
      <ShopBanner shop={shop}/>
      <div className='flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-12 md:flex-row'>
       {/* <ContactInfo shop={shop}/> */}
       <div className='flex flex-col w-[100%]'>
       <ShopProducts shopId={shop.id} shop={shop}/>
       <Reviews reviews={[]} shop={shop} />
      </div>
      </div>
    </>
  )
}

export default Page