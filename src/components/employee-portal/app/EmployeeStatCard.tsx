import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type EmployeeStatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  href?: string;
};

export function EmployeeStatCard({ label, value, icon: Icon, href }: EmployeeStatCardProps) {
  const content = (
    <div className="card-industrial p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
