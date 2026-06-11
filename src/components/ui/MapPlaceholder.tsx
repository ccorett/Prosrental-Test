import { MapPin } from "lucide-react";

type MapPlaceholderProps = {
  location: string;
  className?: string;
};

export function MapPlaceholder({ location, className = "" }: MapPlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#1a2838] via-[#121c28] to-[#080e14] ${className}`}
      role="img"
      aria-label={`Map placeholder for ${location}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,198,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,198,255,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <MapPin className="h-6 w-6" aria-hidden />
        </span>
        <p className="label-caps text-accent">Location</p>
        <p className="text-lg font-semibold text-foreground">{location}</p>
        <p className="max-w-xs text-sm text-muted">Interactive map coming soon</p>
      </div>
    </div>
  );
}
