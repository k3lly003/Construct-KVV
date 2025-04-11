import { useFormStatus } from "react-dom";

export function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className='px-6 py-2 w-fit rounded-sm bg-sky-950 hover:bg-sky-500 text-white font-bold'>
            {pending ? "Submitting..." : "Done"}
        </button>
    )
}