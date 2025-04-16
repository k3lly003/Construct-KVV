import { CartItem } from "@/app/(components)/product/Cart";

export const initialCartItems: CartItem[] = [
  {
    id: 'prod-101',
    name: 'Premium Portland Cement (50kg)',
    price: 12.99,
    quantity: 4,
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3',
    category: 'building-materials',
    weight: 50,
    dimensions: '50×30×15 cm'
  },
  {
    id: 'prod-102',
    name: 'DeWalt 20V MAX Cordless Drill Kit',
    price: 189.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407',
    category: 'tools',
    weight: 3.4,
    dimensions: '32×28×11 cm'
  },
  {
    id: 'prod-103',
    name: 'Hard Hat with Face Shield',
    price: 34.95,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1578874691223-64558a3ca096',
    category: 'safety-gear',
    weight: 0.6
  },
  {
    id: 'prod-104',
    name: 'Pressure-Treated 2×4 Lumber (8ft)',
    price: 8.49,
    quantity: 12,
    image: 'https://images.unsplash.com/photo-1591382386627-349b692688ff',
    category: 'building-materials',
    dimensions: '244×9×4 cm',
    weight: 14.5
  },
  {
    id: 'prod-105',
    name: 'Steel Claw Hammer (16oz)',
    price: 14.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1584735422189-b4f71b72c0b7',
    category: 'hardware',
    weight: 0.45
  },
  {
    id: 'prod-106',
    name: '4x8ft Drywall Sheet',
    price: 15.99,
    quantity: 5,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115',
    category: 'building-materials',
    weight: 25,
    dimensions: '244×122×1.3 cm'
  },
  {
    id: 'prod-107',
    name: 'Heavy-Duty Wheelbarrow',
    price: 129.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267',
    category: 'tools',
    weight: 14.5
  },
  {
    id: 'prod-108',
    name: 'Safety Goggles (Pack of 3)',
    price: 12.50,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646',
    category: 'safety-gear',
    weight: 14.5
  },
  {
    id: 'prod-109',
    name: 'Galvanized Steel Nails (5lb Box)',
    price: 18.75,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509',
    category: 'hardware',
    weight: 2.3
  },
];