/**
 * Static gradient class names for placeholder media.
 * Listed here so Tailwind's scanner always includes them in the build.
 */
const GRADIENTS = [
  "bg-gradient-to-br from-background via-surface-elevated to-accent/35",
  "bg-gradient-to-tr from-surface via-surface-elevated to-secondary/30",
  "bg-gradient-to-bl from-background via-border to-accent/25",
  "bg-gradient-to-tl from-surface-elevated via-background to-secondary/28",
  "bg-gradient-to-r from-surface to-accent/20",
  "bg-gradient-to-l from-surface-elevated to-secondary/22",
  "bg-gradient-to-br from-background via-surface-elevated to-accent/30",
  "bg-gradient-to-tl from-surface via-border to-secondary/25",
] as const;

export function getPlaceholderGradient(seed: string): string {
  let index = 0;
  for (let i = 0; i < seed.length; i++) {
    index = (index + seed.charCodeAt(i)) % GRADIENTS.length;
  }
  return GRADIENTS[index];
}
