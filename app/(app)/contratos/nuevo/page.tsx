import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { ContratoForm } from "../contrato-form";
import { createContrato } from "../actions";

export default async function NuevoContratoPage() {
  const supabase = await createClient();
  const [{ data: inmuebles }, { data: inquilinos }, { data: propietarios }, { data: garantes }] =
    await Promise.all([
      supabase.from("inmuebles").select("id, direccion").order("direccion"),
      supabase.from("inquilinos").select("id, nombre").order("nombre"),
      supabase.from("propietarios").select("id, nombre").order("nombre"),
      supabase.from("garantes").select("id, nombre").order("nombre"),
    ]);

  return (
    <div>
      <PageHeader title="Nuevo contrato" description="Carga los datos del nuevo contrato de alquiler." />
      <ContratoForm
        action={createContrato}
        inmuebles={(inmuebles ?? []).map((i) => ({ id: i.id, label: i.direccion }))}
        inquilinos={(inquilinos ?? []).map((i) => ({ id: i.id, label: i.nombre }))}
        propietarios={(propietarios ?? []).map((p) => ({ id: p.id, label: p.nombre }))}
        garantes={(garantes ?? []).map((g) => ({ id: g.id, label: g.nombre }))}
        submitLabel="Crear contrato"
      />
    </div>
  );
}
