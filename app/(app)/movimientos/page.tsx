import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { MovimientosManager } from "./movimientos-manager";

export default async function MovimientosPage() {
  const supabase = await createClient();
  const [{ data: movimientos }, { data: contratos }] = await Promise.all([
    supabase
      .from("movimientos")
      .select("*, contratos(carpeta, inmuebles(direccion))")
      .order("fecha", { ascending: false }),
    supabase
      .from("contratos")
      .select("id, carpeta, inmuebles(direccion)")
      .order("carpeta"),
  ]);

  const rows = (movimientos ?? []).map((m) => ({
    id: m.id,
    contrato_id: m.contrato_id,
    contrato_label: `${m.contratos?.carpeta ?? ""} ${m.contratos?.inmuebles?.direccion ?? ""}`.trim(),
    fecha: m.fecha,
    tipo: m.tipo,
    monto: m.monto,
    medio_pago: m.medio_pago,
    estado: m.estado,
    notas: m.notas,
  }));

  const contratoOptions = (contratos ?? []).map((c) => ({
    id: c.id,
    label: `${c.carpeta ?? ""} ${c.inmuebles?.direccion ?? ""}`.trim(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Movimientos" description="Cobros, pagos, comisiones y gastos de todos los contratos." />
      <MovimientosManager rows={rows} contratoOptions={contratoOptions} />
    </div>
  );
}
