"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HardHat, Truck, MoveLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineDesignServices } from "react-icons/md";
import { VscTools } from "react-icons/vsc";

// Make sure this SVG exists in your public/images/ directory, or swap for your preferred subtle construction SVG illustration
const BG_OVERLAY_SRC = "/images/blueprint-bg.svg";

export default function Home() {
  const router = useRouter();

  const roles = [
    {
      id: "constructor",
      title: "Constructor",
      description:
        "Design, plan, and execute construction projects with expertise and accuracy.",
      icon: HardHat,
      route: "/register/constructor",
    },
    {
      id: "architect",
      title: "Architect",
      description:
        "Design, plan, and execute construction projects with expertise and accuracy.",
      icon: MdOutlineDesignServices,
      route: "/register/architect",
    },
    {
      id: "specialist",
      title: "Technician",
      description:
        "A skilled professional with expert knowledge and technical expertise in specific construction-related fields, dedicated to providing services tailored to industry needs.",
      icon: VscTools,
      route: "/register/technician",
    },
    {
      id: "supplier",
      title: "Supplier",
      description: "Provide materials and resources",
      icon: Truck,
      route: "/register/supplier",
    },
  ];

  const handleRoleSelection = (route: string) => {
    router.push(route);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Decorative construction SVG overlay */}
      <div
        className="pointer-events-none fixed inset-y-0 right-0 w-2/5 max-w-xl opacity-10 -z-10 hidden md:block"
        aria-hidden="true"
      >
        <img
          src={BG_OVERLAY_SRC}
          alt=""
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
      <div className="w-full max-w-4xl z-10">
        <div className="text-center mb-8">
          <div className="flex justify-start max-w-2xl mx-auto">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:bg-slate-200 hover:text-amber-500 rounded-md p-2 gap-3 flex items-center justify-center"
            >
              <MoveLeft />
            </Link>
            <Image src="/kvv-logo.png" alt="KVV Pro" width={42} height={42} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Welcome to ConstructKVV platform
          </h1>
          <p className="text-lg text-slate-600">
            Join our professional construction network
          </p>
        </div>
        <Card className="w-full max-w-2xl mx-auto shadow-xl bg-white/90 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              What name describes you best?
            </CardTitle>
            <CardDescription className="text-base">
              Choose your role to get started with the registration process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Button
                  key={role.id}
                  variant="outline"
                  className="w-full h-auto p-6 flex items-center justify-start space-x-4 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
                  onClick={() => handleRoleSelection(role.route)}
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="h-8 w-8 text-slate-600 group-hover:text-slate-800" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {role.title}
                    </h3>
                    <p className="text-sm text-slate-600 break-words whitespace-normal">
                      {role.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src="/kvv-logo.png" alt="KVV Pro" width={42} height={42} />
        <h1 className="text-xl font-bold">Already have a proffetional  account?</h1>
        <Link href="/signin" className="text-amber-500 hover:text-amber-400">
          Sign in
        </Link>
        <p className="text-sm text-slate-600">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-amber-500 hover:text-amber-400">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-amber-500 hover:text-amber-400">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
