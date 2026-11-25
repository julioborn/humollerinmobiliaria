import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ActionPanel, type ActionPanelItem } from "@/components/inicio/action-panel";
import { MonthlyCollectionsChart } from "@/components/inicio/monthly-collections-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatARS, formatDateShort, diasRestantes, labelRelativo, pluralizar } from "@/lib/format";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfMonthsAgo(months: number) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - months);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function InicioPage() {
  const supabase = await createClient();

  const today = new Date();
  const todayStr = toDateInputValue(today);
  const in14 = toDateInputValue(new Date(today.getTime() + 14 * 86_400_000));
  const in30 = toDateInputValue(new Date(today.getTime() + 30 * 86_400_000));
  const sixMonthsAgo = toDateInputValue(startOfMonthsAgo(5));

  const [
    { count: inmueblesCount },
    { count: contratosActivosCount },
    { data: vencenPronto, count: vencenCount },
    { data: pagosPendientes, count: pendientesCount },
    { data: actualizaciones, count: actualizacionesCount },
    { data: cobrosSerie },
  ] = await Promise.all([
    supabase.from("inmuebles").select("*", { count: "exact", head: true }),
    supabase.from("contratos").select("*", { count: "exact", head: true }).eq("estado", "activo"),
    supabase
      .from("contratos")
      .select("id, carpeta, fecha_fin, inmuebles(direccion), inquilinos(nombre)", { count: "exact" })
      .eq("estado", "activo")
      .gte("fecha_fin", todayStr)
      .lte("fecha_fin", in14)
      .order("fecha_fin")
      .limit(5),
    supabase
      .from("movimientos")
      .select("id, fecha, monto, tipo, contrato_id, contratos(carpeta, inmuebles(direccion))", {
        count: "exact",
      })
      .eq("estado", "pendiente")
      .order("fecha")
      .limit(5),
    supabase
      .from("contratos")
      .select("id, carpeta, proxima_actualizacion, indice_actualizacion, inmuebles(direccion)", {
        count: "exact",
      })
      .eq("estado", "activo")
      .neq("indice_actualizacion", "FIJO")
      .gte("proxima_actualizacion", todayStr)
      .lte("proxima_actualizacion", in30)
      .order("proxima_actualizacion")
      .limit(5),
    supabase
      .from("movimientos")
      .select("fecha, monto")
      .eq("tipo", "cobro_inquilino")
      .eq("estado", "pagado")
      .gte("fecha", sixMonthsAgo),
  ]);

  const totalPendienteCobro = (pagosPendientes ?? [])
    .filter((m) => m.tipo === "cobro_inquilino")
    .reduce((acc, m) => acc + Number(m.monto), 0);

  const vencenItems: ActionPanelItem[] = (vencenPronto ?? []).map((c) => {
    const dias = diasRestantes(c.fecha_fin!);
    return {
      id: c.id,
      href: `/contratos/${c.id}`,
      primary: c.inmuebles?.direccion ?? "Inmueble sin direccion",
      secondary: `Carpeta ${c.carpeta ?? "-"} · ${c.inquilinos?.nombre ?? "-"}`,
      meta: labelRelativo(dias),
      metaTone: dias <= 3 ? "urgent" : "warning",
    };
  });

  const pendientesItems: ActionPanelItem[] = (pagosPendientes ?? []).map((m) => ({
    id: m.id,
    href: `/contratos/${m.contrato_id}`,
    primary: `${m.contratos?.carpeta ? `Carpeta ${m.contratos.carpeta} · ` : ""}${m.contratos?.inmuebles?.direccion ?? ""}`,
    secondary: m.tipo === "cobro_inquilino" ? "Cobro a inquilino" : "Pago a propietario",
    meta: formatARS(Number(m.monto)),
  }));

  const actualizacionesItems: ActionPanelItem[] = (actualizaciones ?? []).map((c) => ({
    id: c.id,
    href: `/contratos/${c.id}`,
    primary: c.inmuebles?.direccion ?? "Inmueble sin direccion",
    secondary: `Carpeta ${c.carpeta ?? "-"} · Indice ${c.indice_actualizacion}`,
    meta: formatDateShort(c.proxima_actualizacion!),
  }));

  const monthFormatter = new Intl.DateTimeFormat("es-AR", { month: "short" });
  const monthlyTotals = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = startOfMonthsAgo(i);
    monthlyTotals.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
  }
  for (const m of cobrosSerie ?? []) {
    const d = new Date(`${m.fecha}T00:00:00`);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (monthlyTotals.has(key)) {
      monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + Number(m.monto));
    }
  }
  const chartData = Array.from(monthlyTotals.entries()).map(([key, value]) => {
    const [year, month] = key.split("-").map(Number);
    return { label: monthFormatter.format(new Date(year, month, 1)), value };
  });

  const todayLabel = today.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inicio"
        description={todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1)}
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        <div className="flex flex-col gap-0.5 bg-card px-5 py-4">
          <span className="text-2xl font-semibold tabular-nums">{inmueblesCount ?? 0}</span>
          <span className="text-xs text-muted-foreground">Inmuebles</span>
        </div>
        <div className="flex flex-col gap-0.5 bg-card px-5 py-4">
          <span className="text-2xl font-semibold tabular-nums">{contratosActivosCount ?? 0}</span>
          <span className="text-xs text-muted-foreground">Contratos activos</span>
        </div>
        <div className="flex flex-col gap-0.5 bg-card px-5 py-4">
          <span
            className={
              totalPendienteCobro > 0
                ? "text-2xl font-semibold tabular-nums text-destructive"
                : "text-2xl font-semibold tabular-nums"
            }
          >
            {formatARS(totalPendienteCobro)}
          </span>
          <span className="text-xs text-muted-foreground">Pendiente de cobro</span>
        </div>
        <div className="flex flex-col gap-0.5 bg-card px-5 py-4">
          <span
            className={
              (vencenCount ?? 0) > 0
                ? "text-2xl font-semibold tabular-nums text-destructive"
                : "text-2xl font-semibold tabular-nums"
            }
          >
            {vencenCount ?? 0}
          </span>
          <span className="text-xs text-muted-foreground">
            {pluralizar(vencenCount ?? 0, "vence", "vencen")} en 14 dias
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActionPanel
          title="Vencen pronto"
          totalCount={vencenCount ?? 0}
          items={vencenItems}
          emptyText="Sin contratos por vencer en los proximos 14 dias."
          viewAllHref="/reportes"
        />
        <ActionPanel
          title="Cobros y pagos pendientes"
          totalCount={pendientesCount ?? 0}
          items={pendientesItems}
          emptyText="No hay movimientos pendientes."
          viewAllHref="/movimientos"
        />
        <ActionPanel
          title="Proximas actualizaciones"
          totalCount={actualizacionesCount ?? 0}
          items={actualizacionesItems}
          emptyText="Sin actualizaciones de indice previstas en 30 dias."
          viewAllHref="/configuracion"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Cobros de los ultimos 6 meses</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyCollectionsChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
