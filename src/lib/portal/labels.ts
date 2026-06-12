export function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const STATUS_CHIP_STYLES: Record<string, string> = {
  ACTIVE: "border-secondary/40 bg-secondary-muted text-secondary",
  PENDING: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  APPROVED: "border-secondary/40 bg-secondary-muted text-secondary",
  REJECTED: "border-border bg-surface text-muted",
  CANCELLED: "border-border bg-surface text-muted",
  DRAFT: "border-border bg-surface text-muted",
  SENT: "border-accent/30 bg-accent/10 text-accent",
  ACCEPTED: "border-secondary/40 bg-secondary-muted text-secondary",
  EXPIRED: "border-border bg-surface text-muted",
  RETURNED: "border-border bg-surface text-muted",
  OVERDUE: "border-red-500/30 bg-red-500/10 text-red-400",
  PAID: "border-secondary/40 bg-secondary-muted text-secondary",
  UNPAID: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  PARTIALLY_PAID: "border-accent/30 bg-accent/10 text-accent",
  OPEN: "border-accent/30 bg-accent/10 text-accent",
  IN_PROGRESS: "border-tertiary/40 bg-tertiary/10 text-tertiary",
  RESOLVED: "border-secondary/40 bg-secondary-muted text-secondary",
  CLOSED: "border-border bg-surface text-muted",
  READ: "border-border bg-surface text-muted",
  UNREAD: "border-accent/30 bg-accent/10 text-accent",
};
