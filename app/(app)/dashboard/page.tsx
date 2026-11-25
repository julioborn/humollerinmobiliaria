import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, AlertTriangle, Banknote } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date();
  const in60 = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
  const todayStr = today.toISOString().slice(0, 10);
  const in60Str = in60.toISOString().slice(0, 10);

  const [
    { count: inmueblesCount },
    { count: contratosActivosCount },
    { count: vencimientosCount },
    { count: actualizacionesCount },
    { data: movimientosPendientes },
  ] = await Promise.all([
    supabase.from("inmuebles").select("*", { count: "exact", head: true }),
    supabase.from("contratos").select("*", { count: "exact", head: true }).eq("estado", "activo"),
    supabase
      .from("contratos")
      .select("*", { count: "exact", head: true })
      .eq("estado", "activo")
      .gte("fecha_fin", todayStr)
      .lte("fecha_fin", in60Str),
    supabase
      .from("contratos")
      .select("*", { count: "exact", head: true })
      .eq("estado", "activo")
      .gte("proxima_actualizacion", todayStr)
      .lte("proxima_actualizacion", in60Str),
    supabase.from("movimientos").select("monto").eq("estado", "pendiente"),
  ]);

  const montoPendiente = (movimientosPendientes ?? []).reduce((acc, m) => acc + Number(m.monto), 0);

  const stats = [
    { label: "Inmuebles", value: inmueblesCount ?? 0, icon: Building2, href: "/inmuebles" },
    { label: "Contratos activos", value: contratosActivosCount ?? 0, icon: FileText, href: "/contratos" },
    { label: "Vencimientos (60 dias)", value: vencimientosCount ?? 0, icon: AlertTriangle, href: "/reportes" },
    {
      label: "Movimientos pendientes",
      value: `$${montoPendiente.toLocaleString("es-AR")}`,
      icon: Banknote,
      href: "/movimientos",
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Resumen general de RentaControl Online." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-colors hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      {actualizacionesCount && actualizacionesCount > 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Hay {actualizacionesCount} contrato(s) con actualizacion de indice en los proximos 60 dias.
          Ver detalle en{" "}
          <Link href="/reportes" className="font-medium text-primary underline">
            Reportes
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
