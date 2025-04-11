"use client"

import Link from 'next/link';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { IoIosCloseCircle } from "react-icons/io";
import { useEffect, useState } from 'react';

export default function PopupModel({ course }) {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowModal(true);
        }, 1000); // Show modal after 3 seconds

        return () => clearTimeout(timer); // Cleanup the timer
    }, []);

    const closeModal = () => {
        setShowModal(false);
    };
    const jssStyles = {
        backgroundImage: `linear-gradient(to bottom, rgb(0, 61, 102, 1), rgb(0, 138, 230, 0.6)), url(${course.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.3s ease-in-out',
        willChange: 'background-image',
    };

    return (
        <>
            {showModal &&
                <div className={'flex fixed left-0 top-0 w-full h-full z-50 overflow-auto bg-black bg-opacity-60 justify-center items-center'}>
                    <div style={jssStyles} className={"bg-[#fefefe] px-2 pb-2 gap-8 md:px-5 md:pb-5 border border-sky-500 w-full md:w-4/5 max-w-screen-md text-center"}>
                        <button
                            className={'text-slate-200 float-right text-3xl font-bold hover:text-white focus:text-white hover:cursor-pointer focus:cursor-pointer mb-4'}
                            onClick={closeModal}>
                            <IoIosCloseCircle />
                        </button>
                        <div className='flex flex-col gap-4 text-white w-full'>
                            <div className='flex justify-end'>
                                <Image src={'/logoscc.png'} alt='logo' className='bg-white p-2' height={80} width={80} />
                            </div>
                            <div className='flex gap-4 justify-start'>
                                <div className='flex flex-col gap-2 justify-start'>
                                    <h2 className="font-bold text-7xl md:text-9xl text-orange-200">{course.duration}</h2>
                                    <span className='text-orange-200 text-xl'>{course.durationType}</span>
                                </div>
                                <div className='flex flex-col justify-start gap-2 mb-8 items-start'>
                                    <h3 className='font-extrabold text-4xl text-start'>{course.title}</h3>
                                    <h4 className='text-orange-300 text-left text-2xl font-extrabold'>{course.subTitle}</h4>
                                    {/* <p className='text-start text-base'>{textLimiter(course.description, 120)}</p> */}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <Link className='text-start px-3 py-1 bg-white hover:bg-black rounded-md w-fit flex items-center text-base justify-center gap-2 mt-4 text-black font-extrabold hover:text-white cursor-pointer' href={`/courses/${course.slug}`} >
                                <span>More details</span>
                                <ArrowRightIcon width={20} />
                            </Link>
                        </div>
                    </div>
                </div>}
        </>
    );
};