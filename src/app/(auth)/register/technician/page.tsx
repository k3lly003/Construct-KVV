"use client";

import { useState } from "react";
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
import { CheckCircle, ArrowLeft, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import SpecialistHero from "@/components/features/auth/SpecialistHero";
import Link from "next/link";
import { useTechnician } from "@/app/hooks/useTechnician";
import { TechnicianRegistrationData } from "@/app/services/technicianService";
import { toast, Toaster } from "sonner";

const CATEGORY_OPTIONS = [
  "MASON_BRICKLAYER",
  "CARPENTER",
  "CONCRETE_SPECIALIST",
  "ROOFING_TECHNICIAN",
  "PAINTER_DECORATOR",
  "PLASTERER_DRYWALL",
  "TILE_FLOORING_SPECIALIST",
  "WALLPAPER_INSTALLER",
  "WELDER_METAL_FABRICATOR",
  "GLASS_ALUMINUM_TECHNICIAN",
  "LOCKSMITH",
  "INSULATION_INSTALLER",
  "LANDSCAPER_GARDENING",
  "PAVING_ROADWORK",
  "FENCING_INSTALLER",
  "HANDYMAN",
  "PEST_CONTROL",
  "WATER_PUMP_BOREHOLE"
];

interface DocumentInput {
  id: string;
  files: File[];
  names: string[];
  types: string[];
}

export default function TechnicianRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { register, loading, error, clearError } = useTechnician();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    experience: "",
  });

  const [location, setLocation] = useState({
    province: "",
    district: "",
    cell: "",
  });

  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentInput[]>([
    { id: "1", files: [], names: [], types: [] },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (specialization: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specialization)
        ? prev.filter((s) => s !== specialization)
        : [...prev, specialization]
    );
  };

  const addDocument = () => {
    const newId = (documents.length + 1).toString();
    setDocuments((prev) => [...prev, { id: newId, files: [], names: [], types: [] }]);
  };

  const removeDocument = (id: string) => {
    if (documents.length > 1) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  const handleFileUpload = (id: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { 
        ...doc, 
        files: [...doc.files, ...fileArray],
        names: [...doc.names, ...fileArray.map(f => f.name)],
        types: [...doc.types, ...fileArray.map(f => f.type)]
      } : doc))
    );
  };

  const removeFile = (docId: string, fileIndex: number) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { 
        ...doc, 
        files: doc.files.filter((_, index) => index !== fileIndex),
        names: doc.names.filter((_, index) => index !== fileIndex),
        types: doc.types.filter((_, index) => index !== fileIndex)
      } : doc))
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const validDocuments = documents
      .filter((doc) => doc.files.length > 0)
      .flatMap((doc) => doc.names);

    const registrationData: TechnicianRegistrationData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      categories: selectedSpecializations, // Send selected categories
      location: [location.province.trim(), location.district.trim(), location.cell.trim()].filter(Boolean),
      documents: validDocuments,
      experience: parseInt(formData.experience) || 0,
      specializations: [], // Empty array for specializations field
    };

    try {
      await register(registrationData);
      toast.success("Registration successful! Your application has been submitted.");
      setIsSubmitted(true);
    } catch (err) {
      toast.error("Registration failed. Please check your information and try again.");
    }
  };

  if (isSubmitted) {
    // Redirect to OTP verification page instead of showing completion message
    router.push('/auth-verification');
    return null;
  }

  return (
    <>
    <div className="min-h-screen max-w-7xl mx-auto flex items-center gap-5 justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/join-as-pro" className="mb-4 flex items-center w-15">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Technician Registration
          </h1>
          <p className="text-slate-600 mt-2">
            Share your expertise and provide specialized services
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
            {error && (
              <div className="mb-6 p-3 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Mike"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Johnson"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="technician@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="password123"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+250788123456"
                  />
                </div>
              </div>

              {/* Categories (Multi-select) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Categories</h3>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Select your technician categories (you can choose multiple)
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {CATEGORY_OPTIONS.map((category) => (
                      <div
                        key={category}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedSpecializations.includes(category)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleSpecialization(category)}
                      >
                        <div
                          className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                            selectedSpecializations.includes(category)
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedSpecializations.includes(category) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            selectedSpecializations.includes(category)
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {category}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {selectedSpecializations.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-2">
                        Selected Categories ({selectedSpecializations.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecializations.map((category) => (
                          <span
                            key={category}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => toggleSpecialization(category)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Province *</Label>
                    <Input
                      value={location.province}
                      onChange={(e) => setLocation((p) => ({ ...p, province: e.target.value }))}
                      placeholder="Eastern Province"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">District *</Label>
                    <Input
                      value={location.district}
                      onChange={(e) => setLocation((p) => ({ ...p, district: e.target.value }))}
                      placeholder="Rwamagana"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Cell *</Label>
                    <Input
                      value={location.cell}
                      onChange={(e) => setLocation((p) => ({ ...p, cell: e.target.value }))}
                      placeholder="Muhazi"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years) *</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="5"
                />
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Documents</h3>
                
                {documents.map((document) => (
                  <div key={document.id} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Document Files *</Label>
                        <Input
                          type="file"
                          multiple
                          onChange={(e) => {
                            handleFileUpload(document.id, e.target.files);
                          }}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                          className="mt-1"
                        />
                      </div>
                      
                      {document.files.length > 0 && (
                        <div className="space-y-2">
                          {document.files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{document.names[index]}</p>
                                <p className="text-xs text-gray-500">{document.types[index]}</p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeFile(document.id, index)}
                                className="px-2"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {document.files.length > 0 
                          ? `${document.files.length} file(s) attached`
                          : "Please select document files"
                        }
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDocument(document.id)}
                        className="px-3"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button type="button" variant="outline" onClick={addDocument}>
                  Add Document
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering...
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* <div className="w-[45%]">
        <SpecialistHero />
      </div> */}
    </div>
    <Toaster position="top-right" />
    </>
  );
}
