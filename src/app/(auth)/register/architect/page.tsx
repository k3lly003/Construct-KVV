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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, CheckCircle, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import ArchitectHero from "@/components/features/auth/architectHero";
import Link from "next/link";
import { useArchitect } from "@/app/hooks/useArchitect";
import { ArchitectRegistrationData } from "@/app/services/architectService";
import { toast, Toaster } from "sonner";

interface LocationInput {
  id: string;
  province: string;
  district: string;
  cell: string;
}

interface DocumentInput {
  id: string;
  files: File[];
  names: string[];
  types: string[];
}

interface SpecializationInput {
  id: string;
  value: string;
}

// Add the predefined specializations
const SPECIALIZATION_OPTIONS = [
  "Conceptual Design",
  "Project Planning", 
  "BIM (Building Information Modeling)",
  "Commercial",
  "Residential",
  "Industrial",
  "3D Modeling",
  "Interior",
  "Landscape"
];

export default function ArchitectRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { register, loading, error, clearError } = useArchitect();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    businessName: "",
    licenseNumber: "",
    yearsExperience: "",
  });

  const [locations, setLocations] = useState<LocationInput[]>([
    { id: "1", province: "", district: "", cell: "" },
  ]);

  const [documents, setDocuments] = useState<DocumentInput[]>([
    { id: "1", files: [], names: [], types: [] },
  ]);

  // Change specializations to use selected values instead of input fields
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addLocation = () => {
    const newId = (locations.length + 1).toString();
    setLocations((prev) => [...prev, { id: newId, province: "", district: "", cell: "" }]);
  };

  const removeLocation = (id: string) => {
    if (locations.length > 1) {
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    }
  };

  const updateLocation = (id: string, field: 'province' | 'district' | 'cell', value: string) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, [field]: value } : loc))
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

  const toggleSpecialization = (specialization: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(specialization)
        ? prev.filter((spec) => spec !== specialization)
        : [...prev, specialization]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validate required fields
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return;
    }

    // Filter out empty locations, documents, and specializations
    const validLocations = locations
      .filter((loc) => loc.province.trim() && loc.district.trim())
      .flatMap((loc) => [
        loc.province.trim(),
        loc.district.trim(),
        loc.cell.trim() || "" // Include empty string if cell is not provided
      ]);

    const validDocuments = documents
      .filter((doc) => doc.files.length > 0)
      .flatMap((doc) => doc.names);

    const validSpecializations = selectedSpecializations;

    const registrationData: ArchitectRegistrationData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      businessName: formData.businessName,
      licenseNumber: formData.licenseNumber,
      location: validLocations,
      yearsExperience: parseInt(formData.yearsExperience) || 0,
      documents: validDocuments,
      specializations: validSpecializations,
    };

    try {
      await register(registrationData);
      toast.success("Registration successful! Your application has been submitted.");
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled by the hook, but we can show a toast for additional feedback
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
              Architect Registration
            </h1>
            <p className="text-slate-600 mt-2">
              Join our network of professional architects
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
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Jane"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Smith"
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
                        placeholder="jane@example.com"
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
                        placeholder="Enter your password"
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

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Business Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      placeholder="Smith Architecture Studio"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        placeholder="ARCH123456789"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                        placeholder="8"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Service Locations
                    </h3>
                  </div>
                  
                  {locations.map((location) => (
                    <div key={location.id} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Province *</Label>
                          <Input
                            value={location.province || ""}
                            onChange={(e) => updateLocation(location.id, "province", e.target.value)}
                            placeholder="e.g., Kigali"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">District *</Label>
                          <Input
                            value={location.district || ""}
                            onChange={(e) => updateLocation(location.id, "district", e.target.value)}
                            placeholder="e.g., Nyarugenge"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Cell</Label>
                          <Input
                            value={location.cell || ""}
                            onChange={(e) => updateLocation(location.id, "cell", e.target.value)}
                            placeholder="e.g., Nyarugenge"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {location.province && location.district && location.cell 
                            ? `${location.province}, ${location.district}, ${location.cell}`
                            : "Fill in the location details above"
                          }
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLocation(location.id)}
                          className="px-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Specializations */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Specializations
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Select your areas of expertise (you can choose multiple)
                    </Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SPECIALIZATION_OPTIONS.map((specialization) => (
                        <div
                          key={specialization}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedSpecializations.includes(specialization)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleSpecialization(specialization)}
                        >
                          <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                            selectedSpecializations.includes(specialization)
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}>
                            {selectedSpecializations.includes(specialization) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className={`text-sm font-medium ${
                            selectedSpecializations.includes(specialization)
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}>
                            {specialization}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {selectedSpecializations.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium mb-2">
                          Selected Specializations ({selectedSpecializations.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSpecializations.map((spec) => (
                            <span
                              key={spec}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {spec}
                              <button
                                type="button"
                                onClick={() => toggleSpecialization(spec)}
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

                {/* Documents */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Documents
                    </h3>
                  </div>
                  
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
          <ArchitectHero />
        </div> */}
      </div>
      <Toaster position="top-right" />
    </>
  );
}
