"use client"

import { SignupCard } from "../../(components)/auth/SignupAuth";

export default function SignupPage() {
  const handleSubmit = (name: string, email: string, password: string) => {
    console.log("Signup attempt with:", { name, email, password });
    // Add your registration logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SignupCard 
        onSubmit={handleSubmit}
        onGoogleSignUp={() => console.log("Google sign-up clicked")}
        onAppleSignUp={() => console.log("Apple sign-up clicked")}
        termsText="I agree to the Terms of Service and Privacy Policy"
      />
    </div>
  );
}