"use client";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { CartPage } from "@/app/(components)/product/Cart";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import React from "react";
// import EmptyCart from "../../(components)/cart/emptyCart";
// import { emptyCart } from "../../utils/fakes/CartFakes";

const page = () => {
  return (
    <ProtectedRoute>
      <>
        <DefaultPageBanner title="Cart" backgroundImage={"./support.webp"} />
        <main className="container mx-auto py-8">
          <div className="mx-auto">
            <CartPage />
          </div>
        </main>
        {/* <EmptyCart title={emptyCart.title} subTitle={emptyCart.subTitle} picture={emptyCart.picture} btnText={emptyCart.btnText}/> */}
      </>
    </ProtectedRoute>
  );
};

export default page;
