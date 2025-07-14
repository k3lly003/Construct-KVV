"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GenericButton } from "@/components/ui/generic-button";
import { CalendarDays, Eye, Mail, Star, MapPin } from "lucide-react";
import { Profile } from "@/app/utils/fakes/shopsFakes";
import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';
import { useTranslations } from '@/app/hooks/useTranslations';

const ShopCard: React.FC<Profile> = ({
  id,
  name,
  title,
  rating,
  location,
  since,
  imageSrc,
}) => {
  const router = useRouter();
  const { t } = useTranslations();

  const handleViewProfile = () => {
    router.push(`/shops/${id}`);
  };
  return (
    <div className="bg-white rounded-2xl overflow-hidden w-full max-w-xs">
      <div className="relative w-full h-72">
        <Image src={imageSrc} alt={name} layout="fill" objectFit="cover" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-100 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 px-4 text-white">
          <div className="font-bold text-md mb-1">{name}</div>
          <p className="text-xs mb-2 overflo">{title}</p>
        </div>
      </div>
      <div className="px-4 pb-3 bg-black">
        {/* <div className="flex items-center justify-between py-2">
          <div className="flex flex-col items-center">
             <div className="flex justify-center">
                 <Star className="w-4 h-4 text-amber-500 mr-1" />
                 <span className="text-sm font-semibold text-gray-200">
                     {rating}
                 </span>
             </div>
             <span className="text-xs text-gray-100 ml-1">Rating</span>
          </div>
          <hr className="border-white border-1 h-5" />
          <div className="flex flex-col items-center">
             <div className="flex justify-center">
                 <CalendarDays className="w-4 h-4 text-amber-500 mr-1" />
                 <span className="text-sm font-semibold text-gray-200">
                     {since}
                 </span>
             </div>
             <span className="text-xs text-gray-100 ml-1">Established</span>
          </div>
          <hr className="border-white border-1 h-5" />
          <div className="flex flex-col items-center">
             <div className="flex justify-center">
                 <MapPin className="w-4 h-4 text-amber-500 mr-1" />
                 <span className="text-sm font-semibold text-gray-200">
                     {location}
                 </span>
             </div>
             <span className="text-xs text-gray-100 ml-1">Location</span>
          </div>
        </div> */}
        <div className="flex space-x-2 items-center py-3">
          <GenericButton
            className="flex-grow bg-black-100 text-white border border-white rounded-md py-2 text-sm font-semibold hover:bg-gray-100 hover:text-black hover:border-0 cursor-pointer focus:outline-none"
            onClick={() => console.log("Get in Touch clicked")}
          >
            <Mail className="mr-1 inline-block" />
            {t(dashboardFakes.common.contactUs)}
          </GenericButton>
          <GenericButton
            className="flex bg-black py-2 text-sm flex-grow border border-amber-500 text-white hover:bg-amber-500 cursor-pointer focus:outline-none rounded-md"
            onClick={handleViewProfile}
          >
            <Eye className="mr-1 inline-block" />
            {t(dashboardFakes.common.viewShop)}
          </GenericButton>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;

