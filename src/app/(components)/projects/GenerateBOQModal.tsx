"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateBoq, GenerateBoqRequest } from "@/app/services/boqService";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GenerateBOQModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function GenerateBOQModal({
  isOpen,
  onClose,
  projectId,
}: GenerateBOQModalProps) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    if (!logoFile) {
      toast.error("Please upload a company logo");
      return;
    }

    setIsGenerating(true);

    try {
      const authToken =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;

      if (!authToken) {
        toast.error("Please log in to generate BOQ");
        setIsGenerating(false);
        return;
      }

      // Generate BOQ with multipart/form-data
      toast.loading("Generating BOQ PDF...");
      const payload: GenerateBoqRequest = {
        companyName: companyName.trim(),
        companyLogo: logoFile,
        generatePdf: true,
      };

      const response = await generateBoq(projectId, payload, authToken);

      // Handle different response formats
      const pdfUrl =
        response.boq?.pdfUrl ||
        response.pdfUrl ||
        response.data?.pdfUrl ||
        response.data?.boq?.pdfUrl;

      if (pdfUrl || response.boq?.id) {
        toast.success("BOQ generated successfully");
        
        // Reset form and close modal
        setCompanyName("");
        setLogoFile(null);
        setLogoPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onClose();
        
        // Navigate to view BOQ page
        router.push(`/projects/${projectId}/boq`);
      } else {
        throw new Error(response.message || "Failed to generate BOQ");
      }
    } catch (error: any) {
      console.error("Error generating BOQ:", error);
      toast.error(
        error.message || "BOQ generation failed. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setCompanyName("");
      setLogoFile(null);
      setLogoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Generate BOQ PDF
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Enter company details to generate a Bill of Quantities PDF
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Company Name Input */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isGenerating}
              className="w-full"
              required
            />
          </div>

          {/* Company Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="companyLogo" className="text-sm font-medium">
              Company Logo <span className="text-red-500">*</span>
            </Label>
            {!logoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                <input
                  ref={fileInputRef}
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  disabled={isGenerating}
                  className="hidden"
                />
                <label
                  htmlFor="companyLogo"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload logo
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative border border-gray-300 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {logoFile?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(logoFile?.size || 0) / 1024} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogo}
                    disabled={isGenerating}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isGenerating || !companyName.trim() || !logoFile}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate BOQ"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

