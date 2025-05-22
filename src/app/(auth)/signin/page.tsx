"use client";

import React, { useState, FormEventHandler } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const handleGoogleLogin = () => {
    // Redirect the user to the backend Google OAuth flow
    window.location.href =
      "https://construct-kvv-bn-fork.onrender.com/api/v1/auth/google";
  };

  const handleAppleSignIn = () => {
    console.log("Apple sign-in clicked");
    //  APPLE LOGIN LOGIC
  }

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    console.log("Login attempt with:", email, password);
    // Add your email/password authentication logic here
    // If login is successful, you might want to redirect:
    // router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Login</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {/* Add Google Icon here.  You can use a library like react-icons. */}
            Sign in with Google
          </button>
          <button
            onClick={handleAppleSignIn}
            className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            {/* Add Apple Icon here */}
            Sign in with Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
