import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-3 w-full z-50 bg-sky-950 h-screen justify-center items-center">
      <Image src="/logo/Logo-SCC.jpg" alt="logo" className="animate-pulse" width={80} height={80} />
    </div>
  );
}