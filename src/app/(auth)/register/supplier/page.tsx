"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  supplierRegistrationSchema,
  type SupplierRegistration,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRef, useState, useEffect } from "react";
import { CheckCircle, ArrowLeft, Camera, User } from "lucide-react";
import { useRouter } from "next/navigation";
import SupplierHero from "@/components/features/auth/SupplierHero";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRegisterSeller } from "@/app/hooks/useSeller";
import { toast } from "sonner";

export default function SupplierRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const [shopImagePreview, setShopImagePreview] = useState<string | null>(null);
  const [documentsPreview, setDocumentsPreview] = useState<File[]>([]);
  const shopImageInputRef = useRef<HTMLInputElement | null>(null);
  const documentsInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SupplierRegistration>({
    resolver: zodResolver(supplierRegistrationSchema),
  });

  const { mutateAsync: registerSellerMutation, isPending } =
    useRegisterSeller();

  // Debug form validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);

  const onSubmit = async (data: SupplierRegistration) => {
    console.log("Form submitted with data:", data);
    try {
      const result = await registerSellerMutation({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        businessName: data.businessName,
        ownerName: data.ownerName,
        businessAddress: data.businessAddress,
        businessPhone: data.businessPhone,
        businessEmail: data.businessEmail,
        deliveryRadius: data.deliveryRadius,
        location: data.location,
        shopImage: data.shopImage as File | string,
        shopDescription: data.shopDescription,
        documents: data.documents as File[],
        taxId: data.taxId,
      });
      console.log("Registration successful:", result);
      toast.success(
        "Registration successful! Your application has been submitted."
      );
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error registering seller:", error);
      const message =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    }
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
              Thank you for registering as a Supplier! Your application has been
              submitted successfully. We&apos;ll review your information and get
              back to you soon. Please wait for a moment to be approved and log
              in later.
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
            Supplier Registration
          </h1>
          <p className="text-slate-600 mt-2">
            Join our network of construction suppliers
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Please provide your business details and service offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                console.log("Form submit event triggered");
                handleSubmit(onSubmit)(e);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Robs"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Smith"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName.message}
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
                    placeholder="user@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Personal Phone *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="1234567890"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    {...register("ownerName")}
                    placeholder="Robert Smith"
                  />
                  {errors.ownerName && (
                    <p className="text-sm text-destructive">
                      {errors.ownerName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryRadius">
                  Delivery Radius (miles) *
                </Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  {...register("deliveryRadius", { valueAsNumber: true })}
                  placeholder="50"
                />
                {errors.deliveryRadius && (
                  <p className="text-sm text-destructive">
                    {errors.deliveryRadius.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="123 Main Street, Kigali, Rwanda"
                />
                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopImage">Shop Image *</Label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => shopImageInputRef.current?.click()}
                    className="relative group"
                    aria-label="Upload shop image"
                  >
                    <div className="relative">
                      <Avatar className="size-24">
                        {shopImagePreview ? (
                          <AvatarImage
                            src={shopImagePreview}
                            alt="Shop image"
                          />
                        ) : (
                          <AvatarFallback className="bg-blue-50 text-blue-400">
                            <User className="h-8 w-8" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 text-white shadow-md">
                        <Camera className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                  <div className="flex-1 space-y-2">
                    <Input
                      id="shopImage"
                      placeholder="Paste image URL or click avatar to choose file"
                      onChange={(e) => {
                        setValue("shopImage", e.target.value);
                        setShopImagePreview(e.target.value || null);
                      }}
                    />
                    <input
                      ref={shopImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const objectUrl = URL.createObjectURL(file);
                          setShopImagePreview(objectUrl);
                          setValue("shopImage", file, { shouldValidate: true });
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      You can either paste an image URL or pick a file from your
                      computer.
                    </p>
                  </div>
                </div>
                {errors.shopImage && (
                  <p className="text-sm text-destructive">
                    {typeof errors.shopImage === "object" &&
                    "message" in errors.shopImage
                      ? String((errors.shopImage as any).message)
                      : String(errors.shopImage)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopDescription">Shop Description *</Label>
                <Textarea
                  id="shopDescription"
                  {...register("shopDescription")}
                  placeholder="We offer quality building supplies..."
                  rows={4}
                />
                {errors.shopDescription && (
                  <p className="text-sm text-destructive">
                    {errors.shopDescription.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  {...register("businessName")}
                  placeholder="Rob's Store"
                />
                {errors.businessName && (
                  <p className="text-sm text-destructive">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Input
                    id="businessAddress"
                    {...register("businessAddress")}
                    placeholder="123 Business St, City, Country"
                  />
                  {errors.businessAddress && (
                    <p className="text-sm text-destructive">
                      {errors.businessAddress.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone *</Label>
                  <Input
                    id="businessPhone"
                    {...register("businessPhone")}
                    placeholder="0987654321"
                  />
                  {errors.businessPhone && (
                    <p className="text-sm text-destructive">
                      {errors.businessPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    {...register("businessEmail")}
                    placeholder="business@robsstore.com"
                  />
                  {errors.businessEmail && (
                    <p className="text-sm text-destructive">
                      {errors.businessEmail.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID *</Label>
                  <Input
                    id="taxId"
                    {...register("taxId")}
                    placeholder="TAX123456"
                  />
                  {errors.taxId && (
                    <p className="text-sm text-destructive">
                      {errors.taxId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents">
                  Documents (PDF, JPG, PNG files) *
                </Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    ref={documentsInputRef}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setDocumentsPreview(files);
                      setValue("documents", files, { shouldValidate: true });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => documentsInputRef.current?.click()}
                    className="w-full"
                  >
                    Choose Documents
                  </Button>
                  {documentsPreview.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Selected files:
                      </p>
                      {documentsPreview.map((file, index) => (
                        <div key={index} className="text-sm text-green-600">
                          ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.documents && (
                  <p className="text-sm text-destructive">
                    {(errors.documents as unknown as any)?.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isPending}
              >
                {isPending || isSubmitting
                  ? "Submitting..."
                  : "Complete Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="w-[45%]">
        <SupplierHero />
      </div>
    </div>
  );
}
