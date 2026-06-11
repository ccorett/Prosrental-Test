import { PORTAL_ROADMAP } from "@/lib/portal";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  available: "border-secondary/50 bg-secondary-muted text-secondary",
  "in-progress": "border-accent/50 bg-accent-muted text-accent",
  planned: "border-border bg-surface text-muted",
} as const;

const STATUS_LABELS = {
  available: "Available now",
  "in-progress": "In development",
  planned: "Planned",
} as const;

export function PortalRoadmap() {
  return (
    <div className="space-y-4">
      {PORTAL_ROADMAP.map((item, index) => (
        <article
          key={item.phase}
          className="card-industrial relative flex flex-col gap-3 p-6 sm:flex-row sm:items-start sm:gap-6 lg:p-8"
        >
          <div className="flex shrink-0 items-center gap-3 sm:w-36 sm:flex-col sm:items-start">
            <span className="label-caps text-accent">{item.phase}</span>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                STATUS_STYLES[item.status]
              )}
            >
              {STATUS_LABELS[item.status]}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              {item.description}
            </p>
          </div>
          {index < PORTAL_ROADMAP.length - 1 && (
            <span
              className="absolute -bottom-2 left-8 hidden h-4 w-px bg-border sm:block"
              aria-hidden
            />
          )}
        </article>
      ))}
    </div>
  );
}
