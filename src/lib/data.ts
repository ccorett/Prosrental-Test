import {

  ArrowUpFromLine,

  Building2,

  HardHat,

  Leaf,

  Sparkles,

  Tent,

  Wrench,

  type LucideIcon,

} from "lucide-react";



export const SITE = {

  name: "Pro Rentals",

  phone: "868 734 9490",

  phoneHref: "https://wa.me/18687349490",

  whatsapp: "18687349490",

  email: "info@prorentals.co",

  location: "Plymouth, Tobago",

  address: "Plymouth, Tobago",

  city: "",

  hours: "Mon–Sat: 7:00 AM – 6:00 PM",

  tagline:

    "Your digital storefront for professional equipment rentals across Tobago and Trinidad.",

} as const;



export const NAV_LINKS = [

  { href: "/", label: "Home" },

  { href: "/equipment", label: "Browse Equipment" },

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

      "Floor scrubbers, pressure washers, extractors, and commercial cleaning machines.",

    icon: Sparkles,

    href: "/categories#cleaning",

    itemCount: 10,

  },

  {

    id: "construction",

    title: "Construction Equipment",

    description:

      "Mixers, compactors, concrete tools, and jobsite-ready equipment for contractors.",

    icon: HardHat,

    href: "/categories#construction",

    itemCount: 10,

  },

  {

    id: "diy",

    title: "DIY Tools",

    description:

      "Power drills, saws, sanders, and home project essentials for weekend warriors and small jobs.",

    icon: Wrench,

    href: "/categories#diy",

    itemCount: 10,

  },

  {

    id: "landscaping",

    title: "Landscaping Equipment",

    description:

      "Lawn care, trimming, and site prep tools for grounds maintenance and outdoor projects.",

    icon: Leaf,

    href: "/categories#landscaping",

    itemCount: 6,

  },

  {

    id: "access",

    title: "Access Equipment",

    description:

      "Scissor lifts, ladders, scaffold towers, and elevated work platforms for safe height access.",

    icon: ArrowUpFromLine,

    href: "/categories#access",

    itemCount: 4,

  },

  {

    id: "sanitation",

    title: "Sanitation & Hygiene Equipment",

    description:

      "Hygiene dispensers, sanitary bins, hand wash stations, and facility sanitation rentals with servicing.",

    icon: Building2,

    href: "/categories#sanitation",

    itemCount: 7,

  },

  {

    id: "event",

    title: "Event & Site Facilities",

    description:

      "Portable toilets, restroom trailers, hand wash units, and on-site facilities for events and projects.",

    icon: Tent,

    href: "/categories#event",

    itemCount: 3,

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

      "Same-day availability on popular items with delivery across Plymouth and Tobago.",

  },

  {

    title: "Expert Support",

    description:

      "Our team helps you choose the right equipment and provides on-site operation guidance.",

  },

] as const;



export const CORE_VALUES = [

  {

    title: "Reliability",

    description: "Equipment that performs when your timeline cannot slip.",

  },

  {

    title: "Transparency",

    description: "Clear rates, honest availability, and upfront rental guidance.",

  },

  {

    title: "Service",

    description: "Responsive support from quote to return—including sanitation servicing.",

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

  { value: "50+", label: "Equipment Units" },

  { value: "98%", label: "Customer Satisfaction" },

  { value: "24hr", label: "Support Response" },

] as const;



export const COMPANY_OVERVIEW =

  "Pro Rentals is Tobago's trusted equipment rental partner—serving contractors, businesses, homeowners, and facility managers with a professionally maintained fleet, transparent pricing, and responsive local support.";


