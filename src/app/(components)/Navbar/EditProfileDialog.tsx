"use client"

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GenericButton } from "@/components/ui/generic-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCustomerProfile } from "@/app/hooks/useCustomerProfile";
import { Camera } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePic?: string;
  };
}

const EditProfileDialog = ({ isOpen, onClose, userData }: EditProfileDialogProps) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone || "",
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(userData.profilePic || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updateProfile, isUpdating } = useCustomerProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (profilePic) {
      data.append("profilePic", profilePic);
    }
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        onClose();
      },
      onError: (error) => {
        toast.error("Failed to update profile");
        console.error("Update profile error:", error);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile information here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
          <label htmlFor="profilePic" className="relative group cursor-pointer">
            <Avatar className="h-24 w-24">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Profile" />
              ) : (
                <AvatarFallback>
                  {getInitials(formData.firstName + ' ' + formData.lastName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </label>
          
          <input
            type="file"
            id="profilePic"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="sr-only"
          />
          
          <p className="text-small text-gray-500">Click to change profile picture</p>
        </div>
          {/* </div> */}

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <GenericButton
              variant="outline"
              onClick={onClose}
              type="button"
            >
              Cancel
            </GenericButton>
            <GenericButton
              variant="primary"
              type="submit"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </GenericButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog; 