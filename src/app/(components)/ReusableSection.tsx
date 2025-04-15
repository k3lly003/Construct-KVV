// import { ReactNode } from "react";


// interface ReusableSectionProps{
//     children: ReactNode, 
//     background: string, 
//     flexDirection: string, 
//     isTopSection: boolean
// }

// const ReusableSection = ({children, background, flexDirection, isTopSection}: ReusableSectionProps) => {

//     return (
//         <section style={{ flexDirection: flexDirection, background: background }} className={`flex items-center justify-center mx-auto w-full px-4 md:px-12 ${isTopSection ? "py-4" : "py-20"} md:pb-24 overflow-hidden`}>
//             <div className={`flex flex-col gap-6 items-center justify-center text-white w-full max-w-screen-xl`}>
//                 {children}
//             </div>
//         </section>
//     )
// }

// export default ReusableSection