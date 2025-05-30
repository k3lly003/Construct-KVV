'use client'

import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
// import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../../redux';
import { setIsSidebarCollapsed } from '../../../../state';
import CustomSheet from '../shad_/CustomSheet';
import ModeToggle from '../../../../components/mode-toggle';
import { useUserStore } from '../../../../store/userStore'; 


const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();

  // INITIATE STATE HERE ⬇️
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  // MANIPULATE STATE HERE ⬇️
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // DISPLAY THE CUSTOMSHEET
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  // Get user data from Zustand store
  const { role: userRole, name: userName, isHydrated } = useUserStore();

  if (!isHydrated) {
    return (
      <div className='flex justify-between items-center w-full mb-7'>
        {/* A minimal Navbar or loading state that is consistent server-side */}
        <div className='flex justify-between items-center gap-5'>
          <button
            className='px-3 py-3 rounded-full text-muted-foreground border hover:cursor-pointer'
            onClick={toggleSidebar}
          >
            <Menu className='w-4 h-4' />
          </button>
        </div>
        {/* Placeholder for right side to match server render */}
        <div className='flex justify-between items-center gap-5'>
          <ModeToggle />
          {/* Other elements that don't depend on userRole could go here */}
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-between items-center w-full mb-7'>
      {/* LEFT SIDE */}
      <div className='flex justify-between items-center gap-5'>
        <button
          className='px-3 py-3 rounded-full text-muted-foreground border hover:cursor-pointer'
          onClick={toggleSidebar}
        >
          <Menu className='w-4 h-4' />
        </button>
      </div>

      {/* CENTER (Admin specific search bar) */}
         {userRole === 'ADMIN' && (
        <div className='hidden md:flex w-50 md:w-80 border-2 e rounded-lg focus:outline-none focus:border-blue-500'>
          <input
            type='search'
            placeholder='type to search ...'
            className='px-4 w-full py-2 text-muted-foreground'
          />
          <div className='relative insert-y-0 left-0 px-3 flex items-center pointer-events-non w-12'>
            <Search className='text-muted-foreground' size={20} />
          </div>
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className='flex justify-between items-center gap-5'>
        <div className='md:flex justify-between items-center gap-5'>
          <div>
            <ModeToggle />
          </div>
          <div className='relative hidden md:flex'>
            <Bell className='cursor-pointer text-gray-500' size={24} />
            <span className='absolute top-2 right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full'>
              3
            </span>
          </div>
          <hr className='hidden md:flex w-0 h-7 border border-solid border-l border-gray-300 mx-3' />
          <div
            className='hidden md:flex items-center gap-3 cursor-pointer'
            onClick={handleOpenSheet}
          >
            <div className='w-9 h-9 p-5 bg-blue-100 rounded-full'></div>
            {isSheetOpen && userName &&(
              <CustomSheet open={<span className='font-normal text-sm'>{userName}</span>} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;