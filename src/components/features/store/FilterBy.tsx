import Image from "next/image";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { DropdownMenuDemo } from "@/app/(components)/shad/DropdownMenuDemo";


interface Product {
  name: string;
  imageSrc: string;
  altText: string;
  rating: string;
  originalPrice: number;
  discountedPrice: number;
}

interface Product {
  name: string;
  imageSrc: string;
  altText: string;
  rating: string;
  originalPrice: number;
  discountedPrice: number;
}

interface Service{
  name: string;
  imageSrc: string;
  altText: string;
  rating: string;
  price: number;
}

const productData: Product[] = [
  {
    name: "Constructor gloves",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Metal Cutter",
    imageSrc:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
    altText: "Black cable Restorer",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Multitool Gerber",
    imageSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Constructor Rain Jacket",
    imageSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder Drill",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "National Nail Camo",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Yellow Hammer Drill",
    imageSrc:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
    altText: "Black cable Restorer",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Kozo Constructor Jacket",
    imageSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Smart  Jig Saw",
    imageSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder Drill",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Constructor Jacket",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Black cable Restorer",
    imageSrc:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
    altText: "Black cable Restorer",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Black Die Grinder",
    imageSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Large Jig Saw",
    imageSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder Drill",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Yellow Hammer",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Restorer",
    imageSrc:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
    altText: "Black cable Restorer",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Black shirt",
    imageSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
  {
    name: "Boots 012",
    imageSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder Drill",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
  },
];

export const serviceData: Service[] = [
  {
    name: "Constructor gloves",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    price: 56000,
  },
  {
    name: "Constructor gloves",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    price: 56000,
  },
  {
    name: "Constructor gloves",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    price: 56000,
  },
  {
    name: "Constructor gloves",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    price: 56000,
  },
  {
    name: "Constructor gloves",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    price: 56000,
  },
  {
    name: "Constructor gloves",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    price: 56000,
  },
  {
    name: "Constructor gloves",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    price: 56000,
  },
];

export const FilterBy: React.FC = () => {

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-mid font-medium text-gray-900 mb-6 flex justify-between">
          <DropdownMenuDemo Prod='product' Serv='service'/>
          <div className="border-gray-200 border rounded-md flex">
            <input type="text" className="hover:border-0" />
            <Search className="flex self-center" />
          </div>
        </div>
        <div className="flex gap-10 my-10">
          <div className="bg-gray-200 text-white font-medium p-2 rounded-2xl">Plumbling</div>
          <div className="bg-gray-200 text-white font-medium p-2 rounded-2xl">Electricity</div>
          <div className="bg-gray-200 text-white font-medium p-2 rounded-2xl">Accessories</div>
          <div className="bg-gray-200 text-white font-medium p-2 rounded-2xl">Clothes</div>
          <div className="bg-gray-200 text-white font-medium p-2 rounded-2xl">Construction</div>
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
                  alt={product.altText}
                  layout="responsive"
                  width={300}
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="p-4 h-30 flex flex-col gap-3">
                <h3 className="text-small font-medium text-gray-900">
                  <a href="#">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <div className="mt-1 flex items-center">
                  <FaStar className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <p className="ml-1 text-small text-gray-500">{product.rating}</p>
                </div>
                <div className="mt-2 flex items-baseline">
                  <p className="font-semibold text-gray-900">
                    RwF {product.discountedPrice.toLocaleString()}
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
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
