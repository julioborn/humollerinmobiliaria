import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EntityManager, type EntityColumn, type EntityField } from "@/components/crud/entity-manager";
import { createInmueble, updateInmueble, deleteInmueble } from "../inmuebles/actions";

const estadoLabels: Record<string, string> = {
  disponible: "Disponible",
  alquilado: "Alquilado",
  reservado: "Reservado",
  inactivo: "Inactivo",
};

const publicadoLabels: Record<string, string> = {
  true: "Publicado",
  false: "Sin publicar",
};

export default async function PublicacionesPage() {
  const supabase = await createClient();
  const [{ data: inmuebles }, { data: propietarios }, { data: contratosActivos }] = await Promise.all([
    supabase
      .from("inmuebles")
      .select("*, propietarios(id, nombre)")
      .order("direccion"),
    supabase.from("propietarios").select("id, nombre").order("nombre"),
    supabase.from("contratos").select("inmueble_id").eq("estado", "activo"),
  ]);

  const inmueblesConContrato = new Set((contratosActivos ?? []).map((c) => c.inmueble_id));

  const rows = (inmuebles ?? [])
    .filter((inmueble) => !inmueblesConContrato.has(inmueble.id))
    .map((inmueble) => ({
      ...inmueble,
      propietario_nombre: inmueble.propietarios?.nombre ?? "Sin asignar",
    }));

  const columns: EntityColumn[] = [
    { key: "direccion", label: "Direccion" },
    { key: "localidad", label: "Localidad" },
    { key: "tipo", label: "Tipo" },
    { key: "estado", label: "Estado", badgeMap: estadoLabels },
    { key: "publicado", label: "En la web", badgeMap: publicadoLabels },
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
      <PageHeader
        title="Publicaciones"
        description="Inmuebles sin contrato activo: son los que pueden publicarse en la web para el publico."
      />
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
        detailLabel="Gestionar publicacion"
      />
    </div>
  );
}
