"use client"

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerProfileSheet } from "@/app/(components)/Navbar/custProfileSheet";
import EditProfileDialog from "@/app/(components)/Navbar/EditProfileDialog";
import { useCustomerProfile } from "@/app/hooks/useCustomerProfile";
import { getInitials } from "@/lib/utils";

const CustomerProfile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { profile, isLoading, error } = useCustomerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1">
        <span className="sr-only">Loading...</span>
        <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
    );
  }
  if (error || !profile) {
    return <div className="p-4 text-center text-red-500">Unable to load profile.</div>;
  }

  const initials = getInitials(
    (profile.firstName || "") + " " + (profile.lastName || "")
  );
  const userName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  const userEmail = profile.email;
  const profilePic = profile.profilePic;

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Avatar
            className="cursor-pointer"
            onClick={() => setIsSheetOpen(true)}
          >
            {profilePic ? (
              <AvatarImage src={profilePic} alt={userName} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
        </SheetTrigger>
        <SheetContent className="w-[500px] p-3 sm:w-[540px] border-none bg-transparent">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          <CustomerProfileSheet
            firstName={profile.firstName}
            lastName={profile.lastName}
            email={userEmail}
            phone={profile.phone}
            profilePic={profilePic}
            initials={initials}
          />
        </SheetContent>
      </Sheet>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        userData={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: userEmail,
          phone: profile.phone,
          profilePic: profilePic
        }}
      />
    </>
  );
};

export default CustomerProfile;
