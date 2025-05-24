"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GoogleCallbackClient = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Parse the token from the URL query parameters
    const token = searchParams.get("token");
    const userData = searchParams.get("userData");

    if (token && userData) {
      try {
        // Store the token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", userData);

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err) {
        setError("Failed to process authentication data");
        console.error(err);
      }
    } else {
      setError("Authentication failed - missing token or user data");
    }
  }, [router, searchParams]);

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/login")}>Back to Login</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Authenticating...</h2>
      <p>Please wait while we complete your sign-in process.</p>
    </div>
  );
};

import dynamic from 'next/dynamic';

const GoogleCallback = dynamic(() => Promise.resolve(GoogleCallbackClient), {
  ssr: false,
});

export default GoogleCallback;