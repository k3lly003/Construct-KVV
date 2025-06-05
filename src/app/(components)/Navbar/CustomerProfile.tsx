"use client"

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Mail, Phone, MapPin } from "lucide-react";
import { GenericButton } from "@/components/ui/generic-button";
import EditProfileDialog from "./EditProfileDialog";
import { useUserProfile } from "@/app/hooks/useUserProfile";
import { getInitials } from "@/lib/utils";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";

interface profileProps {
  NK: string;
  userName: string;
  userEmail: string;
  profilePic?: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
  role?: string;
}

const CustomerProfile = ({ NK, userEmail, userName, profilePic }: profileProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { userProfile, isLoading } = useUserProfile();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const data = getUserDataFromLocalStorage();
    setUserData(data);
  }, []);

  const logOutHandle = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  const getInitialsFromUserData = () => {
    if (userData?.firstName && userData?.lastName) {
      return getInitials(`${userData.firstName} ${userData.lastName}`);
    }
    return NK;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            {profilePic ? (
              <AvatarImage src={profilePic} alt={userName} />
            ) : (
              <AvatarFallback>{getInitialsFromUserData()}</AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex gap-3 justify-center items-center">
            <Avatar>
              {profilePic ? (
                <AvatarImage src={profilePic} alt={userName} />
              ) : (
                <AvatarFallback>{getInitialsFromUserData()}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p>{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Sheet>
            <SheetTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </SheetTrigger>
            <SheetContent className="w-[500px] p-3 sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Profile Information</SheetTitle>
                <SheetDescription>
                  View and manage your account details
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    {profilePic ? (
                      <AvatarImage src={profilePic} alt={userName} />
                    ) : (
                      <AvatarFallback>{getInitialsFromUserData()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{userName}</h3>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-500">{userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-500">
                        {isLoading ? "Loading..." : userProfile?.phone || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-gray-500">
                        {isLoading ? "Loading..." : userProfile?.location || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <GenericButton
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    Edit Profile
                  </GenericButton>
                  <GenericButton
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {/* Handle change password */}}
                  >
                    Change Password
                  </GenericButton>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <DropdownMenuItem onClick={logOutHandle} className="hover:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        userData={{
          name: userName,
          email: userEmail,
          phone: userProfile?.phone,
          location: userProfile?.location,
          profilePicture: profilePic
        }}
      />
    </>
  );
};

export default CustomerProfile;
