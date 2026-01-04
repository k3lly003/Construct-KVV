"use client";

import { useUserStore } from "@/store/userStore";
import ArchitectDesignRequests from "../(components)/design-requests/ArchitectDesignRequests";

export default function DesignRequestsPage() {
  const { role, isHydrated } = useUserStore();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading design requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === "ARCHITECT" && <ArchitectDesignRequests />}
      
      {role !== "ARCHITECT" && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-mid font-bold text-gray-900 mb-4">Design Requests Not Available</h1>
            <p className="text-gray-600">This page is only available for architects.</p>
          </div>
        </div>
      )}
    </>
  );
}
