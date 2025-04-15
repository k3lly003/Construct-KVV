"use client"

import { LoginCard } from '../../(components)/auth/LoginAuth';
import React from 'react'

const page = () => {
  const handleSubmit = (email: string, password: string) => {
    console.log("Login attempt with:", email, password);
    // AUTH LOGIC GOES HERE
  };
  return (
    <>
     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <LoginCard 
        onSubmit={handleSubmit}
        onGoogleSignIn={() => console.log("Google sign-in clicked")}
        onAppleSignIn={() => console.log("Apple sign-in clicked")}
      />
    </div>
    </>
  )
}

export default page