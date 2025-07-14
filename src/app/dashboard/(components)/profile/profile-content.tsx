'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useShop } from '@/app/hooks/useShop';
import { Skeleton } from '@/components/ui/skeleton';
import ActivitySection from './profile-activity';
import { useTranslations } from '@/app/hooks/useTranslations';

export function ProfileContent() {
  const { myShop, isMyShopLoading, myShopError } = useShop();
  const { t } = useTranslations();

  if (isMyShopLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (myShopError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <Store className="h-12 w-12 mx-auto mb-4 text-red-300" />
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.shopNotFound')}</h3>
            <p className="text-sm text-gray-600">
              {myShopError.message || t('dashboard.unableToLoadShop')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!myShop) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.noShopFound')}</h3>
            <p className="text-sm text-gray-600">
              {t('dashboard.createShopMessage')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shop Overview Card */}
      <Card>
          <div className="flex flex-col space-x-5">
            <CardHeader className="text-lg font-semibold text-amber-600 font-medium">{t('dashboard.about')}</CardHeader>
              <CardContent className="flex items-center space-x-4 mt-1">
                {t('dashboard.aboutDescription')}
              </CardContent>
          </div>
        <CardFooter className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* social medias */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <FaFacebook  className="h-4 w-4 text-gray-500 hover:text-amber-600" />
                <FaInstagram  className="h-4 w-4 text-gray-500 hover:text-amber-600" />
                <FaTwitter  className="h-4 w-4 text-gray-500 hover:text-amber-600" />
                <FaLinkedin  className="h-4 w-4 text-gray-500 hover:text-amber-600" />
              </div>
            </div>
            </div>
        </CardFooter>
      </Card>

      {/* Shop Details Card */}
      <ActivitySection/>
    </div>
  );
}