"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Mail, Eye, EyeOff, ArrowLeft, UserRound } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoFacebook } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import ContactAddress from "@/app/(components)/sections/ContactAddress";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { User } from "@/types/user";

// Zod validation for signup
const signupSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  second_name: z.string().min(2, "Second name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function isAxiosError(
  error: unknown
): error is { response?: { data?: { message?: string } } } {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

const Page = () => {
  const [first_name, setFirst_name] = useState("");
  const [second_name, setSecond_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    first_name?: string;
    second_name?: string;
    email?: string;
    password?: string;
  }>({});

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    // Validate with zod
    const result = signupSchema.safeParse({
      first_name,
      second_name,
      email,
      password,
    });
    if (!result.success) {
      const fieldErrors: {
        first_name?: string;
        second_name?: string;
        email?: string;
        password?: string;
      } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "first_name") fieldErrors.first_name = err.message;
        if (err.path[0] === "second_name")
          fieldErrors.second_name = err.message;
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the requirements and try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://construct-kvv-bn-fork.onrender.com/api/v1/user/register",
        {
          firstName: first_name,
          lastName: second_name,
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data as { data?: { token?: string; user?: User } };
      // Store the authentication token if present
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
      }
      if (data.data?.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      toast.success("Signup successful!");
      router.push("/signin");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (isAxiosError(err)) {
        toast.error(
          err.response?.data?.message ||
            "An unexpected error occurred during signup."
        );
      } else {
        toast.error("An unexpected error occurred during signup.");
      }
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
      <Toaster richColors position="top-right" />
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
                Sign-Up
              </h2>
              <p className="text-gray-600">
                Create your account to get started.
              </p>
            </div>
            <form onSubmit={handleSignUp}>
              <div className="flex gap-2">
                <div className="mb-4 w-[50%]">
                  <label
                    htmlFor="first_name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="first_name"
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.first_name ? "border-red-500" : ""
                      }`}
                      placeholder="your first name"
                      value={first_name}
                      onChange={(e) => setFirst_name(e.target.value)}
                    />
                    <UserRound
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>
                <div className="mb-4 w-[50%]">
                  <label
                    htmlFor="second_name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Second Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="second_name"
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.second_name ? "border-red-500" : ""
                      }`}
                      placeholder="your second name"
                      value={second_name}
                      onChange={(e) => setSecond_name(e.target.value)}
                    />
                    <UserRound
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                  {errors.second_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.second_name}
                    </p>
                  )}
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
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
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
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
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
                  Forgot Password?
                </a>
              </div>
              <button
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
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
