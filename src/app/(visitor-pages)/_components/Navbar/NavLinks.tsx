import Link from "next/link";
import { Links } from "./Links";
import { useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

const NavLinks = (props) => {
    const { toggleOpen } = props;
    
    const [heading, setHeading] = useState("");
    const [subHeading, setSubHeading] = useState("");

    return (
        <>
            {
                Links.map((link, index) => (
                    <div key={index}>
                        {/* Desktop menu  */}
                        <div className=" text-left md:cursor-pointer group">
                            <h1
                                className="py-7 flex justify-between items-center md:pr-0 pr-5 group hover:text-[#317ACC] font-bold"
                                onClick={() => { heading !== link.name ? setHeading(link.name) : setHeading('') }}
                            >
                                {link.name}
                                <span className="text-xl md:mt-1 md:hidden inline">
                                    {heading === link.name ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                </span>
                                <span className="text-xl md:mt-1 md:ml-2 md:block hidden group-hover:rotate-180">
                                    <MdKeyboardArrowDown />
                                </span>
                            </h1>
                            {link.submenu && (
                                <div>
                                    <div className="absolute top-20 hidden group-hover:md:block hover:md:block">
                                        <div className="py-3">
                                            <div className="w-4 h-4 left-3 absolute mt-1 bg-white border-l border-t rotate-45"></div>
                                        </div>
                                        <div className="bg-white p-3.5 flex gap-10 rounded-sm border">
                                            {link.sublinks.map((sublink, index) => (
                                                <div key={index}>
                                                    <h1 className="text-lg font-bold text-[#317ACC]">{sublink.Head}</h1>
                                                    <div>
                                                        {sublink.sublink.map((subsublink, subsubIndex) => (
                                                            <li key={subsubIndex} className="text-base text-gray-600 my-2.5">
                                                                <Link
                                                                    href={subsublink.link}
                                                                    className="hover:text-blue-700"
                                                                    onClick={toggleOpen}
                                                                >
                                                                    {subsublink.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu  */}
                        <div className={`${heading === link.name ? 'md:hidden' : 'hidden'}`}>
                            {/* Sublinks  */}
                            {link.sublinks && link.sublinks.map((slinks, index) => (
                                <div key={index}>
                                    <div>
                                        <h1
                                            onClick={() => { subHeading !== slinks.Head ? setSubHeading(slinks.Head) : setSubHeading("") }}
                                            className="py-4 pl-7 font-semibold md:pr-0 pr-5 flex justify-between items-center"
                                        >
                                            {slinks.Head}
                                            <span className="text-xl md:mt-1 md:ml-2 inline">
                                                {setHeading === slinks.name ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                            </span>
                                        </h1>
                                        <div className={`${subHeading === slinks.Head ? "md:hidden" : "hidden"}`}>
                                            {slinks.sublink.map((slinks, index) => (
                                                <li key={index} className="py-3 pl-14">
                                                    <Link
                                                        href={slinks.link}
                                                        className="hover:text-blue-700"
                                                        onClick={toggleOpen}
                                                    >
                                                        {slinks.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default NavLinks