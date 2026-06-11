export type RentalCategory = "standard" | "sanitation";

export type EquipmentTypeId =
  | "pressure-washer"
  | "floor-scrubber"
  | "carpet-extractor"
  | "concrete-mixer"
  | "plate-compactor"
  | "rotary-hammer"
  | "scissor-lift"
  | "sanitary-bin"
  | "soap-dispenser"
  | "hand-sanitizer-station"
  | "toilet-paper-dispenser"
  | "paper-towel-dispenser";

export type EquipmentType = {
  id: EquipmentTypeId;
  label: string;
  category: RentalCategory;
};

export const EQUIPMENT_TYPES: EquipmentType[] = [
  { id: "pressure-washer", label: "Pressure Washer", category: "standard" },
  { id: "floor-scrubber", label: "Floor Scrubber", category: "standard" },
  { id: "carpet-extractor", label: "Carpet Extractor", category: "standard" },
  { id: "concrete-mixer", label: "Concrete Mixer", category: "standard" },
  { id: "plate-compactor", label: "Plate Compactor", category: "standard" },
  { id: "rotary-hammer", label: "Rotary Hammer Drill", category: "standard" },
  { id: "scissor-lift", label: "Scissor Lift", category: "standard" },
  { id: "sanitary-bin", label: "Sanitary Bin", category: "sanitation" },
  { id: "soap-dispenser", label: "Soap Dispenser", category: "sanitation" },
  {
    id: "hand-sanitizer-station",
    label: "Hand Sanitizer Station",
    category: "sanitation",
  },
  {
    id: "toilet-paper-dispenser",
    label: "Toilet Paper Dispenser",
    category: "sanitation",
  },
  {
    id: "paper-towel-dispenser",
    label: "Paper Towel Dispenser",
    category: "sanitation",
  },
];

export const RENTAL_CATEGORIES = [
  { id: "standard" as const, label: "Standard Equipment Rental" },
  {
    id: "sanitation" as const,
    label: "Sanitation Equipment",
  },
];

export type StandardDefaults = {
  dailyRate: number;
  rentalDays: number;
  deliveryFee: number;
  deposit: number;
  supportFee: number;
  purchaseCost: number;
};

export type SanitationDefaults = {
  monthlyRental: number;
  units: number;
  months: number;
  servicingFee: number;
  servicingFrequency: number;
  installationFee: number;
  consumablesFee: number;
  deposit: number;
  purchaseCost: number;
};

export const STANDARD_DEFAULTS: Record<EquipmentTypeId, StandardDefaults> = {
  "pressure-washer": {
    dailyRate: 65,
    rentalDays: 3,
    deliveryFee: 150,
    deposit: 500,
    supportFee: 0,
    purchaseCost: 3500,
  },
  "floor-scrubber": {
    dailyRate: 89,
    rentalDays: 5,
    deliveryFee: 175,
    deposit: 800,
    supportFee: 50,
    purchaseCost: 12000,
  },
  "carpet-extractor": {
    dailyRate: 72,
    rentalDays: 4,
    deliveryFee: 150,
    deposit: 600,
    supportFee: 0,
    purchaseCost: 8500,
  },
  "concrete-mixer": {
    dailyRate: 75,
    rentalDays: 7,
    deliveryFee: 200,
    deposit: 500,
    supportFee: 0,
    purchaseCost: 6500,
  },
  "plate-compactor": {
    dailyRate: 55,
    rentalDays: 5,
    deliveryFee: 125,
    deposit: 400,
    supportFee: 0,
    purchaseCost: 4800,
  },
  "rotary-hammer": {
    dailyRate: 42,
    rentalDays: 3,
    deliveryFee: 75,
    deposit: 250,
    supportFee: 0,
    purchaseCost: 2200,
  },
  "scissor-lift": {
    dailyRate: 195,
    rentalDays: 5,
    deliveryFee: 350,
    deposit: 2500,
    supportFee: 150,
    purchaseCost: 45000,
  },
  "sanitary-bin": {
    dailyRate: 0,
    rentalDays: 0,
    deliveryFee: 0,
    deposit: 0,
    supportFee: 0,
    purchaseCost: 0,
  },
  "soap-dispenser": {
    dailyRate: 0,
    rentalDays: 0,
    deliveryFee: 0,
    deposit: 0,
    supportFee: 0,
    purchaseCost: 0,
  },
  "hand-sanitizer-station": {
    dailyRate: 0,
    rentalDays: 0,
    deliveryFee: 0,
    deposit: 0,
    supportFee: 0,
    purchaseCost: 0,
  },
  "toilet-paper-dispenser": {
    dailyRate: 0,
    rentalDays: 0,
    deliveryFee: 0,
    deposit: 0,
    supportFee: 0,
    purchaseCost: 0,
  },
  "paper-towel-dispenser": {
    dailyRate: 0,
    rentalDays: 0,
    deliveryFee: 0,
    deposit: 0,
    supportFee: 0,
    purchaseCost: 0,
  },
};

export const SANITATION_DEFAULTS: Record<EquipmentTypeId, SanitationDefaults> = {
  "sanitary-bin": {
    monthlyRental: 180,
    units: 4,
    months: 12,
    servicingFee: 45,
    servicingFrequency: 2,
    installationFee: 200,
    consumablesFee: 80,
    deposit: 300,
    purchaseCost: 1200,
  },
  "soap-dispenser": {
    monthlyRental: 95,
    units: 6,
    months: 12,
    servicingFee: 35,
    servicingFrequency: 2,
    installationFee: 150,
    consumablesFee: 60,
    deposit: 200,
    purchaseCost: 850,
  },
  "hand-sanitizer-station": {
    monthlyRental: 120,
    units: 5,
    months: 12,
    servicingFee: 40,
    servicingFrequency: 2,
    installationFee: 175,
    consumablesFee: 70,
    deposit: 250,
    purchaseCost: 1100,
  },
  "toilet-paper-dispenser": {
    monthlyRental: 85,
    units: 8,
    months: 12,
    servicingFee: 30,
    servicingFrequency: 2,
    installationFee: 125,
    consumablesFee: 55,
    deposit: 180,
    purchaseCost: 650,
  },
  "paper-towel-dispenser": {
    monthlyRental: 85,
    units: 8,
    months: 12,
    servicingFee: 30,
    servicingFrequency: 2,
    installationFee: 125,
    consumablesFee: 55,
    deposit: 180,
    purchaseCost: 650,
  },
  "pressure-washer": {
    monthlyRental: 0,
    units: 0,
    months: 0,
    servicingFee: 0,
    servicingFrequency: 0,
    installationFee: 0,
    consumablesFee: 0,
    deposit: 0,
    purchaseCost: 0,
  },
  "floor-scrubber": {
    monthlyRental: 0,
    units: 0,
    months: 0,
    servicingFee: 0,
    servicingFrequency: 0,
    installationFee: 0,
    consumablesFee: 0,
    deposit: 0,
    purchaseCost: 0,
  },
  "carpet-extractor": {
    monthlyRental: 0,
    units: 0,
    months: 0,
    servicingFee: 0,
    servicingFrequency: 0,
    installationFee: 0,
    consumablesFee: 0,
    deposit: 0,
    purchaseCost: 0,
  },
  "concrete-mixer": {
    monthlyRental: 0,
    units: 0,
    months: 0,
    servicingFee: 0,
    servicingFrequency: 0,
    installationFee: 0,
    consumablesFee: 0,
    deposit: 0,
    purchaseCost: 0,
  },
  "plate-compactor": {
    monthlyRental: 0,
    units: 0,
    months: 0,
    servicingFee: 0,
    servicingFrequency: 0,
    installationFee: 0,
    consumablesFee: 0,
    deposit: 0,
    purchaseCost: 0,
  },
  "rotary-hammer": {
    monthlyRental: 0,
    units: 0,
    months: 0,
    servicingFee: 0,
    servicingFrequency: 0,
    installationFee: 0,
    consumablesFee: 0,
    deposit: 0,
    purchaseCost: 0,
  },
  "scissor-lift": {
    monthlyRental: 0,
    units: 0,
    months: 0,
    servicingFee: 0,
    servicingFrequency: 0,
    installationFee: 0,
    consumablesFee: 0,
    deposit: 0,
    purchaseCost: 0,
  },
};

export type StandardInputs = {
  dailyRate: number;
  rentalDays: number;
  deliveryFee: number;
  deposit: number;
  supportFee: number;
  purchaseCost: number;
};

export type SanitationInputs = {
  monthlyRental: number;
  units: number;
  months: number;
  servicingFee: number;
  servicingFrequency: number;
  installationFee: number;
  consumablesFee: number;
  deposit: number;
  purchaseCost: number;
};

export type StandardResults = {
  rentalSubtotal: number;
  totalCashNeeded: number;
  trueRentalCost: number;
  savingsVsBuying: number;
  breakEvenDays: number;
  recommendation: string;
};

export type SanitationResults = {
  rentalSubtotal: number;
  servicingSubtotal: number;
  totalServicePackageCost: number;
  upfrontCost: number;
  truePackageCost: number;
  savingsVsBuying: number;
  breakEvenMonths: number;
  recommendation: string;
};

function isClose(actual: number, target: number, threshold = 0.15): boolean {
  if (target <= 0) return false;
  const ratio = actual / target;
  return ratio >= 1 - threshold && ratio <= 1 + threshold;
}

export function calculateStandard(inputs: StandardInputs): StandardResults {
  const rentalSubtotal = inputs.dailyRate * inputs.rentalDays;
  const trueRentalCost =
    rentalSubtotal + inputs.deliveryFee + inputs.supportFee;
  const totalCashNeeded = trueRentalCost + inputs.deposit;
  const savingsVsBuying = inputs.purchaseCost - trueRentalCost;
  const breakEvenDays =
    inputs.dailyRate > 0
      ? Math.ceil(inputs.purchaseCost / inputs.dailyRate)
      : 0;

  let recommendation = "Enter valid rates to see a recommendation.";
  if (inputs.dailyRate > 0 && inputs.purchaseCost > 0) {
    if (inputs.rentalDays < breakEvenDays && !isClose(inputs.rentalDays, breakEvenDays)) {
      recommendation = "Renting is likely the better option.";
    } else if (
      isClose(inputs.rentalDays, breakEvenDays) ||
      inputs.rentalDays === breakEvenDays
    ) {
      recommendation = "Compare long-term use before deciding.";
    } else if (inputs.rentalDays > breakEvenDays) {
      recommendation = "Buying may be worth considering.";
    }
  }

  return {
    rentalSubtotal,
    totalCashNeeded,
    trueRentalCost,
    savingsVsBuying,
    breakEvenDays,
    recommendation,
  };
}

export function calculateSanitation(
  inputs: SanitationInputs
): SanitationResults {
  const rentalSubtotal =
    inputs.monthlyRental * inputs.units * inputs.months;
  const servicingSubtotal =
    inputs.servicingFee *
    inputs.units *
    inputs.servicingFrequency *
    inputs.months;
  const totalServicePackageCost =
    rentalSubtotal +
    servicingSubtotal +
    inputs.installationFee +
    inputs.consumablesFee;
  const firstMonthRental = inputs.monthlyRental * inputs.units;
  const firstMonthServicing =
    inputs.servicingFee * inputs.units * inputs.servicingFrequency;
  const upfrontCost =
    inputs.installationFee +
    inputs.deposit +
    firstMonthRental +
    firstMonthServicing +
    inputs.consumablesFee;
  const truePackageCost = totalServicePackageCost;
  const savingsVsBuying = inputs.purchaseCost - truePackageCost;
  const breakEvenMonths =
    inputs.monthlyRental > 0
      ? Math.ceil(inputs.purchaseCost / inputs.monthlyRental)
      : 0;

  let recommendation = "Enter valid rates to see a recommendation.";
  if (inputs.monthlyRental > 0 && inputs.purchaseCost > 0) {
    if (
      inputs.months < breakEvenMonths &&
      !isClose(inputs.months, breakEvenMonths)
    ) {
      recommendation =
        "Rental with servicing is likely the better option.";
    } else if (
      isClose(inputs.months, breakEvenMonths) ||
      inputs.months === breakEvenMonths
    ) {
      recommendation =
        "Compare long-term ownership, servicing, and consumables before deciding.";
    } else if (inputs.months > breakEvenMonths) {
      recommendation =
        "Buying may be worth considering, but servicing and compliance costs should still be factored in.";
    }
  }

  return {
    rentalSubtotal,
    servicingSubtotal,
    totalServicePackageCost,
    upfrontCost,
    truePackageCost,
    savingsVsBuying,
    breakEvenMonths,
    recommendation,
  };
}

export function getEquipmentById(id: EquipmentTypeId): EquipmentType {
  return EQUIPMENT_TYPES.find((e) => e.id === id) ?? EQUIPMENT_TYPES[0];
}
