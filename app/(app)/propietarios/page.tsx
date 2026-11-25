import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EntityManager, type EntityColumn, type EntityField } from "@/components/crud/entity-manager";
import { createPropietario, updatePropietario, deletePropietario } from "./actions";

const columns: EntityColumn[] = [
  { key: "nombre", label: "Nombre" },
  { key: "cuit", label: "CUIT" },
  { key: "telefono", label: "Telefono" },
  { key: "email", label: "Email" },
];

const fields: EntityField[] = [
  { name: "nombre", label: "Nombre", required: true },
  { name: "cuit", label: "CUIT" },
  { name: "telefono", label: "Telefono" },
  { name: "email", label: "Email", type: "email" },
  { name: "direccion", label: "Direccion" },
  { name: "cbu", label: "CBU" },
  { name: "alias_cbu", label: "Alias CBU" },
  { name: "notas", label: "Notas", type: "textarea" },
];

export default async function PropietariosPage() {
  const supabase = await createClient();
  const { data: propietarios } = await supabase
    .from("propietarios")
    .select("*")
    .order("nombre");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Propietarios" description="Duenos de los inmuebles administrados." />
      <EntityManager
        entityLabel="Propietario"
        entityLabelPlural="Propietarios"
        columns={columns}
        fields={fields}
        rows={propietarios ?? []}
        onCreate={createPropietario}
        onUpdate={updatePropietario}
        onDelete={deletePropietario}
      />
    </div>
  );
}
