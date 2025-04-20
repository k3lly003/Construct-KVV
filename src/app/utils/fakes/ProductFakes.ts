import jacket01 from "../../../../public/jacket01.webp"
import jacket02 from "../../../../public/jacket02.webp"
import jacket03 from "../../../../public/jacket03.webp"
import jacket04 from "../../../../public/jacket04.webp"
//users
import user1 from "../../../../public/user1.jpeg"
import user2 from "../../../../public/user2.jpeg"
import user3 from "../../../../public/user3.jpeg"
import user4 from "../../../../public/user4.jpeg"
import { StaticImageData } from 'next/image';

// utils/fakes/fakeProductData.ts
export interface ReviewType {
  id?: string;
  image: StaticImageData;
  rating: number;
  comment: string;
  user: string;
}

export interface ProductCardType {
  id: string;
  productThumbnail: StaticImageData;
  productDescription: string;
  reviews: ReviewType[];
  imageSrc: StaticImageData[];
  altText: string;
  productName: string;
  productPrice: number;
  discountedPrice: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  originalPrice: number;
  discountedPrice?: number;
  altText?: string;
  stock: number;
  imageSrc: string;
  rating: string;
  reviews: number;
  description: string;
  features: string[];
}

export const fakeProductCards: ProductCardType[] = [
  {
    id: '1',
    productName: 'Wireless Noise-Canceling Headphones',
    productDescription: 'Premium sound with active noise cancellation',
    productPrice: 65000,
    discountedPrice: 55000,
    imageSrc: [jacket02, jacket03, jacket04],
    altText: 'Wireless headphones',
    productThumbnail: jacket01,
    reviews: [
      {
        id: 'rev1',
        image: user1,
        rating: 4,
        comment: 'Great noise cancellation',
        user: 'John D.'
      },
      {
        id: 'rev2',
        image: user2,
        rating: 5,
        comment: 'Excellent battery life',
        user: 'Sarah M.'
      }
    ]
  },
  {
    id: '2',
    productName: 'Smart Fitness Band',
    productDescription: 'Track your workouts and health metrics',
    productPrice: 35000,
    discountedPrice: 29900,
    imageSrc: [jacket02, jacket03, jacket04],
    altText: 'Fitness band',
    productThumbnail: jacket01,
    reviews: [
      {
        id: 'rev3',
        image: user3,
        rating: 4,
        comment: 'Accurate heart rate monitoring',
        user: 'Mike T.'
      }
    ]
  },
  {
    id: '3',
    productName: 'Bluetooth Portable Speaker',
    productDescription: '360° surround sound with deep bass',
    productPrice: 45000,
    discountedPrice: 39900,
    imageSrc: [jacket02, jacket03, jacket04],
    altText: 'Portable speaker',
    productThumbnail: jacket01,
    reviews: [
      {
        id: 'rev4',
        image: user4,
        rating: 5,
        comment: 'Amazing sound quality',
        user: 'Lisa K.'
      },
      {
        id: 'rev5',
        image: user1,
        rating: 3,
        comment: 'Battery could be better',
        user: 'David P.'
      }
    ]
  },
  {
    id: '4',
    productName: 'Wireless Charging Stand',
    productDescription: 'Fast charging for multiple devices',
    productPrice: 30000,
    discountedPrice: 25000,
    imageSrc: [jacket02, jacket03, jacket04],
    altText: 'Wireless charger',
    productThumbnail: jacket01,
    reviews: []
  }
];

export interface DealProduct {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  minOrder: number;
  description?: string;
  unit: string;
  image: string;
  marketPrice: number;
  availability: "In Stock" | "Made to Order" | "Limited Stock";
  leadTime: string;
  features: string[];
  certifications: string[];
}

export const singleDealProduct = {
  id: "single-product-1",
  name: "Victoria Waterproof Laminate Flooring",
  productThumbnail: jacket01,
  imageSrc: [jacket02, jacket03, jacket04],
  availability: "In Stock",
  basePrice: 2000,
  unit: "sq ft",
  description:
    "Experience the beauty and durability of Victoria Waterproof Laminate Flooring. Perfect for any room in your home, this Sea Salt style offers a light and airy feel while providing superior water resistance. Easy to install and maintain, it's a smart choice for busy households.",
  minOrder: 100,
  leadTime: "1-2 business days",
  features: ["Waterproof", "Scratch-resistant", "Easy to install"],
  certifications: ["FloorScore Certified"],
  saleInfo: {
    onSale: true,
    originalPrice: 5190,
    discountPercentage: 42,
    offerEnds: "May 12, 2025",
  },
  selectedStyle: "Sea Salt",
  availableStyles: ["Sea Salt", "Coastal Oak", "Silver Birch"],
  altText: "Victoria Waterproof Laminate Flooring",
};

export type SingleDealProduct = typeof singleDealProduct;

export const sampleProducts: DealProduct[] = [
  {
    id: '1',
    name: 'Premium Structural Steel Beams',
    category: 'Building Materials',
    basePrice: 7500,
    minOrder: 50,
    description:
      'Our Premium Structural Steel Beams are engineered for robust and lasting construction. Manufactured to Grade A36/SS400 standards, these hot-rolled H-beams are available in lengths from 6 to 12 meters, providing versatile solutions for various structural applications. Certified with ISO 9001:2015, CE, and ASTM compliance, they ensure reliability and adherence to international quality benchmarks.',
    unit: 'tons',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80',
    marketPrice: 920,
    availability: 'Made to Order',
    leadTime: '15-20 days',
    features: ['Grade: A36/SS400', 'Length: 6-12m', 'Surface: Hot Rolled', 'Type: H-Beam'],
    certifications: ['ISO 9001:2015', 'CE Certified', 'ASTM Compliant'],
  },
  {
    id: '2',
    name: 'Bulk Construction Cement',
    category: 'Building Materials',
    basePrice: 5000,
    minOrder: 100,
    description:
      'This Bulk Construction Cement is a Portland Type, Grade 43 cement ideal for a wide range of building projects. It features a standard setting time and is supplied in durable 50kg packaging. Holding BIS certification and compliant with EN 197-1 standards, this cement guarantees quality and performance for your construction needs.',
    unit: 'bags',
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80',
    marketPrice: 145,
    availability: 'In Stock',
    leadTime: '2-5 days',
    features: ['Type: Portland', 'Grade: 43', 'Setting Time: Standard', 'Packaging: 50kg'],
    certifications: ['BIS Certified', 'EN 197-1 Compliant'],
  },
  {
    id: '3',
    name: 'Industrial Concrete Mixer',
    category: 'Equipment',
    basePrice: 3200,
    minOrder: 1,
    description:
      'The Industrial Concrete Mixer is a robust and mobile unit designed for efficient concrete preparation on construction sites. With a 350L capacity and powered by a 2.2kW motor, it operates at a drum speed of 22rpm. This mixer is CE certified and manufactured under ISO 9001:2015 quality management, ensuring durability and reliable performance.',
    unit: 'units',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80',
    marketPrice: 3500,
    availability: 'Limited Stock',
    leadTime: '7-10 days',
    features: ['Capacity: 350L', 'Power: 2.2kW', 'Drum Speed: 22rpm', 'Mobile Type'],
    certifications: ['CE Certified', 'ISO 9001:2015'],
  },
  {
    id: '4',
    name: 'Heavy-Duty Scaffolding System',
    category: 'Equipment',
    basePrice: 10000,
    minOrder: 20,
    description:
      'Our Heavy-Duty Scaffolding System provides a safe and sturdy platform for construction work. Each set reaches a height of 2 meters and can support loads up to 450kg. Constructed from galvanized steel for enhanced durability and corrosion resistance, the system is designed for easy assembly. It complies with EN 12810-1 standards and is manufactured under ISO 9001:2015 certification.',
    unit: 'sets',
    image: 'https://images.unsplash.com/photo-1590644178374-fb40b06b2481?auto=format&fit=crop&q=80',
    marketPrice: 520,
    availability: 'In Stock',
    leadTime: '3-5 days',
    features: ['Height: 2m', 'Load Capacity: 450kg', 'Material: Galvanized Steel', 'Easy Assembly'],
    certifications: ['EN 12810-1', 'ISO 9001:2015'],
  },
  {
    id: '5',
    name: 'Reinforcement Steel Bars',
    category: 'Building Materials',
    basePrice: 6800,
    minOrder: 30,
    description:
      'These Reinforcement Steel Bars (Rebar) are crucial for strengthening concrete structures. Manufactured to Grade Fe500, they come in diameters ranging from 8 to 32mm and a standard length of 12 meters. The ribbed surface ensures excellent bonding with concrete. These steel bars are certified according to IS 1786:2008 and ISO 9001:2015 standards, guaranteeing high tensile strength and quality.',
    unit: 'tons',
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80',
    marketPrice: 750,
    availability: 'In Stock',
    leadTime: '5-7 days',
    features: ['Grade: Fe500', 'Diameter: 8-32mm', 'Length: 12m', 'Ribbed Surface'],
    certifications: ['IS 1786:2008', 'ISO 9001:2015'],
  },
  {
    id: '6',
    name: 'Industrial Generator Set',
    category: 'Equipment',
    basePrice: 8500,
    minOrder: 1,
    description:
      'The Industrial Generator Set is a reliable power solution for various industrial and commercial applications. With a power output of 100kVA and operating at 415V and 50Hz, this diesel-powered generator ensures a stable power supply. It is manufactured in compliance with ISO 8528 and CE certifications, assuring performance and safety.',
    unit: 'units',
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80',
    marketPrice: 9200,
    availability: 'Made to Order',
    leadTime: '20-25 days',
    features: ['Power: 100kVA', 'Voltage: 415V', 'Frequency: 50Hz', 'Diesel Powered'],
    certifications: ['ISO 8528', 'CE Certified'],
  },
];

export const categories = [
  'All Products',
  'Building Materials',
  'Equipment',
  'Safety Gear',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Finishing Materials'
];


export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Premium Portland Cement",
    category: "Building Materials",
    originalPrice: 13500,
    stock: 500,
    imageSrc:
      "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80",
    rating: "4.7",
    reviews: 128,
    description:
      "High-quality Portland cement suitable for all construction needs. Meets ASTM C150 standards.",
    features: ["Type I/II", "94 lb bag", "Fast setting", "High strength"],
  },
  {
    id: 2,
    name: "Professional Power Drill",
    category: "Tools & Equipment",
    originalPrice: 19000,
    stock: 50,
    imageSrc:
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80",
    rating: "4.9",
    reviews: 89,
    description:
      "Heavy-duty cordless drill with brushless motor and variable speed control.",
    features: ["20V Max", "2 batteries included", "LED light", '1/2" chuck'],
  },
  {
    id: 3,
    name: "Plumbing Safety Helmet",
    category: "Safety Gear",
    originalPrice: 34000,
    stock: 200,
    imageSrc:
      "https://images.unsplash.com/photo-1578874691223-64558a3ca096?auto=format&fit=crop&q=80",
    rating: "4.8",
    reviews: 156,
    description:
      "Type 1 hard hat with 4-point suspension and comfortable padding.",
    features: [
      "ANSI Z89.1 certified",
      "UV resistant",
      "Adjustable",
      "Ventilated",
    ],
  },
  {
    id: 4,
    name: "Industrial LED Floodlight",
    category: "Electrical",
    originalPrice: 20000,
    stock: 75,
    imageSrc:
      "https://images.unsplash.com/photo-1556132208-beefd277390a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=MwMjA3fDB8MHxzZWFyY2h8Mnx8SW5kdXN0cmlhbCUyMExFRHxlbnwwfHwwfHx8MA%3D%3D",
    rating: "4.6",
    reviews: 42,
    description:
      "High-output LED floodlight perfect for construction sites and outdoor areas.",
    features: [
      "50W",
      "IP65 rated",
      "5000K daylight",
      "Mounting bracket included",
    ],
  },
  {
    id: 5,
    name: "Reinforced Concrete Rebar",
    category: "Building Materials",
    originalPrice: 8000,
    stock: 1000,
    imageSrc:
      "https://images.unsplash.com/photo-1616621859311-19dff47afafc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=MwMjA3fDB8MHxzZWFyY2h8Mnx8UmVpbmZvcmNlZCUyMENvbmNyZXRlJTIwUmViYXJ8ZW58MHx8MHx8fDA%3D",
    rating: "4.5",
    reviews: 67,
    description:
      "High-strength steel rebar for concrete reinforcement. Grade 60.",
    features: [
      "10mm diameter",
      "20 ft length",
      "Corrosion resistant",
      "Meets ASTM A706",
    ],
  },
  {
    id: 6,
    name: "Cordless Circular Saw",
    category: "Tools & Equipment",
    originalPrice: 15500,
    stock: 35,
    imageSrc:
      "https://images.unsplash.com/photo-1657095544219-6328434702a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=MwMjA3fDB8MHxzZWFyY2h8OHx8Q29yZGxlc3MlMjBDaXJjdWxhciUyMFNhd3xlbnwwfHwwfHx8MA%3D%3D",
    rating: "4.7",
    reviews: 51,
    description:
      "Lightweight and powerful cordless circular saw with a 7-1/4 inch blade.",
    features: [
      "18V Lithium-Ion",
      "0-50 degree bevel",
      "Dust port",
      "Blade brake",
    ],
  },
  {
    id: 7,
    name: "Digging Gloves (Pair)",
    category: "Safety Gear",
    originalPrice: 16000,
    stock: 300,
    imageSrc:
      "https://images.unsplash.com/photo-1644308411047-bd8947ec39e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=MwMjA3fDB8MHxzZWFyY2h8MTV8fHdvcmtlciUyMGdsb3Zlc3xlbnwwfHwwfHx8MA%3D%3D",
    rating: "4.6",
    reviews: 92,
    description:
      "Durable leather work gloves with reinforced palms for extra protection.",
    features: [
      "Premium leather",
      "Adjustable wrist strap",
      "Breathable back",
      "Excellent grip",
    ],
  },
  {
    id: 8,
    name: "Electrical Wiring Kit",
    category: "Electrical",
    originalPrice: 4999,
    stock: 60,
    imageSrc:
      "https://images.unsplash.com/photo-1597766380552-36f5c673637a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=MwMjA3fDB8MHxzZWFyY2h8OHx8RWxlY3RyaWNhbCUyMFdpcmluZyUyMEtpdHxlbnwwfHwwfHx8MA%3D%3D",
    rating: "4.4",
    reviews: 38,
    description:
      "Comprehensive kit for basic electrical wiring projects. Includes various wires and connectors.",
    features: [
      "14 and 12 AWG wire",
      "Assorted wire nuts",
      "Electrical tape",
      "Circuit tester",
    ],
  },
  {
    id: 9,
    name: "Insulation Roll (Fiberglass)",
    category: "Building Materials",
    originalPrice: 35000,
    stock: 150,
    imageSrc:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&q=80",
    rating: "4.7",
    reviews: 78,
    description:
      "R-13 fiberglass insulation roll for walls and ceilings. 100 sq ft coverage.",
    features: ["R-value 13", "Unfaced", "Easy to install", "Sound dampening"],
  },
];

export const featuredProductData: Product[] = [
  {
    id: 1,
    name: "Constructor Jacket",
    imageSrc: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80",
    altText: "Constructor Jacket",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
    category: "",
    stock: 0,
    reviews: 0,
    description: "",
    features: []
  },
  {
    id: 2,
    name: "Black cable Restorer",
    imageSrc: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
    altText: "Black cable Restorer",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
    category: "",
    stock: 0,
    reviews: 0,
    description: "",
    features: []
  },
  {
    id: 3,
    name: "Black Die Grinder",
    imageSrc: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
    category: "",
    stock: 0,
    reviews: 0,
    description: "",
    features: []
  },
  {
    id: 4,
    name: "Boots",
    imageSrc: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    altText: "Black Die Grinder Drill",
    rating: "4.5",
    originalPrice: 56000,
    discountedPrice: 19000,
    category: "",
    stock: 0,
    reviews: 0,
    description: "",
    features: []
  },
];


// Helper function to calculate average rating
export const getAverageRating = (reviews: ReviewType[]): string => {
  if (!reviews.length) return 'No reviews';
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return average.toFixed(1);
};