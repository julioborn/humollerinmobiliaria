import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium text-secondary-foreground">{label}</span>
        <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
      </div>
      <span className="text-stat-value tabular-nums text-foreground">{value}</span>
    </Link>
  );
}
