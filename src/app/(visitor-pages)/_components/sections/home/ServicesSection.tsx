// "use client"

// import Image from 'next/image';
// import ReusableSection from '../../ReusableSection';

// const ServicesSection = ({ servicesSectionData }) => {
//     return (
//         <ReusableSection background={'white'}>
//             <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
//                 {/* Image grid */}
//                 <div className=" h-[474px]  md:flex hidden gap-4 flex-col rounded bg-[#6AACE8]/10 items-center relative">
//                     <div className="relative -right-28  -top-7  ">
//                         <Image
//                             src={servicesSectionData.imageOne}
//                             alt="Audience"
//                             width={400}
//                             height={246}
//                             className="rounded-md relative z-10"
//                         />
//                     </div>
//                     <div className="relative  -left-24 -top-7 lg:order-2 lg:ml-6 w-full lg:w-auto">
//                         <Image
//                             src={servicesSectionData.imageTwo}
//                             alt="Laptop and hands"
//                             width={400}
//                             height={246}
//                             className="rounded-md relative z-10"
//                         />
//                     </div>
//                 </div>

//                 {/* Text section */}
//                 <div className="flex flex-col gap-4 w-full md:gap-2 justify-center items-start">
//                     <h2 className="section-header" style={{ textAlign: "left" }}>
//                         {servicesSectionData.sectionTitle}
//                     </h2>
//                     <ul className="flex flex-col gap-3">
//                         {servicesSectionData.items && servicesSectionData.items.map((item, index) => (
//                             <li key={index} className="flex items-center">
//                                 <div className="bg-[#DDFFFF] p-3 hover:bg-blue-100 transition duration-300 rounded-full mr-4">
//                                     <Image
//                                         src={item.icon}
//                                         alt="Computer Icon"
//                                         width={24}
//                                         height={24}
//                                     />
//                                 </div>
//                                 <span className="text-gray-700 w-full text-base md:text-xl font-medium">
//                                     {item.text}
//                                 </span>
//                             </li>))
//                         }
//                     </ul>
//                 </div>
//             </div>
//         </ReusableSection>
//     );
// };

// export default ServicesSection;
