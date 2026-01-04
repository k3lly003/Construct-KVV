'use client';

import { useUserStore } from "@/store/userStore";
import AdminOverview from "@/app/dashboard/(components)/overview/AdminOverview"
import ConstractorOverview from "@/app/dashboard/(components)/overview/ConstractorOverview"
import TechnicianOverview from "@/app/dashboard/(components)/overview/TechnicianOverview"
import ArchitectOverview from "@/app/dashboard/(components)/overview/ArchitectOverview"
import SellerOverview from "@/app/dashboard/(components)/overview/SellerOverview"

const Page=()=> {
  const { role, isHydrated } = useUserStore();

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
      {role === "ADMIN" && <AdminOverview />}
      
      {role === "CONTRACTOR" && <ConstractorOverview />}

      {role === "TECHNICIAN" && <TechnicianOverview />}
      
      {role === "ARCHITECT" && <ArchitectOverview />}
      
      {role === "SELLER" && <SellerOverview />}
      
      {!role && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-mid font-bold text-gray-900 mb-4">OverView Not Available</h1>
            <p className="text-gray-600">Dear anonymous friend, you don&apos;t have a capacity yet.</p>
          </div>
        </div>
      )}
    </>
  );
}
export default Page;