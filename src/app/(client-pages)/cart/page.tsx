import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { CartPage } from "../../(components)/product/Cart";
import React from "react";
// import EmptyCart from "../../(components)/cart/emptyCart";
// import { emptyCart } from "../../utils/fakes/CartFakes";

const page = () => {
  return (
    <>
      <DefaultPageBanner title="Cart" backgroundImage={"./support.webp"}/>
      <main className="container mx-auto py-8">
        <div className="mx-auto">
          <CartPage />
        </div>
      </main>
      {/* <EmptyCart title={emptyCart.title} subTitle={emptyCart.subTitle} picture={emptyCart.picture} btnText={emptyCart.btnText}/> */}
    </>
  );
};

export default page;
