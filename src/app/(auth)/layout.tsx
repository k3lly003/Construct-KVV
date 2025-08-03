import type { Metadata } from "next";
import "../globals.css"; // Assuming this is your global CSS

export const metadata: Metadata = {
  title: {
    template: "%s | kvv shop signup",
    default: "kvv shop",
  },
  description: "Welcome to the best construction e-commerce in Rwanda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="">
      <div className="flex flex-col justify-start">{children}</div>
    </main>
  );
}