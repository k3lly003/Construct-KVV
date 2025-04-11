"use client"

import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";
import { IoMenuSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  console.log(pathname);

  const toggleOpen = () => {
    setOpen(!open);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`${scrolled && 'bg-white bg-opacity-100'} ${!scrolled && 'bg-white bg-opacity-0 border-none text-white'} w-full z-40 md:px-4 fixed border-b`}>
      <div className="flex items-center font-medium justify-between mx-auto max-w-screen-xl">
        <div className="z-50 p-4 md:p-0 md:w-auto w-full flex justify-between">
          <Link href={'/'} onClick={() => setOpen(false)}>
            <Image src={"/logo/logo3.png"} alt="" width={50} height={30} className="h-9 w-auto md:cursor-pointer" />
          </Link>
          <div className="text-3xl md:hidden" onClick={() => setOpen(!open)}>
            {open ? <IoCloseSharp className="text-black" /> : <IoMenuSharp />}
          </div>
        </div>
        <ul className="md:flex hidden items-center gap-8">
          <li>
            <Link href="/" className={cn(pathname === "/" ? "underline" : "", "py-7 font-bold px-3 mr-6 hover:text-[#317ACC] inline-block")}>
              Home
            </Link>
            <Link href="/courses" className={(pathname === "/courses" ? "underline" : "", "py-7 font-bold px-3 hover:text-[#317ACC] inline-block")}>
              Courses
            </Link>
          </li>
          <NavLinks toggleOpen={toggleOpen} />
          <Link href="/articles" className={(pathname === "/articles" ? "underline" : "", "py-7 font-bold px-3 hover:text-[#317ACC] inline-block")}>
            Blog
          </Link>
        </ul>
        <div className="md:block hidden">
          <Link href={'/contact-us'} onClick={toggleOpen} className='bg-[#317ACC] hover:bg-[#296494] text-white font-bold py-2 px-6 rounded-md'>
            Contact Us
          </Link>
        </div>

        {/* Mobile nav  */}
        <div className={`
            md:hidden bg-white absolute w-full bottom-0 overflow-y-scroll h-full py-24 pl-0
            duration-500 ${open ? "left-0" : "left-[-100%]"}
          `}>
          <div className="flex flex-col bg-white text-black w-full bottom-0 fixed top-10 py-10 px-10">
            <Link href="/" className="py-7 inline-block font-bold" onClick={toggleOpen}>
              Home
            </Link>
            <NavLinks toggleOpen={toggleOpen} />
            <Link href="/courses" className="py-7 inline-block font-bold" onClick={toggleOpen}>
              Courses
            </Link>
            <Link href="/articles" className="py-7 inline-block font-bold" onClick={toggleOpen}>
              Blog
            </Link>
            <div className="py-5">
              <Link href={'/contact-us'} onClick={toggleOpen} className='bg-[#317ACC] hover:bg-[#296494] text-white font-bold py-2 px-6 rounded-md'>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar