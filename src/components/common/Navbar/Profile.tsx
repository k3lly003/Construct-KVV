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


interface profileProps{
  NK: string;
  userName: string;
  userEmail: string;
}
const Profile = ({NK, userEmail, userName}:profileProps) => {
  
  const logOutHandle = () => {
  localStorage.clear();
  // Optional: Redirect the user to the login page or home page after logging out
  window.location.href = '/signin'; 
  // or 
  // window.location.reload(); // Reloads the page to clear any in-memory state
  
  console.log("Local storage cleared. User logged out.");
};

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{NK}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="flex gap-3 justify-center items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>{NK}</AvatarFallback>
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
