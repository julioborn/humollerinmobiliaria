import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExportCsvButton } from "@/components/export-csv-button";

export default async function ReportesPage() {
  const supabase = await createClient();
  const today = new Date();
  const in60 = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
  const todayStr = today.toISOString().slice(0, 10);
  const in60Str = in60.toISOString().slice(0, 10);

  const [{ data: vencimientos }, { data: actualizaciones }, { data: pendientes }] = await Promise.all([
    supabase
      .from("contratos")
      .select("carpeta, fecha_fin, inmuebles(direccion), inquilinos(nombre)")
      .eq("estado", "activo")
      .gte("fecha_fin", todayStr)
      .lte("fecha_fin", in60Str)
      .order("fecha_fin"),
    supabase
      .from("contratos")
      .select("carpeta, proxima_actualizacion, indice_actualizacion, inmuebles(direccion)")
      .eq("estado", "activo")
      .gte("proxima_actualizacion", todayStr)
      .lte("proxima_actualizacion", in60Str)
      .order("proxima_actualizacion"),
    supabase
      .from("movimientos")
      .select("fecha, tipo, monto, contratos(carpeta, inmuebles(direccion))")
      .eq("estado", "pendiente")
      .order("fecha"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Reportes" description="Vencimientos, actualizaciones y pagos pendientes." />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contratos por vencer (60 dias)</CardTitle>
          <ExportCsvButton
            filename="contratos-por-vencer.csv"
            headers={["Carpeta", "Inmueble", "Inquilino", "Fecha fin"]}
            rows={(vencimientos ?? []).map((v) => [
              v.carpeta ?? "",
              v.inmuebles?.direccion ?? "",
              v.inquilinos?.nombre ?? "",
              v.fecha_fin ?? "",
            ])}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carpeta</TableHead>
                <TableHead>Inmueble</TableHead>
                <TableHead>Inquilino</TableHead>
                <TableHead>Fecha fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(vencimientos ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                    Sin contratos por vencer en los proximos 60 dias.
                  </TableCell>
                </TableRow>
              )}
              {(vencimientos ?? []).map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{v.carpeta ?? "-"}</TableCell>
                  <TableCell>{v.inmuebles?.direccion ?? "-"}</TableCell>
                  <TableCell>{v.inquilinos?.nombre ?? "-"}</TableCell>
                  <TableCell>{v.fecha_fin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Proximas actualizaciones de indice (60 dias)</CardTitle>
          <ExportCsvButton
            filename="proximas-actualizaciones.csv"
            headers={["Carpeta", "Inmueble", "Indice", "Fecha"]}
            rows={(actualizaciones ?? []).map((a) => [
              a.carpeta ?? "",
              a.inmuebles?.direccion ?? "",
              a.indice_actualizacion,
              a.proxima_actualizacion ?? "",
            ])}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carpeta</TableHead>
                <TableHead>Inmueble</TableHead>
                <TableHead>Indice</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(actualizaciones ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                    Sin actualizaciones previstas en los proximos 60 dias.
                  </TableCell>
                </TableRow>
              )}
              {(actualizaciones ?? []).map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.carpeta ?? "-"}</TableCell>
                  <TableCell>{a.inmuebles?.direccion ?? "-"}</TableCell>
                  <TableCell>{a.indice_actualizacion}</TableCell>
                  <TableCell>{a.proxima_actualizacion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Movimientos pendientes</CardTitle>
          <ExportCsvButton
            filename="movimientos-pendientes.csv"
            headers={["Fecha", "Contrato", "Tipo", "Monto"]}
            rows={(pendientes ?? []).map((p) => [
              p.fecha,
              `${p.contratos?.carpeta ?? ""} ${p.contratos?.inmuebles?.direccion ?? ""}`.trim(),
              p.tipo,
              p.monto,
            ])}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(pendientes ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                    Sin movimientos pendientes.
                  </TableCell>
                </TableRow>
              )}
              {(pendientes ?? []).map((p, i) => (
                <TableRow key={i}>
                  <TableCell>{p.fecha}</TableCell>
                  <TableCell>
                    {p.contratos?.carpeta ?? ""} {p.contratos?.inmuebles?.direccion ?? ""}
                  </TableCell>
                  <TableCell>{p.tipo}</TableCell>
                  <TableCell>{Number(p.monto).toLocaleString("es-AR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
