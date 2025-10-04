'use client';

import { useUserStore } from '@/store/userStore';
import AdminProfile from '@/app/dashboard/(components)/profile/AdminProfile';
import ConstractorProfile from '@/app/dashboard/(components)/profile/ConstractorProfile';
import TechnicianProfile from '../(components)/profile/TechnicianProfile';
import ArchitectureProfile from '../(components)/profile/ArchitectureProfile';
import SellerProfile from '@/app/dashboard/(components)/profile/SellerProfile';

export default function ProfilePage() {
  const { role, isHydrated } = useUserStore();

  // Show loading state while user data is being hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === "ADMIN" && <AdminProfile />}
      
      {role === "CONTRACTOR" && <ConstractorProfile />}

      {role === "TECHNICIAN" && <TechnicianProfile />}
      
      {role === "ARCHITECT" && <ArchitectureProfile />}
      
      {role === "SELLER" && <SellerProfile />}
      
      {!role && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Available</h1>
            <p className="text-gray-600">Dear anonymous friend, you don't have a profile yet.</p>
          </div>
        </div>
      )}
    </>
  );
}