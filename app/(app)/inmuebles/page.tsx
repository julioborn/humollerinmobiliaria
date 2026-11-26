import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EntityManager, type EntityColumn, type EntityField } from "@/components/crud/entity-manager";
import { createInmueble, updateInmueble, deleteInmueble } from "./actions";

const estadoLabels: Record<string, string> = {
  disponible: "Disponible",
  alquilado: "Alquilado",
  reservado: "Reservado",
  inactivo: "Inactivo",
};

export default async function InmueblesPage() {
  const supabase = await createClient();
  const [{ data: inmuebles }, { data: propietarios }] = await Promise.all([
    supabase
      .from("inmuebles")
      .select("*, propietarios(id, nombre)")
      .order("direccion"),
    supabase.from("propietarios").select("id, nombre").order("nombre"),
  ]);

  const rows = (inmuebles ?? []).map((inmueble) => ({
    ...inmueble,
    propietario_nombre: inmueble.propietarios?.nombre ?? "Sin asignar",
  }));

  const columns: EntityColumn[] = [
    { key: "direccion", label: "Direccion" },
    { key: "localidad", label: "Localidad" },
    { key: "tipo", label: "Tipo" },
    { key: "propietario_nombre", label: "Propietario" },
    { key: "estado", label: "Estado", badgeMap: estadoLabels },
  ];

  const fields: EntityField[] = [
    { name: "direccion", label: "Direccion", required: true },
    { name: "localidad", label: "Localidad" },
    { name: "tipo", label: "Tipo (casa, depto, local...)" },
    { name: "ambientes", label: "Ambientes", type: "number" },
    { name: "superficie", label: "Superficie (m2)", type: "number" },
    {
      name: "propietario_id",
      label: "Propietario",
      type: "select",
      options: (propietarios ?? []).map((p) => ({ value: p.id, label: p.nombre })),
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      defaultValue: "disponible",
      options: Object.entries(estadoLabels).map(([value, label]) => ({ value, label })),
    },
    { name: "notas", label: "Notas", type: "textarea" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inmuebles" description="Propiedades administradas por la inmobiliaria." />
      <EntityManager
        entityLabel="Inmueble"
        entityLabelPlural="Inmuebles"
        columns={columns}
        fields={fields}
        rows={rows}
        onCreate={createInmueble}
        onUpdate={updateInmueble}
        onDelete={deleteInmueble}
        detailBasePath="/inmuebles"
      />
    </div>
  );
}
