"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierRegistrationSchema, type SupplierRegistration } from "@/app/libs/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";
import { useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SupplierRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SupplierRegistration>({
    resolver: zodResolver(supplierRegistrationSchema),
  });

  const onSubmit = async (data: SupplierRegistration) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Supplier registration data:", data);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Complete!</h2>
            <p className="text-slate-600 mb-6">
              Thank you for registering as a Supplier. We'll review your application and get back to you soon.
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Supplier Registration</h1>
          <p className="text-slate-600 mt-2">Join our network of construction suppliers</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Please provide your business details and service offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Contact Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Michael Johnson"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    {...register("company")}
                    placeholder="Johnson Building Supplies"
                  />
                  {errors.company && (
                    <p className="text-sm text-destructive">{errors.company.message}</p>
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
                    placeholder="michael@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+1 (555) 456-7890"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryRadius">Delivery Radius (miles) *</Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  {...register("deliveryRadius", { valueAsNumber: true })}
                  placeholder="50"
                />
                {errors.deliveryRadius && (
                  <p className="text-sm text-destructive">{errors.deliveryRadius.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productsServices">Products & Services *</Label>
                <Textarea
                  id="productsServices"
                  {...register("productsServices")}
                  placeholder="Describe the construction materials, products, and services you provide..."
                  rows={4}
                />
                {errors.productsServices && (
                  <p className="text-sm text-destructive">{errors.productsServices.message}</p>
                )}
              </div>

              <FileUpload
                label="Business License"
                description="Upload your business license and registration documents"
                onFilesChange={(files) => setValue("businessLicense", files)}
                error={errors.businessLicense?.message}
              />

              <FileUpload
                label="Certifications"
                description="Upload quality certifications and supplier credentials"
                onFilesChange={(files) => setValue("certifications", files)}
                error={errors.certifications?.message}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Complete Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}