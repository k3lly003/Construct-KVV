"use client";
import MultiStepForm from "@/components/ui/MultiStepForm";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "What type of kitchen do you want?",
    options: ["Modern", "Classic", "Minimalist", "Industrial"],
  },
  {
    title: "What’s your budget range?",
    options: ["< $5,000", "$5,000 - $10,000", "$10,000 - $20,000", ">$20,000"],
  },
  {
    title: "Preferred colors?",
    options: ["White", "Black", "Wood", "Colorful"],
  },
];

export default function ProMatchPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      <h1 className="text-3xl font-bold mb-8">Find Your Pro Match</h1>
      <MultiStepForm
        steps={steps}
        onComplete={(data) => {
          // You can handle the completed data here (e.g., send to API, show summary, etc.)
          alert("Form completed! Check the console for your answers.");
          console.log("MultiStepForm result:", data);
          // Optionally redirect or show a summary page
        }}
      />
    </div>
  );
}
