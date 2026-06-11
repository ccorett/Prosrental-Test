import {
  categoryLabelFromSlug,
  categorySlugFromCsv,
} from "@/lib/equipment/categories";
import type { AvailabilityStatus, InventoryRecord } from "@/lib/equipment/types";

const FEATURED_EQUIPMENT_NAMES = new Set(
  [
    "Industrial Floor Scrubber",
    "Commercial Carpet Extractor",
    "Pressure Washer 4000 PSI",
    "Portable Concrete Mixer",
    "Floor Polisher",
    "Angle Grinder",
    "Brush Cutter",
    "Fibreglass Ladder 12ft",
    "Portable Hand Wash Station",
  ].map((name) => name.toLowerCase())
);

type RawInventoryRow = {
  itemId: string;
  csvCategory: string;
  equipmentName: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  quantityInStock: number;
  status: string;
};

const RAW_INVENTORY: RawInventoryRow[] = [
  { itemId: "CE001", csvCategory: "Cleaning", equipmentName: "Industrial Floor Scrubber", dailyRate: 850, weeklyRate: 4250, monthlyRate: 12000, quantityInStock: 2, status: "Active" },
  { itemId: "CE002", csvCategory: "Cleaning", equipmentName: "Commercial Carpet Extractor", dailyRate: 650, weeklyRate: 3250, monthlyRate: 9000, quantityInStock: 2, status: "Active" },
  { itemId: "CE003", csvCategory: "Cleaning", equipmentName: "Wet & Dry Vacuum", dailyRate: 150, weeklyRate: 750, monthlyRate: 2200, quantityInStock: 4, status: "Active" },
  { itemId: "CE004", csvCategory: "Cleaning", equipmentName: "Pressure Washer 2500 PSI", dailyRate: 250, weeklyRate: 1250, monthlyRate: 3500, quantityInStock: 4, status: "Active" },
  { itemId: "CE005", csvCategory: "Cleaning", equipmentName: "Pressure Washer 4000 PSI", dailyRate: 400, weeklyRate: 2000, monthlyRate: 5500, quantityInStock: 2, status: "Active" },
  { itemId: "CE006", csvCategory: "Cleaning", equipmentName: "Floor Polisher", dailyRate: 300, weeklyRate: 1500, monthlyRate: 4200, quantityInStock: 2, status: "Active" },
  { itemId: "CE007", csvCategory: "Cleaning", equipmentName: "Steam Cleaner", dailyRate: 250, weeklyRate: 1250, monthlyRate: 3500, quantityInStock: 2, status: "Active" },
  { itemId: "CE008", csvCategory: "Cleaning", equipmentName: "Air Mover Fan", dailyRate: 75, weeklyRate: 375, monthlyRate: 1000, quantityInStock: 6, status: "Active" },
  { itemId: "CE009", csvCategory: "Cleaning", equipmentName: "Dehumidifier", dailyRate: 150, weeklyRate: 750, monthlyRate: 2200, quantityInStock: 4, status: "Active" },
  { itemId: "CE010", csvCategory: "Cleaning", equipmentName: "Backpack Vacuum", dailyRate: 100, weeklyRate: 500, monthlyRate: 1400, quantityInStock: 4, status: "Active" },
  { itemId: "CT001", csvCategory: "Construction", equipmentName: "Portable Concrete Mixer", dailyRate: 300, weeklyRate: 1500, monthlyRate: 4200, quantityInStock: 2, status: "Active" },
  { itemId: "CT002", csvCategory: "Construction", equipmentName: "Plate Compactor", dailyRate: 350, weeklyRate: 1750, monthlyRate: 5000, quantityInStock: 2, status: "Active" },
  { itemId: "CT003", csvCategory: "Construction", equipmentName: "Jack Hammer", dailyRate: 300, weeklyRate: 1500, monthlyRate: 4200, quantityInStock: 3, status: "Active" },
  { itemId: "CT004", csvCategory: "Construction", equipmentName: "Rotary Hammer Drill", dailyRate: 200, weeklyRate: 1000, monthlyRate: 2800, quantityInStock: 4, status: "Active" },
  { itemId: "CT005", csvCategory: "Construction", equipmentName: "Demolition Hammer", dailyRate: 350, weeklyRate: 1750, monthlyRate: 5000, quantityInStock: 2, status: "Active" },
  { itemId: "CT006", csvCategory: "Construction", equipmentName: "Concrete Cutter", dailyRate: 400, weeklyRate: 2000, monthlyRate: 5500, quantityInStock: 2, status: "Active" },
  { itemId: "CT007", csvCategory: "Construction", equipmentName: "Tile Saw", dailyRate: 200, weeklyRate: 1000, monthlyRate: 2800, quantityInStock: 2, status: "Active" },
  { itemId: "CT008", csvCategory: "Construction", equipmentName: "Generator 3500W", dailyRate: 250, weeklyRate: 1250, monthlyRate: 3500, quantityInStock: 3, status: "Active" },
  { itemId: "CT009", csvCategory: "Construction", equipmentName: "Generator 6500W", dailyRate: 450, weeklyRate: 2250, monthlyRate: 6500, quantityInStock: 2, status: "Active" },
  { itemId: "CT010", csvCategory: "Construction", equipmentName: "Scissor Lift 19ft", dailyRate: 1200, weeklyRate: 6000, monthlyRate: 18000, quantityInStock: 1, status: "Active" },
  { itemId: "DT001", csvCategory: "DIY Tools", equipmentName: "Cordless Drill Kit", dailyRate: 75, weeklyRate: 375, monthlyRate: 1000, quantityInStock: 8, status: "Active" },
  { itemId: "DT002", csvCategory: "DIY Tools", equipmentName: "Impact Driver", dailyRate: 75, weeklyRate: 375, monthlyRate: 1000, quantityInStock: 6, status: "Active" },
  { itemId: "DT003", csvCategory: "DIY Tools", equipmentName: "Circular Saw", dailyRate: 100, weeklyRate: 500, monthlyRate: 1400, quantityInStock: 4, status: "Active" },
  { itemId: "DT004", csvCategory: "DIY Tools", equipmentName: "Jig Saw", dailyRate: 75, weeklyRate: 375, monthlyRate: 1000, quantityInStock: 4, status: "Active" },
  { itemId: "DT005", csvCategory: "DIY Tools", equipmentName: "Mitre Saw", dailyRate: 150, weeklyRate: 750, monthlyRate: 2200, quantityInStock: 3, status: "Active" },
  { itemId: "DT006", csvCategory: "DIY Tools", equipmentName: "Table Saw", dailyRate: 250, weeklyRate: 1250, monthlyRate: 3500, quantityInStock: 2, status: "Active" },
  { itemId: "DT007", csvCategory: "DIY Tools", equipmentName: "Angle Grinder", dailyRate: 75, weeklyRate: 375, monthlyRate: 1000, quantityInStock: 6, status: "Active" },
  { itemId: "DT008", csvCategory: "DIY Tools", equipmentName: "Heat Gun", dailyRate: 50, weeklyRate: 250, monthlyRate: 700, quantityInStock: 4, status: "Active" },
  { itemId: "DT009", csvCategory: "DIY Tools", equipmentName: "Orbital Sander", dailyRate: 75, weeklyRate: 375, monthlyRate: 1000, quantityInStock: 4, status: "Active" },
  { itemId: "DT010", csvCategory: "DIY Tools", equipmentName: "Air Compressor", dailyRate: 200, weeklyRate: 1000, monthlyRate: 2800, quantityInStock: 2, status: "Active" },
  { itemId: "LG001", csvCategory: "Landscaping", equipmentName: "Brush Cutter", dailyRate: 150, weeklyRate: 750, monthlyRate: 2200, quantityInStock: 4, status: "Active" },
  { itemId: "LG002", csvCategory: "Landscaping", equipmentName: "Lawn Mower", dailyRate: 150, weeklyRate: 750, monthlyRate: 2200, quantityInStock: 4, status: "Active" },
  { itemId: "LG003", csvCategory: "Landscaping", equipmentName: "Hedge Trimmer", dailyRate: 100, weeklyRate: 500, monthlyRate: 1400, quantityInStock: 4, status: "Active" },
  { itemId: "LG004", csvCategory: "Landscaping", equipmentName: "Chainsaw Small", dailyRate: 150, weeklyRate: 750, monthlyRate: 2200, quantityInStock: 3, status: "Active" },
  { itemId: "LG005", csvCategory: "Landscaping", equipmentName: "Chainsaw Large", dailyRate: 250, weeklyRate: 1250, monthlyRate: 3500, quantityInStock: 2, status: "Active" },
  { itemId: "LG006", csvCategory: "Landscaping", equipmentName: "Wood Chipper", dailyRate: 600, weeklyRate: 3000, monthlyRate: 8500, quantityInStock: 1, status: "Active" },
  { itemId: "HY001", csvCategory: "Hygiene", equipmentName: "Sanitary Bin 20L", dailyRate: 20, weeklyRate: 40, monthlyRate: 75, quantityInStock: 100, status: "Active" },
  { itemId: "HY002", csvCategory: "Hygiene", equipmentName: "Sanitary Bin 40L", dailyRate: 30, weeklyRate: 60, monthlyRate: 120, quantityInStock: 50, status: "Active" },
  { itemId: "HY003", csvCategory: "Hygiene", equipmentName: "Soap Dispenser", dailyRate: 10, weeklyRate: 20, monthlyRate: 40, quantityInStock: 50, status: "Active" },
  { itemId: "HY004", csvCategory: "Hygiene", equipmentName: "Paper Towel Dispenser", dailyRate: 10, weeklyRate: 20, monthlyRate: 40, quantityInStock: 50, status: "Active" },
  { itemId: "HY005", csvCategory: "Hygiene", equipmentName: "Toilet Paper Dispenser", dailyRate: 10, weeklyRate: 20, monthlyRate: 40, quantityInStock: 50, status: "Active" },
  { itemId: "HY006", csvCategory: "Hygiene", equipmentName: "Hand Sanitizer Stand", dailyRate: 25, weeklyRate: 50, monthlyRate: 100, quantityInStock: 20, status: "Active" },
  { itemId: "HY007", csvCategory: "Hygiene", equipmentName: "Portable Hand Wash Station", dailyRate: 150, weeklyRate: 750, monthlyRate: 2200, quantityInStock: 4, status: "Active" },
  { itemId: "EV001", csvCategory: "Event Equipment", equipmentName: "Luxury Restroom Trailer", dailyRate: 3000, weeklyRate: 15000, monthlyRate: 45000, quantityInStock: 1, status: "Active" },
  { itemId: "EV002", csvCategory: "Event Equipment", equipmentName: "Portable Toilet Unit", dailyRate: 150, weeklyRate: 750, monthlyRate: 2200, quantityInStock: 20, status: "Active" },
  { itemId: "EV003", csvCategory: "Event Equipment", equipmentName: "Hand Wash Basin Unit", dailyRate: 100, weeklyRate: 500, monthlyRate: 1400, quantityInStock: 10, status: "Active" },
  { itemId: "EQ001", csvCategory: "Access Equipment", equipmentName: "Extension Ladder 24ft", dailyRate: 75, weeklyRate: 375, monthlyRate: 1000, quantityInStock: 6, status: "Active" },
  { itemId: "EQ002", csvCategory: "Access Equipment", equipmentName: "Fibreglass Ladder 12ft", dailyRate: 50, weeklyRate: 250, monthlyRate: 700, quantityInStock: 6, status: "Active" },
  { itemId: "EQ003", csvCategory: "Access Equipment", equipmentName: "Scaffold Tower", dailyRate: 250, weeklyRate: 1250, monthlyRate: 3500, quantityInStock: 4, status: "Active" },
  { itemId: "EQ004", csvCategory: "Access Equipment", equipmentName: "Mobile Scaffold Set", dailyRate: 350, weeklyRate: 1750, monthlyRate: 5000, quantityInStock: 2, status: "Active" },
];

function buildDescription(name: string, categoryLabel: string): string {
  return `Rent the ${name} for professional ${categoryLabel.toLowerCase()} projects. Well-maintained units with daily, weekly, and monthly rates in TTD. Pickup and delivery available across Plymouth and Tobago.`;
}

function mapStatus(status: string): AvailabilityStatus {
  const normalized = status.trim().toLowerCase();
  if (normalized === "active" || normalized === "available") return "AVAILABLE";
  if (normalized === "reserved") return "RESERVED";
  if (normalized === "out of service") return "OUT_OF_SERVICE";
  if (normalized === "coming soon") return "COMING_SOON";
  return "AVAILABLE";
}

function featuredImageUrl(itemId: string): string {
  return `/images/equipment/${itemId.toLowerCase()}.webp`;
}

export function buildInventoryRecord(row: RawInventoryRow): InventoryRecord {
  const categorySlug = categorySlugFromCsv(row.csvCategory);
  const category = categoryLabelFromSlug(categorySlug);
  const featured = FEATURED_EQUIPMENT_NAMES.has(row.equipmentName.toLowerCase());

  return {
    itemId: row.itemId,
    csvCategory: row.csvCategory,
    categorySlug,
    category,
    equipmentName: row.equipmentName,
    description: buildDescription(row.equipmentName, category),
    dailyRate: row.dailyRate,
    weeklyRate: row.weeklyRate,
    monthlyRate: row.monthlyRate,
    quantityAvailable: row.quantityInStock,
    quantityTotal: row.quantityInStock,
    availabilityStatus: mapStatus(row.status),
    imageUrl: featured ? featuredImageUrl(row.itemId) : null,
    featured,
    comingSoon: !featured,
  };
}

export const INVENTORY_RECORDS: InventoryRecord[] = RAW_INVENTORY.map(buildInventoryRecord);

export const INVENTORY_STATS = {
  total: INVENTORY_RECORDS.length,
  categories: new Set(INVENTORY_RECORDS.map((item) => item.categorySlug)).size,
  featured: INVENTORY_RECORDS.filter((item) => item.featured).length,
  comingSoonPlaceholders: INVENTORY_RECORDS.filter((item) => item.comingSoon).length,
} as const;
