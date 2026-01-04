'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useShop } from '@/app/hooks/useShop';
import { useEffect, useState } from 'react';
import { getUserDataFromLocalStorage } from '@/app/utils/middlewares/UserCredentions';
import { UserData } from '@/app/utils/dtos/profile';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from '@/app/hooks/useTranslations';

export function ProfileSidebar() {
  const { t } = useTranslations();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { myShop, isMyShopLoading, myShopError } = useShop();
  
  useEffect(() => {
    const data = getUserDataFromLocalStorage();
    setUserData(data);
  }, []);
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'no data';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <Card className='rounded-sm'>
        <CardHeader>
          <CardTitle className="text-md font-semibold text-amber-600 font-medium">{t('profile.personalInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-small">
            <span className="text-gray-500">{t('profile.sellerName')}:</span>
            <span>{userData ? `${userData.firstName} ${userData.lastName}` : <Skeleton className="h-4 w-24" />}</span>
          </div>
          <div className="flex justify-between text-small">
            <span className="text-gray-500">{t('profile.mobile')}:</span>
            <span>{userData ? userData.phone : <Skeleton className="h-4 w-20" />}</span>
          </div>
          <div className="flex justify-between text-small">
            <span className="text-gray-500">{t('profile.email')}:</span>
            <span>{userData ? userData.email : <Skeleton className="h-4 w-32" />}</span>
          </div>
          <div className="flex justify-between text-small">
            <span className="text-gray-500">{t('profile.location')}:</span>
            <span>{userData ? 'no data' : <Skeleton className="h-4 w-28" />}</span>
          </div>
        </CardContent>
      </Card>

      {/* Shop Info */}
      <Card className='rounded-sm'>
        <CardHeader>
          <CardTitle className="text-md font-semibold text-amber-600 font-medium">{t('profile.shopInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isMyShopLoading ? (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </>
          ) : myShopError ? (
            <div className="text-small text-red-500">{t('profile.shopInfoError')}</div>
          ) : myShop ? (
            <>
              <div className="flex justify-between text-small">
                <span className="text-gray-500">{t('profile.shopName')}:</span>
                <span>{myShop.name}</span>
              </div>
              <div className="flex justify-between text-small">
                <span className="text-gray-500">{t('profile.shopMobile')}:</span>
                <span>{myShop?.phone || userData?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-small">
                <span className="text-gray-500">{t('profile.email')}:</span>
                <span>{userData?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-small">
                <span className="text-gray-500">{t('profile.joiningDate')}:</span>
                <span>{formatDate(myShop.createdAt)}</span>
              </div>
              <div className="flex justify-between text-small">
                <span className="text-gray-500">{t('profile.workingDays')}:</span>
                <span>{'N/A'}</span>
              </div>
            </>
          ) : (
             <div className="text-small text-gray-500 italic">{t('profile.noShopFound')}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}