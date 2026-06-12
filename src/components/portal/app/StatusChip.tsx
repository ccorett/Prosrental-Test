import { formatEnumLabel, STATUS_CHIP_STYLES } from "@/lib/portal/labels";
import { cn } from "@/lib/utils";

type StatusChipProps = {
  status: string;
  className?: string;
};

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        STATUS_CHIP_STYLES[status] ?? "border-border bg-surface text-muted",
        className
      )}
    >
      {formatEnumLabel(status)}
    </span>
  );
}
