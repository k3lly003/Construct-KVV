// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import Link from "next/link";
// import { useState, useEffect } from "react";

// // ... (keep your existing props interface)

// export function SignupCard({
//   companyName = "E KAY Ltd",
//   // ... (keep other default props)
// }: SignupCardProps) {
//   const [isMounted, setIsMounted] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [passwordError, setPasswordError] = useState("");

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       setPasswordError("Passwords don't match");
//       return;
//     }
    
//     if (!agreeTerms) {
//       setPasswordError("You must agree to the terms");
//       return;
//     }
    
//     setPasswordError("");
//     onSubmit?.(name, email, password);
//   };

//   if (!isMounted) {
//     // Return a simple loading state or null during SSR
//     return (
//       <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">{companyName}</h1>
//           <h2 className="text-xl mt-4 mb-2 text-gray-800">{welcomeText}</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       {/* ... (rest of your existing component JSX) */}
//     </div>
//   );
// }

// // ... (keep your icon components)