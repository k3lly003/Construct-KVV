"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RedirectMessage } from "./RedirectMessage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/signin",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowRedirectMessage(true);
      // Show redirect message for 1.5 seconds before redirecting
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not authenticated, show redirect message
  if (!isAuthenticated) {
    return <RedirectMessage />;
  }

  // If authenticated, render children
  return <>{children}</>;
};
