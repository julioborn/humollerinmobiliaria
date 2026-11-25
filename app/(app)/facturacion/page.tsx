import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { ComprobantesManager } from "./comprobantes-manager";

export default async function FacturacionPage() {
  const supabase = await createClient();
  const [{ data: comprobantes }, { data: movimientos }] = await Promise.all([
    supabase
      .from("comprobantes")
      .select("*, movimientos(fecha, monto, contratos(carpeta, inmuebles(direccion)))")
      .order("created_at", { ascending: false }),
    supabase
      .from("movimientos")
      .select("id, fecha, monto, contratos(carpeta, inmuebles(direccion))")
      .order("fecha", { ascending: false }),
  ]);

  const rows = (comprobantes ?? []).map((c) => ({
    id: c.id,
    movimiento_id: c.movimiento_id,
    movimiento_label: `${c.movimientos?.contratos?.carpeta ?? ""} ${c.movimientos?.contratos?.inmuebles?.direccion ?? ""} - ${c.movimientos?.fecha ?? ""}`.trim(),
    tipo_comprobante: c.tipo_comprobante,
    punto_venta: c.punto_venta,
    numero: c.numero,
    cae: c.cae,
    estado: c.estado,
  }));

  const movimientoOptions = (movimientos ?? []).map((m) => ({
    id: m.id,
    label: `${m.contratos?.carpeta ?? ""} ${m.contratos?.inmuebles?.direccion ?? ""} - ${m.fecha} - $${m.monto}`.trim(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Facturacion electronica" description="Comprobantes asociados a los movimientos de los contratos." />
      <Alert>
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Pendiente de credenciales de ARCA</AlertTitle>
        <AlertDescription>
          Para emitir comprobantes reales necesitamos el CUIT, el certificado digital y el punto de
          venta de Humoller Inmobiliaria. Hasta entonces, los comprobantes quedan registrados en
          estado &quot;Pendiente credenciales ARCA&quot;.
        </AlertDescription>
      </Alert>
      <ComprobantesManager rows={rows} movimientoOptions={movimientoOptions} />
    </div>
  );
}
