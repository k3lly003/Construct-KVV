export interface NavItem {
  label: string;
  items?: {
    title: string;
    description?: string; // Optional description for the section
    isPopular?: boolean; // Optional popular flag for the section
    items: {
      name: string;
      isPopular?: boolean; // Optional popular flag for individual items
      href?: string;
      subItems?: {
        name: string;
        href?: string;
      }[]; // Sub-items for each item, if needed
    }[];
  }[];
  href?: string; // Optional href for top-level items without dropdowns
}

export const navItems: NavItem[] = [
  {
    label: "Features",
    items: [
      {
        title: "Products",
        items: [
          {
            name: "Building Materials",
            href: "/products/materials",
            subItems: [
              { name: "Concrete & Cement" },
              { name: "Bricks & Blocks" },
              { name: "Lumber & Timber" },
              { name: "Steel (structural, rebar)" },
              { name: "Roofing Materials (tiles, metal sheets, etc.)" },
              { name: "Insulation (thermal, acoustic)" },
              { name: "Aggregates (sand, gravel, crushed stone)" },
              { name: "Doors & Windows (frames, glass)" },
              { name: "Adhesives & Sealants" },
              { name: "Drywall & Plasterboard" },
            ],
          },
          {
            name: "Design",
            href: "/products/design",
            subItems: [
              { name: "Architectural Design" },
              { name: "Structural Engineering" },
              { name: "Interior Design" },
              { name: "MEP Engineering (Mechanical, Electrical, Plumbing)" },
              { name: "Landscape Design" },
              { name: "3D Modeling & Visualization" },
              { name: "Permitting Services" },
              { name: "Project Planning" },
            ],
          },
          {
            name: "Safety Gear",
            href: "/products/safety",
            subItems: [
              { name: "Hard Hats" },
              { name: "Safety Glasses & Goggles" },
              { name: "Gloves (work, chemical, etc.)" },
              { name: "Safety Footwear" },
              { name: "High-Visibility Clothing" },
              { name: "Harnesses & Fall Protection" },
              { name: "Respirators & Masks" },
              { name: "Ear Protection" },
            ],
          },
          {
            name: "Electrical",
            href: "/products/electrical",
            subItems: [
              { name: "Wiring & Cables" },
              { name: "Lighting Fixtures" },
              { name: "Switches & Outlets" },
              { name: "Distribution Boards & Panels" },
              { name: "Conduit & Trunking" },
              { name: "Generators & UPS Systems" },
              { name: "Security Systems (alarms, CCTV)" },
              { name: "Smart Home Systems" },
            ],
          },
          {
            name: "Plumbing",
            href: "/products/plumbing",
            subItems: [
              { name: "Pipes & Fittings (PVC, copper, etc.)" },
              { name: "Sanitaryware (toilets, sinks, showers)" },
              { name: "Water Heaters" },
              { name: "Pumps & Valves" },
              { name: "Drainage Systems" },
              { name: "Irrigation Systems" },
            ],
          },
          {
            name: "Finishing Materials",
            href: "/products/finishing",
            subItems: [
              { name: "Paints & Coatings" },
              { name: "Flooring (tiles, wood, carpet, laminate)" },
              { name: "Wallpapers & Wall Coverings" },
              { name: "Ceiling Finishes (gypsum boards, suspended ceilings)" },
              { name: "Countertops" },
              { name: "Cabinets & Joinery" },
              { name: "Fixtures & Fittings (door handles, etc.)" },
            ],
          },
        ],
      },
      {
        title: "Services",
        items: [
          {
            name: "Construction Services",
            href: "/services/construction",
            subItems: [
              {
                name: "General Contracting",
                href: "/services/construction/general-contracting",
              },
              {
                name: "Project Management",
                href: "/services/construction/project-management",
              },
              // ... more construction services
            ],
          },
          {
            name: "Consulting & Support",
            href: "/services/consulting",
            subItems: [
              { name: "Architectural Design" },
              { name: "Structural Engineering" },
              { name: "Interior Design" },
              { name: "MEP Engineering (Mechanical, Electrical, Plumbing)" },
              { name: "Landscape Design" },
              { name: "3D Modeling & Visualization" },
              { name: "Permitting Services" },
              { name: "Project Planning" },
            ],
          },
        ],
      },
      {
        title: "Deals",
        items: [
          {
            name: "Bulks & Bids",
            href: "/bids-deals/deals",
          },
        ],
      },
    ],
  },
  // Optionally, you can keep the top-level "Products", "Services", "Bids & Deals"
  // if you want them to appear outside the "Features" dropdown as well.
];
