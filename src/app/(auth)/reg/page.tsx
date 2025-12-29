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
import { X, ArrowLeft, Check, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useArchitect } from "@/app/hooks/useArchitect";
import { ArchitectRegistrationData } from "@/app/services/architectService";
import { toast, Toaster } from "sonner";

interface LocationInput {
  id: string;
  province: string;
  sector: string;
  cell: string;
}

interface DocumentInput {
  id: string;
  files: File[];
  names: string[];
  types: string[];
}

// Predefined specializations
const SPECIALIZATION_OPTIONS = [
  "Conceptual Design",
  "Project Planning", 
  "BIM (Building Information Modeling)",
  "Commercial",
  "Residential",
  "Industrial",
  "3D Modeling",
  "Interior",
  "Landscape",
  "Sustainable Design",
  "Urban Planning",
  "Renovation & Restoration"
];

export default function RegistrationPage() {
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
    { id: "1", province: "", sector: "", cell: "" },
  ]);

  const [documents, setDocuments] = useState<DocumentInput[]>([
    { id: "1", files: [], names: [], types: [] },
  ]);

  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addLocation = () => {
    const newId = (locations.length + 1).toString();
    setLocations((prev) => [...prev, { id: newId, province: "", sector: "", cell: "" }]);
  };

  const removeLocation = (id: string) => {
    if (locations.length > 1) {
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    }
  };

  const updateLocation = (id: string, field: 'province' | 'sector' | 'cell', value: string) => {
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
      toast.error("Please fill in all required fields");
      return;
    }

    // Filter out empty locations and flatten into array
    const validLocations = locations
      .filter((loc) => loc.province.trim() && loc.sector.trim())
      .flatMap((loc) => [
        loc.province.trim(),
        loc.sector.trim(),
        loc.cell.trim() || ""
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
      toast.error("Registration failed. Please check your information and try again.");
    }
  };

  if (isSubmitted) {
    router.push('/auth-verification');
    return null;
  }

  return (
    <>
      <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/architect.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-blue-900/70 backdrop-blur-[2px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-small font-medium text-white/90 hover:text-white transition-colors mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <h1 className="text-large font-bold text-white drop-shadow-lg">
              Professional Registration
            </h1>
            <p className="text-white/90 mt-2 text-mid drop-shadow-md">
              Join our network of professional service providers
            </p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-mid">Create Your Account</CardTitle>
              <CardDescription className="text-base">
                Please provide your details to complete the registration process
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={onSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      1
                    </div>
                    <h3 className="text-mid font-semibold text-slate-900">
                      Personal Information
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-small font-medium">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter your first name"
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-small font-medium">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter your last name"
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-small font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-small font-medium">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Create a strong password"
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone" className="text-small font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+250 788 123 456"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      2
                    </div>
                    <h3 className="text-mid font-semibold text-slate-900">
                      Business Information
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="businessName" className="text-small font-medium">
                        Business Name
                      </Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        placeholder="Your business or company name"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber" className="text-small font-medium">
                        License Number
                      </Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        placeholder="Professional license number"
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience" className="text-small font-medium">
                        Years of Experience
                      </Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                        placeholder="0"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                        3
                      </div>
                      <h3 className="text-mid font-semibold text-slate-900">
                        Service Locations
                      </h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLocation}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      + Add Location
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {locations.map((location, index) => (
                      <div key={location.id} className="p-5 border-2 rounded-lg bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-small font-semibold text-slate-700">
                            Location {index + 1}
                          </span>
                          {locations.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLocation(location.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-small font-medium text-slate-700">
                              Province <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={location.province || ""}
                              onChange={(e) => updateLocation(location.id, "province", e.target.value)}
                              placeholder="e.g., Kigali"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-small font-medium text-slate-700">
                              Sector <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={location.sector || ""}
                              onChange={(e) => updateLocation(location.id, "sector", e.target.value)}
                              placeholder="e.g., Nyarugenge"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-small font-medium text-slate-700">
                              Cell
                            </Label>
                            <Input
                              value={location.cell || ""}
                              onChange={(e) => updateLocation(location.id, "cell", e.target.value)}
                              placeholder="e.g., Muhima"
                              className="h-10"
                            />
                          </div>
                        </div>
                        
                        {location.province && location.sector && (
                          <div className="mt-3 text-small text-slate-600 bg-white p-2 rounded border">
                            📍 {location.province}, {location.sector}{location.cell ? `, ${location.cell}` : ''}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-200">
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      4
                    </div>
                    <h3 className="text-mid font-semibold text-slate-900">
                      Specializations
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-small font-medium text-slate-700">
                      Select your areas of expertise (you can choose multiple)
                    </Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {SPECIALIZATION_OPTIONS.map((specialization) => (
                        <div
                          key={specialization}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedSpecializations.includes(specialization)
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                          }`}
                          onClick={() => toggleSpecialization(specialization)}
                        >
                          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 mr-3 ${
                            selectedSpecializations.includes(specialization)
                              ? "border-blue-500 bg-blue-500"
                              : "border-slate-300"
                          }`}>
                            {selectedSpecializations.includes(specialization) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className={`text-small font-medium ${
                            selectedSpecializations.includes(specialization)
                              ? "text-blue-700"
                              : "text-slate-700"
                          }`}>
                            {specialization}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {selectedSpecializations.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <p className="text-small text-blue-900 font-semibold mb-3">
                          Selected Specializations ({selectedSpecializations.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSpecializations.map((spec) => (
                            <span
                              key={spec}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-small font-medium bg-blue-100 text-blue-800 border border-blue-300"
                            >
                              {spec}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSpecialization(spec);
                                }}
                                className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                        5
                      </div>
                      <h3 className="text-mid font-semibold text-slate-900">
                        Documents
                      </h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDocument}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      + Add Document
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {documents.map((document, index) => (
                      <div key={document.id} className="p-5 border-2 rounded-lg bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-small font-semibold text-slate-700">
                            Document Set {index + 1}
                          </span>
                          {documents.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument(document.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label className="text-small font-medium text-slate-700 mb-2 block">
                              Upload Files
                            </Label>
                            <div className="relative">
                              <Input
                                type="file"
                                multiple
                                onChange={(e) => {
                                  handleFileUpload(document.id, e.target.files);
                                }}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                className="h-11 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-small file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                            <p className="text-small text-slate-500 mt-1">
                              Accepted formats: PDF, DOC, DOCX, JPG, PNG, TXT
                            </p>
                          </div>
                          
                          {document.files.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-small font-medium text-slate-700">
                                Uploaded Files ({document.files.length})
                              </Label>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {document.files.map((file, fileIndex) => (
                                  <div key={fileIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-colors">
                                    <Upload className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-small font-medium text-slate-900 truncate">
                                        {document.names[fileIndex]}
                                      </p>
                                      <p className="text-small text-slate-500">
                                        {document.types[fileIndex]}
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(document.id, fileIndex)}
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-slate-200">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Registration...
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                  <p className="text-center text-small text-slate-600 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
}
