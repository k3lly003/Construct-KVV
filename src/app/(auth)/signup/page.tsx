"use client";
import React from "react";
import { BackgroundBeams } from "../../../components/ui/background-beams";
import { useState } from "react";
import { Mail, Eye, EyeOff, ArrowLeft, UserRound } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoFacebook } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import ContactAddress from "../../(components)/sections/ContactAddress";
import { useRouter } from "next/navigation";

const Page = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [first_name, setFirst_name] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [second_name, setSecond_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSignUp = async (e: React.FormEvent) => {
    setError(null); // Clear any previous errors
    setLoading(true); // Indicate loading state

    try {
      const response = await fetch("/api/login", {
        // Replace with your actual login API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      // Assuming your backend returns a token or user data upon successful login
      console.log("Login successful:", data);

      // --- Add your post-login logic here ---
      // 1. Store the authentication token (e.g., in localStorage or a secure cookie)
      localStorage.setItem("authToken", data.token);

      // 2. Redirect the user to a dashboard or home page

      router.push("/dashboard");

      // 3. Update global application state (e.g., user context)
      //    If you have a user context, you would update it here
      // setUser(data.user);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // *********************************************************************************

  // LOGIN WITH SOCIAL MEDIA LOGICS
  const handleGoogleLogin = () => {
    // Redirect the user to the backend Google OAuth flow
    window.location.href =
      "https://construct-kvv-bn-fork.onrender.com/api/v1/auth/google";
  };

  return (
    <>
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="z-20 bg-black shadow-2xl rounded-sx overflow-hidden flex w-full max-w-5xl">
          {/* Left Side: Sign Up Form */}
          <div className="p-8 w-1/2">
            <div className="text-amber-800 flex gap-5 items-center mb-8">
              <ArrowLeft />
              <Link href="/" className="text-2xl font-semibold">
                Construction Kvv
              </Link>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 my-2">
                Sign-In
              </h2>
              <p className="text-gray-600">
                Create your account to get started.
              </p>
            </div>
            <form onSubmit={handleSignUp}>
              <div className="flex gap-2">
                <div className="mb-4 w-[50%]">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="first_name"
                      id="first_name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="your first name"
                      value={first_name}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <UserRound
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>
                <div className="mb-4 w-[50%]">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Second Name
                  </label>
                  <div className="relative">
                    <input
                      type="second_name"
                      id="second_name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="your second name"
                      value={second_name}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <UserRound
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
                <p className="text-gray-600 text-xs italic">
                  Minimum 8 characters
                </p>
              </div>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-gray-700 text-sm">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-amber-300 rounded focus:ring-amber-600"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a
                  href="#"
                  className="inline-block align-baseline font-semibold text-sm text-amber-300 hover:text-amber-500"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-6 border-t pt-6">
              <p className="text-center text-gray-600 text-sm mb-2">
                Or sign up with
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleGoogleLogin}
                  className="bg-white border text-gray-700 font-semibold py-2 px-4 rounded hover:bg-amber-400 hover:border-amber-400 hover:text-white flex items-center cursor-pointer"
                >
                  <FcGoogle className="mr-2" />
                  Google
                </button>
                <button className="bg-white border text-gray-700 font-semibold py-2 px-4 rounded hover:bg-amber-400 hover:border-amber-400 hover:text-white flex items-center cursor-pointer">
                  <IoLogoFacebook className="mr-2 text-blue-600" />
                  Facebook
                </button>
              </div>
            </div>
            <div className="mt-4 text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-amber-500 hover:text-amber-400"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Side: Construction Image */}
          <div className="w-1/2 relative">
            <Image
              src="/architect.jpg"
              alt="Construction"
              width={500}
              height={500}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 self-baseline h-[100%] bg-black opacity-75 flex place-items-end-safe justify-center">
              <ContactAddress />
            </div>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </>
  );
};

export default Page;
