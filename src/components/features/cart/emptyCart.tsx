"use client";

import Image from "next/image";
import React from "react";
import { EmptyCartProps } from "@/app/utils/dtos/cart.dtos";
import { Button } from "@/app/(components)/Button";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const EmptyCart: React.FC<EmptyCartProps> = ({
  btnText,
  title,
  subTitle,
  picture,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const storePageUrl = "/store";

  const goToStore = () => {
    router.push(storePageUrl);
  };

  return (
    <div className="relative flex flex-col items-center  min-h-screen py-50 bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 z-10">
        <Image
          src={picture}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-90" // Adjust opacity and blur as needed
        />
      </div>
      <h2 className="text-xl text-gray-500 mb-2 relative z-20">{t('cart.empty')}</h2>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 relative z-20">
        {t('cart.emptySubtitle')}
      </h1>
      <div className="z-20">
        <Button
          text={t('cart.continueShopping')}
          texSize={""}
          hoverBg={"hover:bg-gray-500"}
          borderCol={""}
          bgCol={"bg-gray-700"}
          textCol={"text-white"}
          border={"border-0"}
          padding={"px-6 py-3"}
          round={"rounded-md"}
          handleButton={goToStore}
        />
      </div>
    </div>
  );
};

export default EmptyCart;
