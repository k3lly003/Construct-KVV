"use client";
import SerComp from "@/app/(components)/sections/SerComp";
import Button from "../../(components)/Button";
import { Heart } from "lucide-react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <>
      <div className="bg-white overflow-hidden w-72 m-4">
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3"
            alt="JBL Tune 600BTNC"
            width={100}
            height={100}
            className="w-full h-56 object-cover rounded-xl"
          />
          <div className="absolute top-2 right-2 border rounded-full p-3 flex items-center justify-center cursor-pointer shadow-sm hover:bg-yellow-400 hover:border-yellow-400 transition-colors">
            <Heart className="text-white" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              JBL TUNE 600BTNC
            </h3>
            <p className="font-semibold text-lg text-yellow-400">
              {50000}
              <span className="text-sm text-yellow-400"> Rwf</span>
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Premium Bone Conduction Open Ear Bluetooth
          </p>
          <div className="flex items-center justify-between mb-3">
            <div className="text-green-500 text-sm">⭐ 3.5</div>
          </div>
          <Button
            text={"Add to cart"}
            texSize={"text-sm"}
            hoverBg={"hover:bg-yellow-400"}
            borderCol={"border-yellow-300"}
            bgCol={"white"}
            textCol={"text-gray-800"}
            border={"border-1"}
            handleButton={function (): void {
              alert("Add to Cart clicked for JBL TUNE 600BTNC");
            }}
            padding={"p-3"}
            round={"rounded-full"}
          />
        </div>
      </div>
      <SerComp />
    </>
  );
};

export default page;
