import Link from "next/link";
import { Building2, FileText, Wallet, AlarmClock, Plus, Banknote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/inicio/kpi-card";
import { ActionPanel, type ActionPanelItem } from "@/components/inicio/action-panel";
import { formatARS, formatDateShort, diasRestantes, labelRelativo } from "@/lib/format";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function InicioPage() {
  const supabase = await createClient();

  const today = new Date();
  const todayStr = toDateInputValue(today);
  const in14 = toDateInputValue(new Date(today.getTime() + 14 * 86_400_000));
  const in30 = toDateInputValue(new Date(today.getTime() + 30 * 86_400_000));

  const [
    { count: inmueblesCount },
    { count: contratosActivosCount },
    { data: vencenPronto, count: vencenCount },
    { data: pagosPendientes, count: pendientesCount },
    { data: actualizaciones, count: actualizacionesCount },
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
      .limit(8),
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
  ]);

  const totalPendienteCobro = (pagosPendientes ?? [])
    .filter((m) => m.tipo === "cobro_inquilino")
    .reduce((acc, m) => acc + Number(m.monto), 0);

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
        action={
          <Button render={<Link href="/contratos/nuevo" />} nativeButton={false}>
            <Plus className="h-4 w-4" />
            Nuevo contrato
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Inmuebles" value={String(inmueblesCount ?? 0)} icon={Building2} href="/inmuebles" />
        <KpiCard
          label="Contratos activos"
          value={String(contratosActivosCount ?? 0)}
          icon={FileText}
          href="/contratos"
        />
        <KpiCard
          label="Pendiente de cobro"
          value={formatARS(totalPendienteCobro)}
          icon={Wallet}
          href="/movimientos"
        />
        <KpiCard
          label="Contratos por vencer"
          value={String(vencenCount ?? 0)}
          icon={AlarmClock}
          href="/reportes"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" render={<Link href="/inmuebles" />} nativeButton={false}>
          <Plus className="h-4 w-4" />
          Nuevo inmueble
        </Button>
        <Button variant="outline" size="sm" render={<Link href="/inquilinos" />} nativeButton={false}>
          <Plus className="h-4 w-4" />
          Nuevo inquilino
        </Button>
        <Button variant="outline" size="sm" render={<Link href="/movimientos" />} nativeButton={false}>
          <Banknote className="h-4 w-4" />
          Registrar cobro
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-section-title">Contratos por vencer</CardTitle>
            {(vencenCount ?? 0) > 0 && (
              <Badge variant="secondary" className="font-mono">
                {vencenCount}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {vencenPronto && vencenPronto.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inmueble</TableHead>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Carpeta</TableHead>
                    <TableHead className="text-right">Vence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vencenPronto.map((c) => {
                    const dias = diasRestantes(c.fecha_fin!);
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium text-foreground">
                          <Link href={`/contratos/${c.id}`} className="block">
                            {c.inmuebles?.direccion ?? "-"}
                          </Link>
                        </TableCell>
                        <TableCell className="text-secondary-foreground">
                          <Link href={`/contratos/${c.id}`} className="block">
                            {c.inquilinos?.nombre ?? "-"}
                          </Link>
                        </TableCell>
                        <TableCell className="text-secondary-foreground">
                          <Link href={`/contratos/${c.id}`} className="block">
                            {c.carpeta ?? "-"}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/contratos/${c.id}`} className="flex justify-end">
                            <Badge variant={dias <= 3 ? "destructive" : "warning"}>
                              {labelRelativo(dias)}
                            </Badge>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sin contratos por vencer en los proximos 14 dias.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-2">
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
      </div>
    </div>
  );
}
