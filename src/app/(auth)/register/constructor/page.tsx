"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  constructorRegistrationSchema,
  type ConstructorRegistration,
} from "@/app/libs/validations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ConstructorHero from "@/components/features/auth/ConstructorHero"; // Ensure this import is correct
import Link from "next/link";
export default function ConstructorRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConstructorRegistration>({
    resolver: zodResolver(constructorRegistrationSchema),
  });

  const onSubmit = async (data: ConstructorRegistration) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Constructor registration data:", data);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Registration Complete!
            </h2>
            <p className="text-slate-600 mb-6">
              Thank you for registering as a Constructor. We&apos;ll review your
              application and get back to you soon.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto flex items-center gap-5 justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/join-as-pro" className="mb-4 flex items-center w-15">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Constructor Registration
          </h1>
          <p className="text-slate-600 mt-2">
            Join our network of professional constructors
          </p>
        </div>

        <Card className="shadow-xl px-10">
          <CardHeader>
            <CardTitle>Personal & Business Information</CardTitle>
            <CardDescription>
              Please provide your details to complete the registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="ABC Construction Co."
                  />
                  {errors.company && (
                    <p className="text-sm text-destructive">
                      {errors.company.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  {...register("yearsOfExperience", { valueAsNumber: true })}
                  placeholder="10"
                />
                {errors.yearsOfExperience && (
                  <p className="text-sm text-destructive">
                    {errors.yearsOfExperience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specializations">Specializations *</Label>
                <select
                  id="specializations"
                  {...register("specializations")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select your specialization</option>
                  <option value="residential">Residential Architecture</option>
                  <option value="commercial">Commercial Architecture</option>
                  <option value="industrial">Industrial Architecture</option>
                  <option value="interior">Interior Architecture</option>
                  <option value="landscape">Landscape Architecture</option>
                  <option value="urban">Urban Design & Planning</option>
                  <option value="sustainable">
                    Sustainable/Green Architecture
                  </option>
                  <option value="heritage">Heritage & Conservation</option>
                  <option value="hospitality">Hospitality Architecture</option>
                  <option value="healthcare">Healthcare Architecture</option>
                  <option value="educational">Educational Facilities</option>
                  <option value="mixed_use">Mixed-Use Development</option>
                  <option value="other">Other Specialization</option>
                </select>
                {errors.specializations && (
                  <p className="text-sm text-destructive">
                    {errors.specializations.message}
                  </p>
                )}
              </div>

              <FileUpload
                label="Certifications"
                description="Upload your professional certifications (PDF, JPG, PNG)"
                onFilesChange={(files) => setValue("certifications", files)}
                error={errors.certifications?.message}
              />

              <FileUpload
                label="Licenses"
                description="Upload your construction licenses and permits"
                onFilesChange={(files) => setValue("licenses", files)}
                error={errors.licenses?.message}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Complete Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="w-[45%]">
        <ConstructorHero />
      </div>
    </div>
  );
}
