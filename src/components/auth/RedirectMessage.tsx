import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RedirectMessageProps {
  message?: string;
  redirectTo?: string;
}

export const RedirectMessage: React.FC<RedirectMessageProps> = ({
  message = "You need to be logged in to access this page.",
  redirectTo = "/signin",
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-4">
          <LoadingSpinner size="md" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Authentication Required
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <p className="text-sm text-gray-500">Redirecting to login...</p>
      </div>
    </div>
  );
};
