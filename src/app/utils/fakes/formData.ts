export type HouseStyle =
  | "modern"
  | "traditional"
  | "contemporary"
  | "minimalist"
  | "industrial"
  | "farmhouse"
  | "mediterranean"
  | "colonial";

export type RoofStyle =
  | "flat"
  | "gable"
  | "hip"
  | "mansard"
  | "gambrel"
  | "shed";

export type ExteriorMaterial =
  | "brick"
  | "wood"
  | "stone"
  | "stucco"
  | "vinyl"
  | "fiber_cement"
  | "metal";

export type ColorPalette =
  | "neutral"
  | "warm"
  | "cool"
  | "earthy"
  | "vibrant"
  | "monochrome"
  | "custom";

export type LandscapeStyle =
  | "minimal"
  | "tropical"
  | "english_garden"
  | "desert"
  | "japanese"
  | "modern"
  | "rustic";

export type FormData = {
  // Step 1: Basic Info
  projectType: string;
  squareFootage: number;
  stories: number;
  bedrooms: number;
  bathrooms: number;
  recommendations: string[];
  confidences: string;

  // API Response from step 1
  apiResponse?: {
    description?: string;
    estimatedCost?: number;
    features?: Array<{ name: string; count: number }>;
    confidence?: string;
    id?: string;
    suggestions?: Array<{
      id: string;
      estimatedCost?: number;
      description?: string;
    }>;
    [key: string]: unknown;
  };

  // Step 2: Exterior
  houseStyle: HouseStyle;
  roofStyle: RoofStyle;
  exteriorMaterial: ExteriorMaterial;
  colorPalette: ColorPalette;
  hasGarage: boolean;
  garageSize?: number;

  // Step 3: Interior
  openFloorPlan: boolean;
  kitchenStyle: string;
  hasBasement: boolean;
  hasHomeOffice: boolean;
  specialRooms: string[];

  // Step 4: Outdoor
  landscapeStyle: LandscapeStyle;
  hasDeck: boolean;
  hasPool: boolean;
  hasOutdoorKitchen: boolean;
  outdoorNotes?: string;

  // Step 5: Preferences
  inspirationImages: string[];
  specificRequirements: string;
  budget: string;
  timeline: string;
  houseSummary?: {
    sections: Array<{ title: string; content: string }>;
    timeline: string;
    fullDescription: string;
  };

  // Contact info
  name: string;
  email: string;
  phone: string;
};

export const initialFormData: FormData = {
  // Step 1: Basic Info
  projectType: "residential",
  squareFootage: 2000,
  stories: 2,
  bedrooms: 3,
  bathrooms: 2,
  recommendations: [],
  confidences: "", 

  // Step 2: Exterior
  houseStyle: "modern",
  roofStyle: "flat",
  exteriorMaterial: "brick",
  colorPalette: "neutral",
  hasGarage: true,
  garageSize: 2,

  // Step 3: Interior
  openFloorPlan: true,
  kitchenStyle: "modern",
  hasBasement: false,
  hasHomeOffice: true,
  specialRooms: [],

  // Step 4: Outdoor
  landscapeStyle: "minimal",
  hasDeck: true,
  hasPool: false,
  hasOutdoorKitchen: false,
  outdoorNotes: "",

  // Step 5: Preferences
  inspirationImages: [],
  specificRequirements: "",
  budget: "",
  timeline: "",

  // Contact info
  name: "",
  email: "",
  phone: "",
};

export const houseStyleOptions = [
  {
    id: "modern",
    src: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    alt: "Modern house with clean lines and large windows",
    label: "Modern",
  },
  {
    id: "traditional",
    src: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
    alt: "Traditional house with classic design elements",
    label: "Traditional",
  },
  {
    id: "contemporary",
    src: "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg",
    alt: "Contemporary house with innovative design",
    label: "Contemporary",
  },
  {
    id: "minimalist",
    src: "https://images.pexels.com/photos/2287310/pexels-photo-2287310.jpeg",
    alt: "Minimalist house with simple design",
    label: "Minimalist",
  },
  {
    id: "industrial",
    src: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg",
    alt: "Industrial style house with exposed materials",
    label: "Industrial",
  },
  {
    id: "farmhouse",
    src: "https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg",
    alt: "Farmhouse style with rustic charm",
    label: "Farmhouse",
  },
  {
    id: "mediterranean",
    src: "https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg",
    alt: "Mediterranean style with terracotta and stucco",
    label: "Mediterranean",
  },
  {
    id: "colonial",
    src: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    alt: "Colonial style with symmetrical facade",
    label: "Colonial",
  },
];

export const roofStyleOptions = [
  {
    id: "flat",
    src: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg",
    alt: "House with flat roof",
    label: "Flat Roof",
  },
  {
    id: "gable",
    src: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg",
    alt: "House with gable roof",
    label: "Gable Roof",
  },
  {
    id: "hip",
    src: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg",
    alt: "House with hip roof",
    label: "Hip Roof",
  },
  {
    id: "mansard",
    src: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
    alt: "House with mansard roof",
    label: "Mansard Roof",
  },
  {
    id: "gambrel",
    src: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
    alt: "House with gambrel roof",
    label: "Gambrel Roof",
  },
  {
    id: "shed",
    src: "https://images.pexels.com/photos/2098405/pexels-photo-2098405.jpeg",
    alt: "House with shed roof",
    label: "Shed Roof",
  },
];

export const exteriorMaterialOptions = [
  {
    id: "brick",
    src: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
    alt: "House with brick exterior",
    label: "Brick",
  },
  {
    id: "wood",
    src: "https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg",
    alt: "House with wood siding",
    label: "Wood",
  },
  {
    id: "stone",
    src: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
    alt: "House with stone exterior",
    label: "Stone",
  },
  {
    id: "stucco",
    src: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg",
    alt: "House with stucco exterior",
    label: "Stucco",
  },
  {
    id: "vinyl",
    src: "https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg",
    alt: "House with vinyl siding",
    label: "Vinyl",
  },
  {
    id: "fiber_cement",
    src: "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg",
    alt: "House with fiber cement siding",
    label: "Fiber Cement",
  },
  {
    id: "metal",
    src: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg",
    alt: "House with metal exterior",
    label: "Metal",
  },
];

export const landscapeStyleOptions = [
  {
    id: "minimal",
    src: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg",
    alt: "Minimalist landscape design",
    label: "Minimal",
  },
  {
    id: "tropical",
    src: "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg",
    alt: "Tropical landscape with palm trees",
    label: "Tropical",
  },
  {
    id: "english_garden",
    src: "https://images.pexels.com/photos/1101140/pexels-photo-1101140.jpeg",
    alt: "English garden style landscape",
    label: "English Garden",
  },
  {
    id: "desert",
    src: "https://images.pexels.com/photos/3876417/pexels-photo-3876417.jpeg",
    alt: "Desert landscape with cacti",
    label: "Desert",
  },
  {
    id: "japanese",
    src: "https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg",
    alt: "Japanese garden style",
    label: "Japanese",
  },
  {
    id: "modern",
    src: "https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg",
    alt: "Modern landscape design",
    label: "Modern",
  },
  {
    id: "rustic",
    src: "https://images.pexels.com/photos/463734/pexels-photo-463734.jpeg",
    alt: "Rustic landscape design",
    label: "Rustic",
  },
];
