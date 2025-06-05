import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Button from "../Button";

function SerComp() {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="bg-white overflow-hidden w-72 m-4">
      <div className="relative">
        <Image
          src="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3"
          alt="Waterproof Laminate Flooring"
          width={100}
          height={100}
          className="w-full h-56 object-cover rounded-xl"
        />
        <div className="absolute top-2 right-2 border rounded-full p-3 flex items-center justify-center cursor-pointer shadow-sm hover:bg-yellow-400 hover:border-yellow-400 transition-colors">
          <Heart className="text-white" />
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Waterproof Laminate
          </h3>
          <p className="font-semibold text-lg text-yellow-400">
            {9000}
            <span className="text-sm text-yellow-400"> Rwf</span>
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Waterproof Laminate Flooring Kona Collection
        </p>
        <div className="flex justify-between mb-3">
          <div className="text-green-500 w-[30%] text-sm">⭐ 4.0</div>
          <div className="cursor-pointer rounded-sm bg-gray-200 transition">
            {showDetails ? (
              <ChevronUp
                onClick={toggleDetails}
                className="text-md text-gray-500"
              />
            ) : (
              <ChevronDown
                onClick={toggleDetails}
                className="text-md text-gray-500"
              />
            )}
          </div>
        </div>
        {/* DETAILS DROP DOWN */}
        {showDetails && (
          <div className="mt-2 text-sm text-gray-700">
            <p>Detail 1: This flooring is highly durable.</p>
            <p>Detail 2: Easy to install with click-lock system.</p>
            {/* You can add more details here */}
          </div>
        )}
        <div className="flex justify-between w-full">
          <Button
            text={"Order a sample"}
            texSize={"text-sm"}
            hoverBg={"hover:bg-yellow-500"}
            borderCol={"border-yellow-500"}
            bgCol={"white"}
            textCol={""}
            border={"border-1"}
            handleButton={function (): void {
              alert("Function not implemented.");
            }}
            padding={"p-3"}
            round={"rounded-md"}
          />
          <Button
            text={"Add to cart"}
            texSize={"text-sm"}
            hoverBg={"bg-yellow-500"}
            borderCol={"border-0"}
            bgCol={"bg-amber-400"}
            textCol={"text-white"}
            border={"border-1"}
            handleButton={function (): void {
              alert("Function not implemented.");
            }}
            padding={"p-7"}
            round={"rounded-md"}
          />
        </div>
      </div>
    </div>
  );
}

export default SerComp;
