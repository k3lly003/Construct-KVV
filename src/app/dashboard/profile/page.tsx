'use client';

import { ProfileHeader } from '@/app/dashboard/(components)/profile/profile-header';
import { ProfileSidebar } from '@/app/dashboard/(components)/profile/profile-sidebar';
import { ProfileContent } from '@/app/dashboard/(components)/profile/profile-content';

export default function ProfilePage() {
  return (
    <>
      <ProfileHeader />
      <div className="relative max-w-9xl mx-auto mt-[-100px] z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 mx-5 gap-6">
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>
          <div className="lg:col-span-3">
            <ProfileContent />
          </div>
        </div>
      </div>
    </>
  );
}