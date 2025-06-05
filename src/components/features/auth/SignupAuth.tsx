"use client";

import { GenericButton } from "@/components/ui/generic-button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";

interface SignupCardProps {
  companyName?: string;
  welcomeText?: string;
  description?: string;
  googleText?: string;
  appleText?: string;
  dividerText?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  termsText?: string;
  signUpText?: string;
  loginText?: string;
  loginLink?: string;
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSubmit?: (name: string, email: string, password: string) => void;
}

export function SignupCard({
  companyName = "Construction Kvv Shop",
  welcomeText = "Create Your Account",
  description = "Join our community to get started",
  googleText = "Sign up with Google",
  appleText = "Sign up with Apple",
  dividerText = "Or",
  namePlaceholder = "Full Name",
  emailPlaceholder = "Email",
  passwordPlaceholder = "Password",
  confirmPasswordPlaceholder = "Confirm Password",
  termsText = "I agree to the Terms of Service and Privacy Policy",
  signUpText = "Sign Up",
  loginText = "Already have an account? Log in",
  loginLink = "/login",
  onGoogleSignUp,
  onAppleSignUp,
  onSubmit,
}: SignupCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    if (!agreeTerms) {
      setPasswordError("You must agree to the terms");
      return;
    }
    
    setPasswordError("");
    onSubmit?.(name, email, password);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{companyName}</h1>
        <h2 className="text-xl mt-4 mb-2 text-gray-800">{welcomeText}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="space-y-4">
        <GenericButton
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={onGoogleSignUp}
        >
          <GoogleIcon className="w-5 h-5" />
          {googleText}
        </GenericButton>

        <GenericButton
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={onAppleSignUp}
        >
          <AppleIcon className="w-5 h-5" />
          {appleText}
        </GenericButton>

        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">{dividerText}</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder={namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder={passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder={confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(!!checked)}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              {termsText}
            </label>
          </div>

          <GenericButton type="submit" className="w-full">
            {signUpText}
          </GenericButton>
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          <Link href={loginLink} className="text-blue-600 hover:underline">
            {loginText}
          </Link>
        </div>
      </div>
    </div>
  );
}

// Reuse the same icon components from login
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
