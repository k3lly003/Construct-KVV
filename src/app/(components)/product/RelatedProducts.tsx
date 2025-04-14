import React from 'react';
import ProductCard from '../ProductCard';
import { fakeProductCards } from '../../utils/fakes/ProductFakes';

const RelatedProducts = () => {
  return (
    <div className="w-[100%] sm:w-[100%] mt-[50px]">
      <h2 className="font-bold text-2xl">Related products:</h2>
      <div className="flex gap-3 mt-5">
        {fakeProductCards.length > 0 ? (
          fakeProductCards.map((product) => (
            <div key={product.id} className="min-w-[250px] flex-shrink-0">
              <ProductCard src={''} {...product} />
            </div>
          ))
        ) : (
          <p className="text-red-500 w-full flex self-center">
            No related products available.
          </p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;