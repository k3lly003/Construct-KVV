// "use client";

// import React from 'react';
// import { fakeProductCards } from '@/app/utils/fakes/ProductFakes';
// import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';
// import Reviews from '@/app/(components)/product/Reviews';
// import RelatedProducts from '@/app/(components)/product/RelatedProducts';
// import ProductView from '@/app/(components)/product/ProductView';

// interface ProductPageProps {
//   params: Promise<{ id: string }>;
// }

// function ProductPage({ params }: ProductPageProps) {
//   const resolvedParams = React.use(params);
//   // Directly find the product from the fake data
//   const product = fakeProductCards.find((item) => item.id === resolvedParams.id) || fakeProductCards[0];
//   const { reviews } = product;

//   return (
//     <div className="w-[100%]">
//       <DefaultPageBanner title="Product View" backgroundImage='/building.jpg' />
//       <div className="max-w-7xl flex flex-col gap-[30px] p-3 sm:w-[60%] m-auto my-10">
//         <ProductView/>
//         <RelatedProducts />
//         {reviews && <Reviews reviews={reviews} />}
//       </div>
//     </div>
//   );
// }

// export default ProductPage;