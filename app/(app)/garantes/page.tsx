import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EntityManager, type EntityColumn, type EntityField } from "@/components/crud/entity-manager";
import { createGarante, updateGarante, deleteGarante } from "./actions";

const columns: EntityColumn[] = [
  { key: "nombre", label: "Nombre" },
  { key: "cuit_dni", label: "CUIT/DNI" },
  { key: "telefono", label: "Telefono" },
  { key: "direccion", label: "Direccion" },
];

const fields: EntityField[] = [
  { name: "nombre", label: "Nombre", required: true },
  { name: "cuit_dni", label: "CUIT/DNI" },
  { name: "telefono", label: "Telefono" },
  { name: "direccion", label: "Direccion" },
  { name: "notas", label: "Notas", type: "textarea" },
];

export default async function GarantesPage() {
  const supabase = await createClient();
  const { data: garantes } = await supabase.from("garantes").select("*").order("nombre");

  return (
    <div>
      <PageHeader title="Garantes" description="Garantes asociados a los contratos de alquiler." />
      <EntityManager
        entityLabel="Garante"
        entityLabelPlural="Garantes"
        columns={columns}
        fields={fields}
        rows={garantes ?? []}
        onCreate={createGarante}
        onUpdate={updateGarante}
        onDelete={deleteGarante}
      />
    </div>
  );
}
