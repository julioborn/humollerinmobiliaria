import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type ActionPanelItem = {
  id: string;
  href: string;
  primary: string;
  secondary: string;
  meta: string;
  metaTone?: "default" | "warning" | "urgent";
};

const metaBadgeVariant = {
  urgent: "destructive",
  warning: "secondary",
} as const;

export function ActionPanel({
  title,
  totalCount,
  items,
  emptyText,
  viewAllHref,
  viewAllLabel = "Ver todos",
}: {
  title: string;
  totalCount: number;
  items: ActionPanelItem[];
  emptyText: string;
  viewAllHref: string;
  viewAllLabel?: string;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {totalCount > 0 && (
          <Badge variant="secondary" className="font-mono">
            {totalCount}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-0.5">
        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
        )}
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-between gap-3 rounded-md px-2 py-2 -mx-2 text-sm transition-colors hover:bg-accent"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium text-foreground">{item.primary}</span>
              <span className="block truncate text-xs text-muted-foreground">{item.secondary}</span>
            </span>
            {item.metaTone === "urgent" || item.metaTone === "warning" ? (
              <Badge variant={metaBadgeVariant[item.metaTone]} className="shrink-0">
                {item.meta}
              </Badge>
            ) : (
              <span className="shrink-0 text-sm font-semibold text-foreground">{item.meta}</span>
            )}
          </Link>
        ))}
        <Link
          href={viewAllHref}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {viewAllLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
