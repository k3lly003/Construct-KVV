"use client";
import React, { useState } from "react";
import { Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoFacebook } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import ContactAddress from "@/app/(components)/sections/ContactAddress";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { GenericButton } from "@/components/ui/generic-button";

// Zod validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const router = useRouter();
  const { t } = useTranslation();

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});
  // Validate with zod
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    const fieldErrors: { email?: string; password?: string } = {};
    result.error.errors.forEach((err) => {
      if (err.path[0] === "email") fieldErrors.email = err.message;
      if (err.path[0] === "password") fieldErrors.password = err.message;
    });
    setErrors(fieldErrors);
    toast.error("Please fix the requirements and try again.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(
      "https://construct-kvv-bn-fork.onrender.com/api/v1/user/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ email, password }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Login failed");
    }
    const { token, user } = responseData.data; 
    // Store token and user data in localStorage
    if (token) {
      localStorage.setItem("authToken", token);
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    toast.success("Login successful!");
    router.push("/");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred during login.");
    console.error("Login error:", err);
  } finally {
    setLoading(false);
  }
};

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  const handleGoogleLogin = () => {
    window.location.href =
      "https://construct-kvv-bn-fork.onrender.com/api/v1/auth/google";
  };

  return (
    <>
      <Toaster richColors position="top-right"/>
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="z-20 bg-black shadow-2xl rounded-sx overflow-hidden flex w-full max-w-5xl">
          {/* Left Side: Sign Up Form */}
          <div className="p-8 mx-10  w-full md:mx-0 md:w-1/2 ">
            <Link href="/" className="block mb-4">
          <GenericButton
            variant="ghost"
            size="sm"
            className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-amber-200"
          >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </GenericButton>
        </Link>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 my-2">
                {t('auth.signin.title')}
              </h2>
              <p className="text-gray-600">
                {t('auth.signin.subtitle')}
              </p>
            </div>
            <form onSubmit={handleSignIn}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  {t('auth.signin.email')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-white ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  {t('auth.signin.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline text-white ${
                      errors.password ? "border-red-500" : ""
                    }`}
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
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
                  {t('auth.signin.forgotPassword')}
                </a>
              </div>
              <button
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : t('auth.signin.signInButton')}
              </button>
            </form>
            <div className="mt-6 border-t pt-6">
              <p className="text-center text-gray-600 text-sm mb-2">
                Or sign in with
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
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="font-semibold text-amber-500 hover:text-amber-400"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Right Side: Construction Image */}
          <div className="w-1/2 relative hidden md:flex">
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
    </>
  );
};

export default Page;
