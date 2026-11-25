import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContratoForm } from "../contrato-form";
import { updateContrato } from "../actions";
import { MovimientosManager } from "../../movimientos/movimientos-manager";
import { ComprobantesManager } from "../../facturacion/comprobantes-manager";

export default async function ContratoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: contrato },
    { data: inmuebles },
    { data: inquilinos },
    { data: propietarios },
    { data: garantes },
    { data: contratoGarantes },
    { data: actualizaciones },
    { data: movimientos },
    { data: comprobantes },
  ] = await Promise.all([
    supabase.from("contratos").select("*").eq("id", id).maybeSingle(),
    supabase.from("inmuebles").select("id, direccion").order("direccion"),
    supabase.from("inquilinos").select("id, nombre").order("nombre"),
    supabase.from("propietarios").select("id, nombre").order("nombre"),
    supabase.from("garantes").select("id, nombre").order("nombre"),
    supabase.from("contrato_garantes").select("garante_id").eq("contrato_id", id),
    supabase
      .from("actualizaciones_contrato")
      .select("*")
      .eq("contrato_id", id)
      .order("fecha_aplicacion", { ascending: false }),
    supabase.from("movimientos").select("*").eq("contrato_id", id).order("fecha", { ascending: false }),
    supabase
      .from("comprobantes")
      .select("*, movimientos!inner(contrato_id, fecha, monto)")
      .eq("movimientos.contrato_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!contrato) {
    notFound();
  }

  const movimientoRows = (movimientos ?? []).map((m) => ({
    id: m.id,
    contrato_id: m.contrato_id,
    fecha: m.fecha,
    tipo: m.tipo,
    monto: m.monto,
    medio_pago: m.medio_pago,
    estado: m.estado,
    notas: m.notas,
  }));

  const comprobanteRows = (comprobantes ?? []).map((c) => ({
    id: c.id,
    movimiento_id: c.movimiento_id,
    movimiento_label: `${c.movimientos?.fecha ?? ""} - $${c.movimientos?.monto ?? ""}`,
    tipo_comprobante: c.tipo_comprobante,
    punto_venta: c.punto_venta,
    numero: c.numero,
    cae: c.cae,
    estado: c.estado,
  }));

  const movimientoOptions = movimientoRows.map((m) => ({
    id: m.id,
    label: `${m.fecha} - $${m.monto}`,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Contrato ${contrato.carpeta ?? ""}`.trim()}
        description={contrato.codigo ? `Codigo: ${contrato.codigo}` : undefined}
      />
      <Tabs defaultValue="datos">
        <TabsList>
          <TabsTrigger value="datos">Datos</TabsTrigger>
          <TabsTrigger value="actualizaciones">Actualizaciones</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="comprobantes">Comprobantes</TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="mt-4">
          <ContratoForm
            action={updateContrato.bind(null, id)}
            defaults={contrato}
            inmuebles={(inmuebles ?? []).map((i) => ({ id: i.id, label: i.direccion }))}
            inquilinos={(inquilinos ?? []).map((i) => ({ id: i.id, label: i.nombre }))}
            propietarios={(propietarios ?? []).map((p) => ({ id: p.id, label: p.nombre }))}
            garantes={(garantes ?? []).map((g) => ({ id: g.id, label: g.nombre }))}
            selectedGaranteIds={(contratoGarantes ?? []).map((g) => g.garante_id)}
            submitLabel="Guardar cambios"
          />
        </TabsContent>

        <TabsContent value="actualizaciones" className="mt-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Indice</TableHead>
                  <TableHead>Valor anterior</TableHead>
                  <TableHead>Valor nuevo</TableHead>
                  <TableHead>Variacion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(actualizaciones ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Todavia no se aplicaron actualizaciones.
                    </TableCell>
                  </TableRow>
                )}
                {(actualizaciones ?? []).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.fecha_aplicacion}</TableCell>
                    <TableCell>{a.indice_usado}</TableCell>
                    <TableCell>{a.valor_anterior}</TableCell>
                    <TableCell>{a.valor_nuevo}</TableCell>
                    <TableCell>{a.variacion_pct}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="movimientos" className="mt-4">
          <MovimientosManager rows={movimientoRows} fixedContratoId={id} />
        </TabsContent>

        <TabsContent value="comprobantes" className="mt-4">
          <ComprobantesManager rows={comprobanteRows} movimientoOptions={movimientoOptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
