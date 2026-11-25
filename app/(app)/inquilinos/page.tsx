import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EntityManager, type EntityColumn, type EntityField } from "@/components/crud/entity-manager";
import { createInquilino, updateInquilino, deleteInquilino } from "./actions";

const columns: EntityColumn[] = [
  { key: "nombre", label: "Nombre" },
  { key: "cuit_dni", label: "CUIT/DNI" },
  { key: "telefono", label: "Telefono" },
  { key: "email", label: "Email" },
];

const fields: EntityField[] = [
  { name: "nombre", label: "Nombre", required: true },
  { name: "cuit_dni", label: "CUIT/DNI" },
  { name: "telefono", label: "Telefono" },
  { name: "email", label: "Email", type: "email" },
  { name: "direccion", label: "Direccion" },
  { name: "notas", label: "Notas", type: "textarea" },
];

export default async function InquilinosPage() {
  const supabase = await createClient();
  const { data: inquilinos } = await supabase.from("inquilinos").select("*").order("nombre");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inquilinos" description="Personas que alquilan los inmuebles." />
      <EntityManager
        entityLabel="Inquilino"
        entityLabelPlural="Inquilinos"
        columns={columns}
        fields={fields}
        rows={inquilinos ?? []}
        onCreate={createInquilino}
        onUpdate={updateInquilino}
        onDelete={deleteInquilino}
      />
    </div>
  );
}
