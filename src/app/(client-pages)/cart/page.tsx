import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { CartPage } from "../../(components)/product/Cart";
import React from "react";

const page = () => {
  return (
    <>
      <DefaultPageBanner title="Cart" backgroundImage={""} />
      <main className="container mx-auto py-8">
        <div className="mx-auto">
          <CartPage />
        </div>
      </main>
    </>
  );
};

export default page;
