import type { PortalFeature } from "@/lib/portal";
import { cn } from "@/lib/utils";

const ACCENT_STYLES = {
  accent: "bg-accent/15 text-accent border-accent/30",
  secondary: "bg-secondary/15 text-secondary border-secondary/30",
  tertiary: "bg-tertiary/15 text-tertiary border-tertiary/30",
} as const;

type PortalFeatureCardProps = {
  feature: PortalFeature;
};

export function PortalFeatureCard({ feature }: PortalFeatureCardProps) {
  const Icon = feature.icon;

  return (
    <article className="card-industrial group flex flex-col p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 lg:p-8">
      <span
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-xl border",
          ACCENT_STYLES[feature.accent]
        )}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
      <ul className="mt-4 flex-1 space-y-2">
        {feature.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2 text-sm text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-accent before:content-['']"
          >
            {bullet}
          </li>
        ))}
      </ul>
      <p className="label-caps mt-5 text-muted group-hover:text-accent">
        Coming to your account
      </p>
    </article>
  );
}
