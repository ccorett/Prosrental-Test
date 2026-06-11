"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import {
  EQUIPMENT_TYPES,
  RENTAL_CATEGORIES,
  SANITATION_DEFAULTS,
  STANDARD_DEFAULTS,
  calculateSanitation,
  calculateStandard,
  getEquipmentById,
  type EquipmentTypeId,
  type RentalCategory,
  type SanitationDefaults,
  type StandardDefaults,
} from "@/lib/rental-estimator";
import { cn, formatTTD, parseAmount } from "@/lib/utils";

const INPUT_CLASS =
  "mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const DISCLAIMER =
  "Estimates are for guidance only. Final pricing may vary based on availability, delivery, servicing frequency, consumables, duration, and equipment condition.";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  min?: number;
  step?: string;
};

function Field({ label, value, onChange, hint, min = 0, step = "1" }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    </label>
  );
}

type ResultRowProps = {
  label: string;
  value: number;
  highlight?: boolean;
};

function ResultRow({ label, value, highlight }: ResultRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0",
        highlight && "text-accent"
      )}
    >
      <span className="text-sm text-muted">{label}</span>
      <span
        className={cn(
          "font-mono text-sm font-medium tabular-nums",
          highlight ? "text-accent" : "text-foreground"
        )}
      >
        {formatTTD(value)}
      </span>
    </div>
  );
}

function defaultsToStandardStrings(d: StandardDefaults) {
  return {
    dailyRate: String(d.dailyRate),
    rentalDays: String(d.rentalDays),
    deliveryFee: String(d.deliveryFee),
    deposit: String(d.deposit),
    supportFee: String(d.supportFee),
    purchaseCost: String(d.purchaseCost),
  };
}

function defaultsToSanitationStrings(d: SanitationDefaults) {
  return {
    monthlyRental: String(d.monthlyRental),
    units: String(d.units),
    months: String(d.months),
    servicingFee: String(d.servicingFee),
    servicingFrequency: String(d.servicingFrequency),
    installationFee: String(d.installationFee),
    consumablesFee: String(d.consumablesFee),
    deposit: String(d.deposit),
    purchaseCost: String(d.purchaseCost),
  };
}

type RentalCostEstimatorProps = {
  className?: string;
  id?: string;
};

export function RentalCostEstimator({
  className,
  id = "rental-cost-estimator",
}: RentalCostEstimatorProps) {
  const [equipmentId, setEquipmentId] = useState<EquipmentTypeId>("pressure-washer");
  const [category, setCategory] = useState<RentalCategory>("standard");

  const [standard, setStandard] = useState(() =>
    defaultsToStandardStrings(STANDARD_DEFAULTS["pressure-washer"])
  );
  const [sanitation, setSanitation] = useState(() =>
    defaultsToSanitationStrings(SANITATION_DEFAULTS["sanitary-bin"])
  );

  function applyEquipment(id: EquipmentTypeId) {
    const equipment = getEquipmentById(id);
    setEquipmentId(id);
    setCategory(equipment.category);
    if (equipment.category === "standard") {
      setStandard(defaultsToStandardStrings(STANDARD_DEFAULTS[id]));
    } else {
      setSanitation(defaultsToSanitationStrings(SANITATION_DEFAULTS[id]));
    }
  }

  function handleCategoryChange(next: RentalCategory) {
    setCategory(next);
    if (next === "standard") {
      setStandard(defaultsToStandardStrings(STANDARD_DEFAULTS[equipmentId]));
    } else {
      setSanitation(defaultsToSanitationStrings(SANITATION_DEFAULTS[equipmentId]));
    }
  }

  const standardResults = useMemo(
    () =>
      calculateStandard({
        dailyRate: parseAmount(standard.dailyRate),
        rentalDays: parseAmount(standard.rentalDays),
        deliveryFee: parseAmount(standard.deliveryFee),
        deposit: parseAmount(standard.deposit),
        supportFee: parseAmount(standard.supportFee),
        purchaseCost: parseAmount(standard.purchaseCost),
      }),
    [standard]
  );

  const sanitationResults = useMemo(
    () =>
      calculateSanitation({
        monthlyRental: parseAmount(sanitation.monthlyRental),
        units: parseAmount(sanitation.units),
        months: parseAmount(sanitation.months),
        servicingFee: parseAmount(sanitation.servicingFee),
        servicingFrequency: parseAmount(sanitation.servicingFrequency),
        installationFee: parseAmount(sanitation.installationFee),
        consumablesFee: parseAmount(sanitation.consumablesFee),
        deposit: parseAmount(sanitation.deposit),
        purchaseCost: parseAmount(sanitation.purchaseCost),
      }),
    [sanitation]
  );

  const isSanitation = category === "sanitation";

  return (
    <div id={id} className={cn("scroll-mt-24", className)}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="card-industrial space-y-6 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border/60 pb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Calculator className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Inputs</h3>
              <p className="text-sm text-muted">Adjust values for your scenario</p>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-foreground">Equipment type</span>
            <select
              value={equipmentId}
              onChange={(e) => applyEquipment(e.target.value as EquipmentTypeId)}
              className={INPUT_CLASS}
            >
              {EQUIPMENT_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-foreground">
              Equipment category
            </span>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as RentalCategory)}
              className={INPUT_CLASS}
            >
              {RENTAL_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {isSanitation ? (
            <div className="space-y-5 border-t border-border/60 pt-5">
              <p className="text-sm leading-relaxed text-muted">
                Sanitation and hygiene rentals include equipment rental plus
                recurring servicing—compare the full service package to buying
                outright.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Monthly rental fee (per unit)"
                  value={sanitation.monthlyRental}
                  onChange={(v) => setSanitation((s) => ({ ...s, monthlyRental: v }))}
                  step="0.01"
                />
                <Field
                  label="Number of units"
                  value={sanitation.units}
                  onChange={(v) => setSanitation((s) => ({ ...s, units: v }))}
                />
                <Field
                  label="Number of months"
                  value={sanitation.months}
                  onChange={(v) => setSanitation((s) => ({ ...s, months: v }))}
                />
                <Field
                  label="Servicing fee per unit"
                  value={sanitation.servicingFee}
                  onChange={(v) => setSanitation((s) => ({ ...s, servicingFee: v }))}
                  step="0.01"
                />
                <Field
                  label="Servicing frequency per month"
                  value={sanitation.servicingFrequency}
                  onChange={(v) =>
                    setSanitation((s) => ({ ...s, servicingFrequency: v }))
                  }
                />
                <Field
                  label="Installation / setup fee"
                  value={sanitation.installationFee}
                  onChange={(v) => setSanitation((s) => ({ ...s, installationFee: v }))}
                  step="0.01"
                />
                <Field
                  label="Consumables fee"
                  value={sanitation.consumablesFee}
                  onChange={(v) => setSanitation((s) => ({ ...s, consumablesFee: v }))}
                  step="0.01"
                />
                <Field
                  label="Refundable deposit"
                  value={sanitation.deposit}
                  onChange={(v) => setSanitation((s) => ({ ...s, deposit: v }))}
                  step="0.01"
                />
                <Field
                  label="Estimated purchase cost"
                  value={sanitation.purchaseCost}
                  onChange={(v) => setSanitation((s) => ({ ...s, purchaseCost: v }))}
                  step="0.01"
                  hint="Total cost if you bought all units"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-5 border-t border-border/60 pt-5 sm:grid-cols-2">
              <Field
                label="Daily rental rate"
                value={standard.dailyRate}
                onChange={(v) => setStandard((s) => ({ ...s, dailyRate: v }))}
                step="0.01"
              />
              <Field
                label="Number of rental days"
                value={standard.rentalDays}
                onChange={(v) => setStandard((s) => ({ ...s, rentalDays: v }))}
              />
              <Field
                label="Delivery fee"
                value={standard.deliveryFee}
                onChange={(v) => setStandard((s) => ({ ...s, deliveryFee: v }))}
                step="0.01"
              />
              <Field
                label="Refundable deposit"
                value={standard.deposit}
                onChange={(v) => setStandard((s) => ({ ...s, deposit: v }))}
                step="0.01"
              />
              <Field
                label="Support / operator fee (optional)"
                value={standard.supportFee}
                onChange={(v) => setStandard((s) => ({ ...s, supportFee: v }))}
                step="0.01"
              />
              <Field
                label="Estimated purchase cost"
                value={standard.purchaseCost}
                onChange={(v) => setStandard((s) => ({ ...s, purchaseCost: v }))}
                step="0.01"
              />
            </div>
          )}
        </div>

        <div className="card-industrial flex flex-col p-6 glow-accent sm:p-8">
          <div className="border-b border-border/60 pb-5">
            <p className="label-caps text-accent">Estimate</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">Your results</h3>
          </div>

          <div className="mt-4 flex-1">
            {isSanitation ? (
              <>
                <ResultRow
                  label="Rental subtotal"
                  value={sanitationResults.rentalSubtotal}
                />
                <ResultRow
                  label="Servicing subtotal"
                  value={sanitationResults.servicingSubtotal}
                />
                <ResultRow
                  label="Total service package cost"
                  value={sanitationResults.totalServicePackageCost}
                  highlight
                />
                <ResultRow
                  label="Estimated upfront cost"
                  value={sanitationResults.upfrontCost}
                />
                <ResultRow
                  label="True package cost"
                  value={sanitationResults.truePackageCost}
                />
                <ResultRow
                  label="Savings vs buying"
                  value={sanitationResults.savingsVsBuying}
                />
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-muted">Break-even months</span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {sanitationResults.breakEvenMonths > 0
                      ? sanitationResults.breakEvenMonths
                      : "—"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <ResultRow
                  label="Rental subtotal"
                  value={standardResults.rentalSubtotal}
                />
                <ResultRow
                  label="Total cash needed upfront"
                  value={standardResults.totalCashNeeded}
                  highlight
                />
                <ResultRow
                  label="True rental cost"
                  value={standardResults.trueRentalCost}
                />
                <ResultRow
                  label="Savings vs buying"
                  value={standardResults.savingsVsBuying}
                />
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-muted">Break-even rental days</span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {standardResults.breakEvenDays > 0
                      ? standardResults.breakEvenDays
                      : "—"}
                  </span>
                </div>
              </>
            )}
          </div>

          <div
            className={cn(
              "mt-6 rounded-xl border p-4",
              isSanitation
                ? "border-secondary/40 bg-secondary-muted"
                : "border-accent/40 bg-accent-muted"
            )}
          >
            <p className="label-caps text-foreground">Smart recommendation</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {isSanitation
                ? sanitationResults.recommendation
                : standardResults.recommendation}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
    </div>
  );
}
