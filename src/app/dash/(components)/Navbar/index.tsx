'use client'
import React, { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
// import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../../redux'
import { setIsSidebarCollapsed } from '../../../../state'
import CustomSheet from '../shad_/CustomSheet'
import ModeToggle from "../../../../components/mode-toggle";

const Navbar = () => {
  const dispatch = useAppDispatch();
  
  //INITIATE STATE HERE ⬇️
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  
  // MANIPULATE STATE HERE ⬇️
  const toogleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // DISPLAY THE CUSTOMSHEET
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  // const handleCloseSheet = () => {
  //   setIsSheetOpen(false);
  // };



  return (
    <div className='flex justify-between items-center w-full mb-7'>
        {/* LEFT SIDE */}
        <div className='flex justify-between items-center gap-5'>
            <button className='px-3 py-3 rounded-full text-muted-foreground border hover:cursor-pointer' onClick={toogleSidebar}>
                <Menu className='w-4 h-4'/>
            </button>
        </div>
        {/* RIGHT SIDE */}
        <div className='flex justify-between items-center gap-5'>
          <div className='md:flex justify-between items-center gap-5'>
            <div>
             <ModeToggle />
            </div>
            <div className='relative hidden md:flex'>
              <Bell className='cursor-pointer text-gray-500' size={24}/>
              <span className='absolute top-2 right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full'>3</span>
            </div>
            <hr className='hidden md:flex w-0 h-7 border border-solid border-l border-gray-300 mx-3'/>
            <div className='hidden md:flex items-center gap-3 cursor-pointer' onClick={handleOpenSheet} >
              <div className='w-9 h-9 p-5 bg-blue-100 rounded-full'></div>
              {isSheetOpen && <CustomSheet open={<span className='font-semibold'>Brice Ntiru</span>}/>}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Navbar