import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContratosTable } from "./contratos-table";

export default async function ContratosPage() {
  const supabase = await createClient();
  const { data: contratos } = await supabase
    .from("contratos")
    .select(
      "id, carpeta, codigo, monto_actual, moneda, estado, inmuebles(direccion), inquilinos(nombre), propietarios(nombre)",
    )
    .order("created_at", { ascending: false });

  const rows = (contratos ?? []).map((c) => ({
    id: c.id,
    carpeta: c.carpeta,
    codigo: c.codigo,
    monto_actual: c.monto_actual,
    moneda: c.moneda,
    estado: c.estado,
    inmueble_direccion: c.inmuebles?.direccion ?? "-",
    inquilino_nombre: c.inquilinos?.nombre ?? "-",
    propietario_nombre: c.propietarios?.nombre ?? "-",
  }));

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader title="Contratos" description="Contratos de alquiler administrados." />
        <Button render={<Link href="/contratos/nuevo" />} nativeButton={false}>
          <Plus className="h-4 w-4" />
          Nuevo contrato
        </Button>
      </div>
      <ContratosTable rows={rows} />
    </div>
  );
}
