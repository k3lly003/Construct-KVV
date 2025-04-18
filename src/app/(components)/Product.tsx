import Image from "next/image";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { DropdownMenuDemo } from "./shad/DropdownMenuDemo";
import Link from "next/link";
import { productData } from "../utils/fakes/ProductFakes";

const Products: React.FC = () => {
  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-2xl font-medium text-gray-900 mb-6 flex justify-between">
          <DropdownMenuDemo Prod="product" Serv="service" />
          <div className="border-gray-400 border rounded-md flex">
            <input type="text" className="hover:border-0" />
            <Search className="flex self-center" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productData.map((product) => (
            <div
              key={product.name}
              className="relative hover:shadow-md transition-shadow duration-200 space-y-3 mb-5"
            >
              <div className="aspect-w-1 h-40 w-full overflow-hidden">
                <Image
                  src={product.imageSrc}
                  alt={product.altText? product.altText : ''}
                  layout="responsive"
                  width={300}
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="p-4 h-30 flex flex-col gap-3">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href="#">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <div className="mt-1 flex items-center">
                  <FaStar className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <p className="ml-1 text-sm text-gray-500">{product.rating}</p>
                </div>
                <div className="mt-2 flex items-baseline">
                  <p className="font-semibold text-gray-900">
                    {product.discountedPrice ? (
                      <>RWF {product.discountedPrice.toLocaleString()}</>
                    ) : (
                      <>
                        RWF {product.originalPrice.toLocaleString()}{" "}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION BUTTONS */}
        <div className="mt-6 flex justify-center space-x-2">
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
            <ChevronLeft className="h-5 w-5 text-amber-300" />
          </button>
          <div className="flex justify-center items-center gap-3">
            <Link href={""}>01</Link>
            <Link href={""}>02</Link>
            <Link href={""}>03</Link>
            <Link href={""}>04</Link>
          </div>
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
