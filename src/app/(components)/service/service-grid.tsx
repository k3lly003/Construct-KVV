"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, ShoppingCart, Store } from "lucide-react";
import Image from "next/image";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { GenericButton } from "@/components/ui/generic-button";
import { serviceService } from "@/app/services/serviceServices";
import { useRouter } from "next/navigation";


interface ServiceGridProps {
  services?: any[];
  loading: boolean;
}

export function ServiceGrid({ services = [], loading }: ServiceGridProps) {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 py-12">
      <div className="flex flex-wrap justify-center lg:justify-start">
        {loading ? (
          <div className="w-full flex justify-center items-center py-12 text-gray-500">Loading services...</div>
        ) : (services || []).length === 0 ? (
          <div className="w-full flex justify-center items-center py-12 text-gray-500">No services found.</div>
        ) : (
          (services || []).map((service) => (
            <div
              key={service.id}
              className="bg-white overflow-hidden w-72 m-2 hover:shadow-lg cursor-pointer hover:rounded-xl transition-shadow"
            >
              <section className="p-0">
                {/* Service Image */}
                <div className="px-4 pb-4">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border">
                    <Image
                      src={service.gallery && service.gallery.length > 0 ? service.gallery[0] : '/empty-cart.png'}
                      width={100}
                      height={100}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Provider Info */}
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Store className="w-5 h-5 text-amber-600"/>
                    <span className="text-sm font-medium text-gray-700">{service.provider?.name || "Unknown"}</span>
                  </div>

                  {/* Service Title */}
                  <h1 className="font-bold text-gray-900 text-lg leading-tight mb-4 line-clamp-2">
                    {service.title}
                  </h1>

                  {/* Pricing and Location Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="font-semibold text-gray-900">{service.pricing?.basePrice ? `${service.pricing.basePrice} Rwf` : "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="font-semibold text-gray-900">{service.location?.city || "-"}</p>
                    </div>
                  </div>
                 <Separator className="w-full h-[1px] bg-gray-200 my-2 rounded-full"/>
                  {/* Features as Tags */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {Array.isArray(service.features) && service.features.map((feature: string) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </section>

              <section className="p-4 pt-0">
                <div className="flex items-center gap-2 w-full">
                  <GenericButton className="border rounded bg-gray-100 hover:bg-gray-800" onClick={() => router.push(`/service/${service.id}`)}>
                    <Eye className="w-4 h-4 mr-1 text-amber-500" />
                  </GenericButton>
                  <GenericButton className="flex-1 bg-gray-900 text-white rounded hover:bg-amber-700 hover:text-gray-100">
                     <ShoppingCart className="w-4 h-4 mr-1" />
                     Add to cart
                  </GenericButton>
                </div>
              </section>
            </div>
          ))
        )}
      </div>
    </div>
  );
}