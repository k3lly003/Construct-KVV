"use client";

import { create } from "zustand";

// Define the shape of your user state
interface UserState {
  role: "ADMIN" | "SELLER" | "CUSTOMER" | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string | null;
  isHydrated: boolean; // Flag to indicate if client-side data has been loaded

  // Action to load user data from localStorage
  loadUserData: () => void;
}

// Helper function to get user data from localStorage (same as before)
// Ensure this path is correct relative to your store file
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";

export const useUserStore = create<UserState>((set) => ({
  role: null,
  firstName: null,
  lastName: null,
  name: null,
  email: null,
  isHydrated: false,

  loadUserData: () => {
    // This function will only run on the client-side
    if (typeof window !== "undefined") {
      const user = getUserDataFromLocalStorage();
      if (user) {
        set({
          role: user.role as "ADMIN" | "SELLER" | "CUSTOMER", // Now supports CUSTOMER
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          email: `${user.email}`,
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
