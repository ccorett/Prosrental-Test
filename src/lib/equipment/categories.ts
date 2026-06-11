export const EQUIPMENT_CATEGORY_SLUGS = [
  "cleaning",
  "construction",
  "diy",
  "landscaping",
  "access",
  "sanitation",
  "event",
] as const;

export type EquipmentCategorySlug = (typeof EQUIPMENT_CATEGORY_SLUGS)[number];

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategorySlug, string> = {
  cleaning: "Cleaning Equipment",
  construction: "Construction Equipment",
  diy: "DIY Tools",
  landscaping: "Landscaping Equipment",
  access: "Access Equipment",
  sanitation: "Sanitation & Hygiene Equipment",
  event: "Event & Site Facilities",
};

const CSV_CATEGORY_TO_SLUG: Record<string, EquipmentCategorySlug> = {
  Cleaning: "cleaning",
  Construction: "construction",
  "DIY Tools": "diy",
  Landscaping: "landscaping",
  "Access Equipment": "access",
  Hygiene: "sanitation",
  "Event Equipment": "event",
};

export function categorySlugFromCsv(csvCategory: string): EquipmentCategorySlug {
  const slug = CSV_CATEGORY_TO_SLUG[csvCategory];
  if (!slug) {
    throw new Error(`Unknown equipment category: ${csvCategory}`);
  }
  return slug;
}

export function categoryLabelFromSlug(slug: EquipmentCategorySlug): string {
  return EQUIPMENT_CATEGORY_LABELS[slug];
}

export function categorySlugFromLabel(label: string): EquipmentCategorySlug {
  const entry = Object.entries(EQUIPMENT_CATEGORY_LABELS).find(
    ([, value]) => value === label
  );
  if (!entry) {
    throw new Error(`Unknown equipment category label: ${label}`);
  }
  return entry[0] as EquipmentCategorySlug;
}
