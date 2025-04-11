"use client";

// import { submitSubscription } from "@/app/(visitor-pages)/_actions/visitor";
// import { useFormState, useFormStatus } from "react-dom";
// import { toast } from "sonner";


// interface SubmitButtonProp{
//     label: string
// }

export default function SubscribeForm() {
    // const [response, action] = useFormState(submitSubscription, {});
    // if (response.error) {
    //     toast.error(response.error);
    // } else if (response.message) {
    //     toast.success(response.message);
    //     setTimeout(() => {
    //         window.location.reload();
    //     }, 2000);
    // }

    // return (
        // <form action={action} className='flex flex-col items-center z-40 justify-between gap-4 w-full md:w-2/5'>
        //     <input type="text" name="fullName" required placeholder="Enter your full name" className='px-3 py-2 rounded-sm w-full' />
        //     {response?.fullName && <p className="text-red-500">{response?.fullName}</p>}
            
        //     <input type="email" name="email" required placeholder="Enter your email address" className='px-3 py-2 rounded-sm w-full' />
        //     {response?.email && <p className="text-red-500">{response?.email}</p>}
        //     <SubmitButton label={"SUBSCRIBE"}/>
        // </form>
    // )
}

// export function SubmitButton({ label }:String) {
//     const { pending } = useFormStatus();
//     return (
//         <button type="submit" disabled={pending} className='px-3 py-2 rounded-sm bg-sky-950 hover:bg-sky-500 text-white font-bold w-full'>
//             {pending ? "Submitting..." : label}
//         </button>
//     )
// }