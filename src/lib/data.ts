import {
  Building2,
  HardHat,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const SITE = {
  name: "Pro Rentals",
  phone: "868 734 9490",
  phoneHref: "tel:+18687349490",
  whatsapp: "18687349490",
  email: "hello@prorentals.com",
  location: "Plymouth, Tobago",
  address: "Plymouth, Tobago",
  city: "",
  hours: "Mon–Sat: 7:00 AM – 6:00 PM",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "Equipment Rentals" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export type Category = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  itemCount: number;
};

export const CATEGORIES: Category[] = [
  {
    id: "cleaning",
    title: "Cleaning Equipment",
    description:
      "Commercial vacuums, floor scrubbers, pressure washers, and specialty cleaning machines.",
    icon: Sparkles,
    href: "/categories#cleaning",
    itemCount: 48,
  },
  {
    id: "diy",
    title: "DIY Tools",
    description:
      "Power drills, saws, sanders, and home project essentials for weekend warriors.",
    icon: Wrench,
    href: "/categories#diy",
    itemCount: 62,
  },
  {
    id: "construction",
    title: "Construction Tools",
    description:
      "Heavy-duty mixers, compactors, concrete tools, and jobsite-ready equipment.",
    icon: HardHat,
    href: "/categories#construction",
    itemCount: 85,
  },
  {
    id: "facility",
    title: "Sanitation and Hygiene Equipment",
    description:
      "Restroom trailers, sanitization stations, waste management, and facility support.",
    icon: Building2,
    href: "/categories#facility",
    itemCount: 34,
  },
];

export type Equipment = {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  featured?: boolean;
  specs: string[];
};

export const EQUIPMENT: Equipment[] = [
  {
    id: "floor-scrubber-pro",
    name: "Industrial Floor Scrubber",
    category: "Cleaning Equipment",
    dailyRate: 89,
    featured: true,
    specs: ["28\" path", "Battery powered", "500 sq ft/hr"],
  },
  {
    id: "pressure-washer-4000",
    name: "4000 PSI Pressure Washer",
    category: "Cleaning Equipment",
    dailyRate: 65,
    featured: true,
    specs: ["Gas powered", "50 ft hose", "5 nozzles included"],
  },
  {
    id: "concrete-mixer",
    name: "Portable Concrete Mixer",
    category: "Construction Tools",
    dailyRate: 75,
    featured: true,
    specs: ["3.5 cu ft drum", "Electric motor", "Towable"],
  },
  {
    id: "plate-compactor",
    name: "Vibratory Plate Compactor",
    category: "Construction Tools",
    dailyRate: 55,
    featured: true,
    specs: ["5800 lb force", "Gas engine", "Water tank ready"],
  },
  {
    id: "rotary-hammer",
    name: "SDS Rotary Hammer Drill",
    category: "DIY Tools",
    dailyRate: 42,
    specs: ["1-1/8\" capacity", "Anti-vibration", "Case included"],
  },
  {
    id: "restroom-trailer",
    name: "Luxury Restroom Trailer",
    category: "Sanitation and Hygiene Equipment",
    dailyRate: 325,
    specs: ["2-stall unit", "Climate controlled", "Delivery available"],
  },
  {
    id: "carpet-extractor",
    name: "Commercial Carpet Extractor",
    category: "Cleaning Equipment",
    dailyRate: 72,
    specs: ["12 gal recovery", "Heated option", "Wand kit"],
  },
  {
    id: "scissor-lift-19",
    name: "19ft Electric Scissor Lift",
    category: "Construction Tools",
    dailyRate: 195,
    specs: ["500 lb capacity", "Indoor/outdoor", "Operator cert required"],
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "Well-Maintained Fleet",
    description:
      "Every unit is inspected, serviced, and ready for your job before pickup or delivery.",
  },
  {
    title: "Flexible Rental Terms",
    description:
      "Daily, weekly, and monthly rates tailored for contractors, businesses, and homeowners.",
  },
  {
    title: "Fast Pickup & Delivery",
    description:
      "Same-day availability on popular items with local delivery across the metro area.",
  },
  {
    title: "Expert Support",
    description:
      "Our team helps you choose the right equipment and provides on-site operation guidance.",
  },
] as const;

export const RENTAL_STEPS = [
  {
    step: 1,
    title: "Browse & Select",
    description: "Explore our catalog online or call us for equipment recommendations.",
  },
  {
    step: 2,
    title: "Reserve Your Dates",
    description: "Choose rental duration and confirm availability with our team.",
  },
  {
    step: 3,
    title: "Pickup or Delivery",
    description: "Collect from our yard or schedule convenient delivery to your site.",
  },
  {
    step: 4,
    title: "Return With Ease",
    description: "Drop off when finished—we handle cleaning, inspection, and billing.",
  },
] as const;

export const TARGET_MARKETS = [
  "Contractors",
  "Small Businesses",
  "Home Owners",
  "Facility Managers",
] as const;

export const ABOUT_STATS = [
  { value: "15+", label: "Years in Business" },
  { value: "2,400+", label: "Equipment Units" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "24hr", label: "Support Response" },
] as const;
