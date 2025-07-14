"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { getInitials } from "@/lib/utils";
import { profileProps, UserData } from "@/app/utils/dtos/profile";


const Profile = ({NK, userEmail, userName, profilePic}:profileProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    const data = getUserDataFromLocalStorage();
    setUserData(data);
  }, []);

  const logOutHandle = () => {
  localStorage.clear();
  // Optional: Redirect the user to the login page or home page after logging out
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
          <Link href="/dashboard">
            <DropdownMenuItem className="my-2">
              <LayoutDashboard />
              Dashboard
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick ={logOutHandle} className="hover:text-red-600">
            <LogOut className="hover:text-red-600" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Profile;
