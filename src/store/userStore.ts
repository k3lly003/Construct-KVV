"use client";

import { create } from "zustand";

// Define the shape of your user state
interface UserState {
  id: string | null;
  role:
    | "ADMIN"
    | "SELLER"
    | "CUSTOMER"
    | "CONTRACTOR"
    | "ARCHITECT"
    | "TECHNICIAN"
    | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string | null;
  profilePic: string | null;
  isHydrated: boolean; // Flag to indicate if client-side data has been loaded

  // Action to load user data from localStorage
  loadUserData: () => void;
}

// Helper function to get user data from localStorage (same as before)
// Ensure this path is correct relative to your store file
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";

export const useUserStore = create<UserState>((set) => ({
  id: null,
  role: null,
  firstName: null,
  lastName: null,
  name: null,
  email: null,
  profilePic: null,
  isHydrated: false,

  loadUserData: () => {
    // This function will only run on the client-side
    if (typeof window !== "undefined") {
      const user = getUserDataFromLocalStorage();
      if (user) {
        set({
          id: user.id ?? null,
          role: user.role as
            | "ADMIN"
            | "SELLER"
            | "CUSTOMER"
            | "CONTRACTOR"
            | "ARCHITECT"
            | "TECHNICIAN", // Now supports all professional roles
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          email: `${user.email}`,
          profilePic: user.profilePic || null,
          isHydrated: true, // Mark as hydrated once data is loaded
        });
      } else {
        // If no user data, still mark as hydrated to stop loading state
        set({ isHydrated: true });
      }
    }
  },
}));

// Optional: A component to hydrate the store on the client.
// This is a common pattern with Zustand in Next.js to ensure
// `loadUserData` is called once after the client mounts.
import React from "react";

export function UserStoreInitializer() {
  const loadUserData = useUserStore((state) => state.loadUserData);
  const isHydrated = useUserStore((state) => state.isHydrated);

  // Use a ref to ensure this runs only once on mount
  const hasHydrated = React.useRef(false);

  React.useEffect(() => {
    if (!hasHydrated.current && !isHydrated) {
      loadUserData();
      hasHydrated.current = true;
    }
  }, [loadUserData, isHydrated]); // Only re-run if loadUserData or isHydrated changes

  return null; // This component doesn't render anything
}
