"use client"

import Reviews from '@/app/(components)/product/Reviews'
import { ContactInfo } from '@/app/(components)/supplier/ContactInfo'
import { ShopBanner } from '@/app/(components)/supplier/ShopBanner'
import { ShopProducts } from '@/app/(components)/supplier/ShopProducts'
import React, { useEffect, useState, use } from 'react'
import { ShopService } from '@/app/services/shopServices'
import { Shop } from '@/types/shop'
import { Skeleton } from '@/components/ui/skeleton'

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
        console.log('Attempting to fetch shop with ID:', id)
        const shopData = await ShopService.getShopById(id)
        console.log('Shop data received:', shopData)
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
      <ShopBanner shop={shop}/>
      <div className='flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-12'>
       <ContactInfo shop={shop}/>
       <div className='flex flex-col'>
       <ShopProducts shopId={shop.id} shop={shop}/>
       <Reviews reviews={[]} shop={shop} />
      </div>
      </div>
    </>
  )
}

export default Page