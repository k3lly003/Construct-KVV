import Image from "next/image";
import { ChevronRight, ChevronLeft, Search, Heart } from "lucide-react";
import { DropdownMenuDemo } from "./shad/DropdownMenuDemo";
import Link from "next/link";
import { featuredProductData } from "../utils/fakes/ProductFakes";

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
          {featuredProductData.map((product) => (
            <div
            key={product.id}
            className="bg-white overflow-hidden w-64 m-4 hover:shadow-lg hover:rounded-xl transition-shadow"
        >
            <div className="relative">
                <Image
                    src={product.imageSrc}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-full h-56 object-cover rounded-xl"
                />
                {/* Assuming Heart is a component */}
                <div className="absolute top-2 right-2 border rounded-full p-3 flex items-center justify-center cursor-pointer shadow-sm hover:bg-yellow-400 hover:border-yellow-400 transition-colors">
                    <Heart className="text-gray-100" />
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between">
                    <h3 className="text-md font-semibold text-gray-900 w-[60%] mb-1">
                        {product.name}
                    </h3>
                    <p className="font-semibold text-sm text-yellow-400">
                        {product.discountedPrice ? (
                            <>RWF {product.discountedPrice.toLocaleString()}</>
                        ) : (
                            <>RWF {product.originalPrice.toLocaleString()}</>
                        )}
                    </p>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                    {"Description might not be directly available"}
                </p>
                <div className="flex items-center justify-between mb-3">
                    <div className="text-green-500 text-sm">
                        {/* Assuming Star is a component */}
                        {/* <Star className="h-4 w-4 text-yellow-400 fill-current inline-block mr-1" /> */}
                        ⭐ {product.rating}
                    </div>
                </div>
                {/* Assuming Button is a custom component */}
                {/* <Button
                    text={"Add to cart"}
                    texSize={"text-sm"}
                    hoverBg={"hover:bg-yellow-400"}
                    borderCol={"border-yellow-300"}
                    bgCol={"white"}
                    textCol={"text-gray-800"}
                    border={"border-1"}
                    handleButton={() =>
                        alert(`Add to Cart clicked for ${product.name}`)
                    }
                    padding={"p-3"}
                    round={"rounded-full"}
                /> */}
                <button
                    className="text-sm bg-white text-gray-800 border border-yellow-300 hover:bg-yellow-400 rounded-full p-3 w-full transition-colors"
                    onClick={() => alert(`Add to Cart clicked for ${product.name}`)}
                >
                    Add to cart
                </button>
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
