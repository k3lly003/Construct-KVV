import storeImg from "../../../../public/store-img.jpg";
import customerImg from "../../../../public/customer.jpg";
import architectImg from "../../../../public/architect.jpg";
import { StaticImageData } from 'next/image';

interface ProjectItem {
  image: string | StaticImageData;
  name: string;
  description: string;
}

// Usage: Use t(item.titleKey), t(item.descriptionKey), t(item.buttonKey) for i18n
export const projectItems = [
  {
    image: storeImg,
    titleKey: "ProjectShowcase.seller.title",
    descriptionKey: "ProjectShowcase.seller.description",
    buttonKey: "ProjectShowcase.seller.button",
    link: "/register/supplier",
  },
  {
    image: architectImg,
    titleKey: "ProjectShowcase.architect.title",
    descriptionKey: "ProjectShowcase.architect.description",
    buttonKey: "ProjectShowcase.architect.button",
    link: "/register/architect",
  },
  {
    image: customerImg,
    titleKey: "ProjectShowcase.customer.title",
    descriptionKey: "ProjectShowcase.customer.description",
    buttonKey: "ProjectShowcase.customer.button",
    link: "/register/technician",
  },
];

export const projectBudget = {
  total: 50000000, // RWF
  spent: 32500000, // RWF
  currency: "RWF",
};

export const projectMilestones = [
  {
    name: "Foundation",
    status: "Completed",
    progress: 100,
    date: "2024-06-15",
  },
  { name: "Framing", status: "In Progress", progress: 60, date: "2024-07-10" },
  { name: "Roofing", status: "Pending", progress: 0, date: "2024-08-01" },
];

export const projectTimeline = [
  { label: "Start", date: "2024-06-01" },
  { label: "Foundation Complete", date: "2024-06-15" },
  { label: "Framing Complete", date: "2024-07-10" },
  { label: "Estimated Finish", date: "2024-09-30" },
];

export const projectExpenses = [
  {
    amount: 6000000,
    description: "Cement for foundation",
    stage: "Foundation",
  },
  {
    amount: 4500000,
    description: "Steel bars and rebar",
    stage: "Foundation",
  },
  {
    amount: 8000000,
    description: "Lumber and framing labor",
    stage: "Framing",
  },
  {
    amount: 5000000,
    description: "Roof trusses and installation",
    stage: "Roofing",
  },
  {
    amount: 3250000,
    description: "Electrical wiring and panels",
    stage: "Framing",
  },
  {
    amount: 3000000,
    description: "Waterproofing and insulation",
    stage: "Roofing",
  },
];

interface Bid {
  id: string;
  bidderName: string;
  amount: number;
  timeline: number;
  proposal: string;
  submittedOn: string;
  rating: number;
  completedProjects: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Open' | 'Bidding' | 'Closed';
  type: 'Commercial' | 'Residential' | 'Industrial';
  location: string;
  deadline: string;
  budgetMin: number;
  budgetMax: number;
  timeLeft: number;
  bidCount: number;
  isActive: boolean;
  postedBy: string;
  postedOn: string;
  requirements: string[];
  bids: Bid[];
}

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Downtown Office Complex Construction',
    description: 'Construction of a modern 15-story office complex in downtown area. Includes foundation work, structural steel, glass curtain wall, mechanical systems, and interior buildout. LEED Gold certification required.',
    category: 'Commercial Construction',
    status: 'Open',
    type: 'Commercial',
    location: 'Downtown Seattle, WA',
    deadline: 'Dec 15, 2025',
    budgetMin: 2500000,
    budgetMax: 3200000,
    timeLeft: 133,
    bidCount: 4,
    isActive: true,
    postedBy: 'Contractor #contractor_001',
    postedOn: 'August 3, 2025',
    requirements: [
      'LEED Gold certification experience',
      'Commercial construction license',
      'Union labor compliance',
      'Steel frame construction expertise',
      'Timeline: 18 months maximum'
    ],
    bids: [
      {
        id: 'bid_1',
        bidderName: 'Premier Construction LLC',
        amount: 2750000,
        timeline: 16,
        proposal: 'We bring 15+ years of commercial construction experience with a proven track record in LEED Gold certified buildings. Our team has successfully completed 8 similar office complexes in the Seattle area. We propose using advanced steel frame construction techniques with energy-efficient systems throughout.',
        submittedOn: 'August 5, 2025',
        rating: 4.8,
        completedProjects: 47
      },
      {
        id: 'bid_2',
        bidderName: 'Urban Development Corp',
        amount: 2950000,
        timeline: 15,
        proposal: 'Our company specializes in downtown commercial projects with union labor compliance. We have extensive experience with glass curtain wall systems and mechanical installations. Timeline includes buffer for weather delays and permit processing.',
        submittedOn: 'August 7, 2025',
        rating: 4.6,
        completedProjects: 32
      },
      {
        id: 'bid_3',
        bidderName: 'Northwest Builders Inc',
        amount: 2850000,
        timeline: 17,
        proposal: 'We offer competitive pricing with premium quality construction. Our team includes certified LEED professionals and experienced steel frame specialists. We guarantee on-time delivery with comprehensive project management.',
        submittedOn: 'August 8, 2025',
        rating: 4.7,
        completedProjects: 28
      },
      {
        id: 'bid_4',
        bidderName: 'Elite Construction Group',
        amount: 3100000,
        timeline: 14,
        proposal: 'Premium construction services with focus on sustainability and innovation. We use cutting-edge building technologies and maintain the highest safety standards. Our accelerated timeline ensures early project completion.',
        submittedOn: 'August 10, 2025',
        rating: 4.9,
        completedProjects: 52
      }
    ]
  },
  {
    id: '2',
    title: 'Luxury Residential Development - Phase 1',
    description: 'First phase of luxury townhome development featuring 12 units. High-end finishes, custom kitchens, hardwood floors, and energy-efficient systems. Premium location with city views.',
    category: 'Residential Construction',
    status: 'Bidding',
    type: 'Residential',
    location: 'Bellevue, WA',
    deadline: 'Oct 30, 2025',
    budgetMin: 1800000,
    budgetMax: 2400000,
    timeLeft: 87,
    bidCount: 5,
    isActive: true,
    postedBy: 'Developer #dev_002',
    postedOn: 'July 15, 2025',
    requirements: [
      'Residential construction experience',
      'Custom millwork capability',
      'Energy efficiency expertise',
      'Premium finishes experience',
      'Timeline: 12 months maximum'
    ],
    bids: [
      {
        id: 'bid_5',
        bidderName: 'Luxury Homes Seattle',
        amount: 2200000,
        timeline: 11,
        proposal: 'Specializing in high-end residential construction with custom millwork and premium finishes. We have completed over 200 luxury units in the Bellevue area with exceptional attention to detail and energy efficiency.',
        submittedOn: 'July 18, 2025',
        rating: 4.9,
        completedProjects: 89
      },
      {
        id: 'bid_6',
        bidderName: 'Artisan Builders',
        amount: 2350000,
        timeline: 10,
        proposal: 'Award-winning residential construction company known for custom kitchens and hardwood installations. We use sustainable materials and energy-efficient systems in all our projects.',
        submittedOn: 'July 20, 2025',
        rating: 4.8,
        completedProjects: 67
      },
      {
        id: 'bid_7',
        bidderName: 'Pacific Northwest Homes',
        amount: 2100000,
        timeline: 12,
        proposal: 'Cost-effective luxury construction with focus on quality and timeline adherence. We offer comprehensive project management and have strong relationships with premium suppliers.',
        submittedOn: 'July 22, 2025',
        rating: 4.6,
        completedProjects: 43
      },
      {
        id: 'bid_8',
        bidderName: 'Custom Living Solutions',
        amount: 2280000,
        timeline: 11,
        proposal: 'Boutique construction firm specializing in luxury townhomes. We provide personalized service with in-house design team and master craftsmen for all custom work.',
        submittedOn: 'July 25, 2025',
        rating: 4.7,
        completedProjects: 34
      },
      {
        id: 'bid_9',
        bidderName: 'Green Build Residential',
        amount: 2150000,
        timeline: 12,
        proposal: 'Eco-friendly residential construction with emphasis on energy efficiency and sustainable materials. We guarantee ENERGY STAR certification for all units.',
        submittedOn: 'July 28, 2025',
        rating: 4.5,
        completedProjects: 56
      }
    ]
  },
  {
    id: '3',
    title: 'Industrial Warehouse Complex',
    description: 'Construction of a 50,000 sq ft industrial warehouse with loading docks, office space, and advanced security systems. Includes concrete flooring, steel structure, and HVAC systems.',
    category: 'Industrial Construction',
    status: 'Open',
    type: 'Industrial',
    location: 'Tacoma, WA',
    deadline: 'Jan 20, 2026',
    budgetMin: 1200000,
    budgetMax: 1600000,
    timeLeft: 168,
    bidCount: 2,
    isActive: true,
    postedBy: 'Industrial Corp #ind_003',
    postedOn: 'August 1, 2025',
    requirements: [
      'Industrial construction experience',
      'Concrete and steel expertise',
      'Security system installation',
      'Loading dock construction',
      'Timeline: 10 months maximum'
    ],
    bids: [
      {
        id: 'bid_10',
        bidderName: 'Industrial Solutions Inc',
        amount: 1450000,
        timeline: 9,
        proposal: 'Specialized in industrial warehouse construction with expertise in loading dock systems and security installations. We have built over 30 similar facilities in the Pacific Northwest.',
        submittedOn: 'August 4, 2025',
        rating: 4.7,
        completedProjects: 78
      },
      {
        id: 'bid_11',
        bidderName: 'Steel Frame Specialists',
        amount: 1380000,
        timeline: 10,
        proposal: 'Expert steel structure construction with advanced concrete flooring techniques. We offer competitive pricing and have extensive experience with HVAC system integration.',
        submittedOn: 'August 6, 2025',
        rating: 4.6,
        completedProjects: 45
      }
    ]
  },
  {
    id: '4',
    title: 'Medical Center Renovation',
    description: 'Complete renovation of existing medical facility including patient rooms, surgical suites, and diagnostic areas. Requires specialized medical construction knowledge and compliance with healthcare regulations.',
    category: 'Healthcare Construction',
    status: 'Bidding',
    type: 'Commercial',
    location: 'Spokane, WA',
    deadline: 'Nov 15, 2025',
    budgetMin: 3500000,
    budgetMax: 4200000,
    timeLeft: 103,
    bidCount: 3,
    isActive: true,
    postedBy: 'Healthcare Systems #health_004',
    postedOn: 'July 28, 2025',
    requirements: [
      'Healthcare construction certification',
      'Medical equipment installation',
      'Regulatory compliance experience',
      'Infection control protocols',
      'Timeline: 14 months maximum'
    ],
    bids: [
      {
        id: 'bid_12',
        bidderName: 'MedBuild Contractors',
        amount: 3800000,
        timeline: 13,
        proposal: 'Specialized healthcare construction company with 20+ years experience in medical facility renovations. We understand all regulatory requirements and infection control protocols.',
        submittedOn: 'July 30, 2025',
        rating: 4.9,
        completedProjects: 67
      },
      {
        id: 'bid_13',
        bidderName: 'Healthcare Builders LLC',
        amount: 3950000,
        timeline: 12,
        proposal: 'Premier medical construction firm with expertise in surgical suite construction and diagnostic equipment installation. We guarantee compliance with all healthcare regulations.',
        submittedOn: 'August 2, 2025',
        rating: 4.8,
        completedProjects: 54
      },
      {
        id: 'bid_14',
        bidderName: 'Precision Medical Construction',
        amount: 3700000,
        timeline: 14,
        proposal: 'Cost-effective medical construction with focus on patient safety and operational efficiency. We have completed renovations for 15 medical centers in Washington state.',
        submittedOn: 'August 5, 2025',
        rating: 4.7,
        completedProjects: 38
      }
    ]
  },
  {
    id: '5',
    title: 'School Campus Expansion',
    description: 'New classroom building and gymnasium for elementary school. Includes modern learning spaces, cafeteria, library, and playground areas. Must meet educational facility standards.',
    category: 'Educational Construction',
    status: 'Open',
    type: 'Commercial',
    location: 'Olympia, WA',
    deadline: 'Mar 10, 2026',
    budgetMin: 2800000,
    budgetMax: 3400000,
    timeLeft: 217,
    bidCount: 1,
    isActive: true,
    postedBy: 'School District #edu_005',
    postedOn: 'August 8, 2025',
    requirements: [
      'Educational facility experience',
      'Safety compliance certification',
      'Playground construction expertise',
      'ADA compliance knowledge',
      'Timeline: 16 months maximum'
    ],
    bids: [
      {
        id: 'bid_15',
        bidderName: 'Educational Builders Co',
        amount: 3100000,
        timeline: 15,
        proposal: 'Specialized in educational facility construction with expertise in modern learning environments. We have built 25+ schools across Washington with focus on safety and accessibility.',
        submittedOn: 'August 12, 2025',
        rating: 4.8,
        completedProjects: 72
      }
    ]
  },
];