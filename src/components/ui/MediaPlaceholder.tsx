type MediaPlaceholderProps = {
  seed: string;
  label?: string;
  className?: string;
  overlay?: "bottom" | "hero" | "none";
};

const GRADIENTS: Record<string, string> = {
  hero: "bg-gradient-to-br from-[#1a2835] via-[#0f1a24] to-[#07111a]",
  warehouse: "bg-gradient-to-br from-[#1e2d3a] via-[#152028] to-[#0a1218]",
  cranes: "bg-gradient-to-br from-[#2a3540] via-[#1a2530] to-[#0c151d]",
  logistics: "bg-gradient-to-br from-[#1a3048] via-[#122030] to-[#0a1018]",
  power: "bg-gradient-to-br from-[#252018] via-[#1a1810] to-[#0e0c08]",
  control: "bg-gradient-to-br from-[#1a2838] via-[#121c28] to-[#080e14]",
  hub: "bg-gradient-to-br from-[#1c2832] via-[#141e26] to-[#0a1016]",
  consulting: "bg-gradient-to-br from-[#243040] via-[#182430] to-[#0c141c]",
};

export function MediaPlaceholder({
  seed,
  label,
  className = "",
  overlay = "bottom",
}: MediaPlaceholderProps) {
  const gradient = GRADIENTS[seed] ?? GRADIENTS.warehouse;

  return (
    <div
      role="img"
      aria-label={label ?? seed}
      className={`relative overflow-hidden ${gradient} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-12deg, transparent, transparent 14px, rgba(0,198,255,0.03) 14px, rgba(0,198,255,0.03) 15px)",
        }}
      />
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-secondary/8 blur-3xl" />

      {overlay === "hero" && <div className="gradient-overlay-hero absolute inset-0" />}
      {overlay === "bottom" && <div className="gradient-overlay-bottom absolute inset-0" />}
    </div>
  );
}
