interface NavItem {
  label: string;
  items?: {
    title: string;
    description?: string;
    isPopular?: boolean;
    items: {
      name: string;
      isPopular?: boolean;
    }[];
  }[];
}

export const navItems: NavItem[] = [
  {
  "label": "Features",
  "items": [
    {
      "title": "Building Materials",
      "items": [
        { "name": "Concrete & Cement" },
        { "name": "Bricks & Blocks" },
        { "name": "Lumber & Timber" },
        { "name": "Steel (structural, rebar)" },
        { "name": "Roofing Materials (tiles, metal sheets, etc.)" },
        { "name": "Insulation (thermal, acoustic)" },
        { "name": "Aggregates (sand, gravel, crushed stone)" },
        { "name": "Doors & Windows (frames, glass)" },
        { "name": "Adhesives & Sealants" },
        { "name": "Drywall & Plasterboard" }
      ]
    },
    {
      "title": "Design",
      "items": [
        { "name": "Architectural Design" },
        { "name": "Structural Engineering" },
        { "name": "Interior Design" },
        { "name": "MEP Engineering (Mechanical, Electrical, Plumbing)" },
        { "name": "Landscape Design" },
        { "name": "3D Modeling & Visualization" },
        { "name": "Permitting Services" },
        { "name": "Project Planning" }
      ]
    },
    {
      "title": "Safety Gear",
      "items": [
        { "name": "Hard Hats" },
        { "name": "Safety Glasses & Goggles" },
        { "name": "Gloves (work, chemical, etc.)" },
        { "name": "Safety Footwear" },
        { "name": "High-Visibility Clothing" },
        { "name": "Harnesses & Fall Protection" },
        { "name": "Respirators & Masks" },
        { "name": "Ear Protection" }
      ]
    },
    {
      "title": "Electrical",
      "items": [
        { "name": "Wiring & Cables" },
        { "name": "Lighting Fixtures" },
        { "name": "Switches & Outlets" },
        { "name": "Distribution Boards & Panels" },
        { "name": "Conduit & Trunking" },
        { "name": "Generators & UPS Systems" },
        { "name": "Security Systems (alarms, CCTV)" },
        { "name": "Smart Home Systems" }
      ]
    },
    {
      "title": "Plumbing",
      "items": [
        { "name": "Pipes & Fittings (PVC, copper, etc.)" },
        { "name": "Sanitaryware (toilets, sinks, showers)" },
        { "name": "Water Heaters" },
        { "name": "Pumps & Valves" },
        { "name": "Drainage Systems" },
        { "name": "Irrigation Systems" }
      ]
    },
    {
      "title": "Finishing Materials",
      "items": [
        { "name": "Paints & Coatings" },
        { "name": "Flooring (tiles, wood, carpet, laminate)" },
        { "name": "Wallpapers & Wall Coverings" },
        { "name": "Ceiling Finishes (gypsum boards, suspended ceilings)" },
        { "name": "Countertops" },
        { "name": "Cabinets & Joinery" },
        { "name": "Fixtures & Fittings (door handles, etc.)" }
      ]
    }
  ]
}
]
