import React from "react";
import { Lock } from "lucide-react";
import Link from "next/link";

interface AuthPromptProps {
  title?: string;
  message?: string;
  showLoginButton?: boolean;
  className?: string;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  title = "Authentication Required",
  message = "Please log in to access this feature.",
  showLoginButton = true,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center ${className}`}
    >
      <Lock className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-mid font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {showLoginButton && (
        <Link
          href="/signin"
          className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Sign In
        </Link>
      )}
    </div>
  );
};
