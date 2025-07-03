'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useShop } from '@/app/hooks/useShop';
import { useEffect, useState } from 'react';
import { getUserDataFromLocalStorage } from '@/app/utils/middlewares/UserCredentions';
import { UserData } from '@/utils/dtos/profile';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSidebar() {
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
          <CardTitle className="text-md font-semibold text-amber-600 font-medium">Personal Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Seller Name:</span>
            <span>{userData ? `${userData.firstName} ${userData.lastName}` : <Skeleton className="h-4 w-24" />}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mobile:</span>
            <span>{userData ? userData.phone : <Skeleton className="h-4 w-20" />}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">E-mail:</span>
            <span>{userData ? userData.email : <Skeleton className="h-4 w-32" />}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Location:</span>
            <span>{userData ? 'no data' : <Skeleton className="h-4 w-28" />}</span>
          </div>
        </CardContent>
      </Card>

      {/* Shop Info */}
      <Card className='rounded-sm'>
        <CardHeader>
          <CardTitle className="text-md font-semibold text-amber-600 font-medium">Shop Info</CardTitle>
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
            <div className="text-sm text-red-500">Create the shop to see the  shop info.</div>
          ) : myShop ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shop Name:</span>
                <span>{myShop.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shop Mobile:</span>
                <span>{myShop?.phone || userData?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">E-mail:</span>
                <span>{userData?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Joining Date:</span>
                <span>{formatDate(myShop.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">working days:</span>
                <span>{'N/A'}</span>
              </div>
            </>
          ) : (
             <div className="text-sm text-gray-500 italic">No shop found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}