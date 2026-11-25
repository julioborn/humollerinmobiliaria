import { formatARS } from "@/lib/format";

export function MonthlyCollectionsChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 0);

  if (max === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Todavia no hay cobros registrados para mostrar la evolucion mensual.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end gap-3 border-b border-border">
        {data.map((d) => {
          const pct = d.value > 0 ? Math.max((d.value / max) * 100, 4) : 0;
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {d.value > 0 ? formatCompact(d.value) : ""}
              </span>
              <div className="flex h-28 w-full items-end justify-center">
                <div
                  title={formatARS(d.value)}
                  className="w-full max-w-10 rounded-t-sm bg-primary transition-opacity hover:opacity-80"
                  style={{ height: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        {data.map((d) => (
          <span
            key={d.label}
            className="flex-1 text-center text-[11px] capitalize text-muted-foreground"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}
