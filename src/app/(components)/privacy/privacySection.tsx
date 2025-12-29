// "use client"

// import Link from 'next/link';
// import { usePathname } from 'next/navigation'
// import ReusableSection from '../ReusableSection';
// import parse from 'html-react-parser';

// export default function PrivacyPolicyInformationSection({PrivacyPolicyPageData}) {
//     const pathname = usePathname();
//     return (
//         <>
//             {/* <ReusableSection> */}
//                 <div className='flex w-full flex-wrap justify-between'>
//                     <div className="flex-1 w-full md:w-[65%] md:pr-8 text-black">
//                         <h2 className={"text-mid md:text-title font-bold text-[#317ACC] text-left"}>
//                             {PrivacyPolicyPageData?.description}
//                         </h2>
//                         {PrivacyPolicyPageData?.content && <section className='section'>
//                             {parse(PrivacyPolicyPageData?.content)}
//                         </section>}
//                     </div>

//                     {/* Side bar  */}
//                     <div className="w-full md:w-[30%] flex flex-col gap-4 justify-start">
//                         <h3 className={"text-mid md:text-title font-bold text-[#317ACC] text-left px-3 md:px-0"}>Table of content</h3>
//                         <ul className="list-inside mb-6 font text-base md:text-mid text-black">
//                             <li className={`mb-2 ${pathname === "/privacy-policy" ? "text-[#317ACC]" : ""}`}>
//                                 <Link href="/privacy-policy">1. Privacy policy</Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             {/* </ReusableSection> */}
//         </>
//     )
// }