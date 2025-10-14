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
    const user = searchParams.get("userData");

    console.log("🔍 Auth Verification Debug:", {
      token: token ? `${token.substring(0, 20)}...` : null,
      user: user ? "Present" : null,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    if (token && user) {
      try {
        // Parse user data to ensure it's valid JSON
        let parsedUser;
        try {
          parsedUser = JSON.parse(user);
          console.log("✅ User data parsed successfully:", parsedUser);
        } catch (parseError) {
          console.error("❌ Failed to parse user data:", parseError);
          setError("Invalid user data format");
          return;
        }

        // Store the token and user data in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", user);

        console.log("✅ Token and user data stored in localStorage");

        // Add a small delay to ensure the token is properly stored and processed
        // This helps prevent race conditions with profile API calls
        setTimeout(() => {
          console.log("🚀 Redirecting to homepage...");
          router.push("/");
        }, 500); // 500ms delay
      } catch (err) {
        setError("Failed to process authentication data");
        console.error("❌ Auth processing error:", err);
      }
    } else {
      console.error("❌ Missing authentication data:", {
        token: !!token,
        user: !!user,
      });
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

import dynamic from "next/dynamic";

const GoogleCallback = dynamic(() => Promise.resolve(GoogleCallbackClient), {
  ssr: false,
});

export default GoogleCallback;
