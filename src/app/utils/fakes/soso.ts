import { Service } from "@/types/service";

interface ServiceData {
    id: string;
    title: string;
    category: string;
    provider: {
      name: string;
      avatar: string;
      rating: number;
      reviews: number;
      verified: boolean;
      yearsExperience: number;
    };
    pricing: {
      basePrice: number;
      unit: string;
      estimatedTotal: string;
    };
    location: {
      city: string;
      serviceRadius: string;
    };
    availability: string;
    description: string;
    features: string[];
    specifications: {
      [key: string]: string | number;
    };
    warranty: {
      duration: string;
      coverage: string[];
    };
    gallery: string[];
    reviews: {
      id: string;
      author: string;
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
    }[];
  }
  
  const serviceData: ServiceData = {
    id: "1",
    title: "Premium Laminate Flooring Installation",
    category: "Flooring Services",
    provider: {
      name: "ProFloor Masters",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
      rating: 4.9,
      reviews: 247,
      verified: true,
      yearsExperience: 12
    },
    pricing: {
      basePrice: 8.50,
      unit: "per sq ft",
      estimatedTotal: "$850 - $1,200"
    },
    location: {
      city: "San Francisco, CA",
      serviceRadius: "25 miles"
    },
    availability: "Available this week",
    description: "Transform your space with our premium laminate flooring installation service. We specialize in high-quality AC4 rated laminate flooring that combines durability, style, and affordability. Our certified installers ensure perfect results with lifetime warranty coverage.",
    features: [
      "AC4 Durability Rating - Commercial Grade",
      "Waterproof & Scratch Resistant",
      "Unilin Click Lock System",
      "10mm Total Thickness",
      "Lifetime Residential Warranty",
      "Professional Installation Included",
      "Free Subfloor Preparation",
      "Same-Day Furniture Moving"
    ],
    specifications: {
      "Product Length": "47.8 in",
      "Total Thickness": "10 mm",
      "Underpad Thickness": "2 mm",
      "Width": "7.67 in",
      "AC Durability Rating": "AC4",
      "Click Lock Type": "Unilin Click Lock",
      "Color": "Beige",
      "Edge Type": "Micro Bevel",
      "Gloss Level": "Matte",
      "Grade": "Above/On/Below Grade",
      "Installation": "Floating",
      "Surface Finish": "Embossed in Register (EIR)",
      "Waterproof Rating": "100% Waterproof"
    },
    warranty: {
      duration: "Lifetime Residential",
      coverage: [
        "Manufacturing defects",
        "Wear and tear protection",
        "Water damage coverage",
        "Installation workmanship",
        "Subfloor preparation"
      ]
    },
    gallery: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2"
    ],
    reviews: [
      {
        id: "1",
        author: "Sarah Johnson",
        rating: 5,
        comment: "Exceptional work! The team was professional, punctual, and the flooring looks absolutely stunning. Highly recommend!",
        date: "2 weeks ago",
        verified: true
      },
      {
        id: "2",
        author: "Mike Chen",
        rating: 5,
        comment: "Great value for money. The installation was completed in one day and the quality is outstanding.",
        date: "1 month ago",
        verified: true
      },
      {
        id: "3",
        author: "Emily Rodriguez",
        rating: 4,
        comment: "Very satisfied with the service. Minor delay in scheduling but the end result was worth it.",
        date: "2 months ago",
        verified: true
      }
    ]
  };

  export default serviceData;

  export const mockServices: Service[] = [
    {
      id: "1",
      title: "Home Renovation",
      category: "Renovation",
      description: "Complete home renovation including kitchen and bathroom.",
      availability: "Available",
      features: ["Full interior", "Modern design", "Energy efficient"],
      specifications: [
        { key: "Duration", value: "3 months" },
        { key: "Team", value: "5 specialists" }
      ],
      provider: "RenovatePro",
      pricing: "2500",
      location: "Kigali",
      warranty: "2 years",
      gallery: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"],
      createdAt: "2024-05-01"
    },
    {
      id: "2",
      title: "Plumbing Services",
      category: "Plumbing",
      description: "Professional plumbing installation and repair.",
      availability: "Available",
      features: ["Leak repair", "Pipe installation"],
      specifications: [
        { key: "Emergency", value: "Yes" },
        { key: "Coverage", value: "Citywide" }
      ],
      provider: "PlumbRight",
      pricing: "150",
      location: "Kigali",
      warranty: "6 months",
      gallery: ["https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"],
      createdAt: "2024-05-02"
    },
    {
      id: "3",
      title: "Electrical Wiring",
      category: "Electrical",
      description: "Safe and certified electrical wiring for homes and offices.",
      availability: "Available",
      features: ["Certified electricians", "Safety guaranteed"],
      specifications: [
        { key: "Voltage", value: "220V" },
        { key: "Warranty", value: "1 year" }
      ],
      provider: "ElectroSafe",
      pricing: "500",
      location: "Kigali",
      warranty: "1 year",
      gallery: ["https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"],
      createdAt: "2024-05-03"
    },
    // New fake 1
    {
      id: "4",
      title: "Landscaping & Gardening",
      category: "Landscaping",
      description: "Transform your outdoor space with our expert landscaping and gardening services.",
      availability: "Available",
      features: ["Lawn care", "Tree planting", "Garden design"],
      specifications: [
        { key: "Area covered", value: "Up to 500 sqm" },
        { key: "Maintenance", value: "Monthly" }
      ],
      provider: "GreenThumbs",
      pricing: "800",
      location: "Huye",
      warranty: "1 year",
      gallery: ["https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"],
      createdAt: "2024-05-04"
    },
    // New fake 2
    {
      id: "5",
      title: "Painting & Decorating",
      category: "Painting",
      description: "Professional painting and decorating for homes and offices.",
      availability: "Available",
      features: ["Interior painting", "Exterior painting", "Wallpaper installation"],
      specifications: [
        { key: "Paint type", value: "Eco-friendly" },
        { key: "Finish", value: "Matte/Glossy" }
      ],
      provider: "ColorPros",
      pricing: "1200",
      location: "Musanze",
      warranty: "2 years",
      gallery: ["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"],
      createdAt: "2024-05-05"
    },
    // New fake 3
    {
      id: "6",
      title: "Roofing Solutions",
      category: "Roofing",
      description: "Durable and weather-resistant roofing installation and repair.",
      availability: "Available",
      features: ["Metal roofing", "Leak repair", "Insulation"],
      specifications: [
        { key: "Material", value: "Steel/Aluminum" },
        { key: "Warranty", value: "10 years" }
      ],
      provider: "RoofMasters",
      pricing: "3500",
      location: "Rubavu",
      warranty: "10 years",
      gallery: ["https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"],
      createdAt: "2024-05-06"
    }
  ];