import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { EntityManager, type EntityColumn, type EntityField } from "@/components/crud/entity-manager";
import {
  createIndiceReferencia,
  updateIndiceReferencia,
  deleteIndiceReferencia,
} from "./actions";

const columns: EntityColumn[] = [
  { key: "tipo_indice", label: "Indice" },
  { key: "fecha", label: "Fecha" },
  { key: "valor", label: "Valor" },
];

const fields: EntityField[] = [
  {
    name: "tipo_indice",
    label: "Indice",
    type: "select",
    required: true,
    defaultValue: "ICL",
    options: [
      { value: "ICL", label: "ICL (BCRA)" },
      { value: "IPC", label: "IPC (INDEC)" },
      { value: "CASA_PROPIA", label: "Casa Propia" },
      { value: "OTRO", label: "Otro" },
    ],
  },
  { name: "fecha", label: "Fecha", type: "date", required: true },
  { name: "valor", label: "Valor", type: "number", required: true },
];

export default async function ConfiguracionPage() {
  const supabase = await createClient();
  const { data: indices } = await supabase
    .from("indices_referencia")
    .select("*")
    .order("fecha", { ascending: false });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Indices de referencia"
          description="Valores historicos de ICL / IPC usados para calcular las actualizaciones automaticas de los contratos."
        />
        <EntityManager
          entityLabel="Indice"
          entityLabelPlural="Indices"
          columns={columns}
          fields={fields}
          rows={indices ?? []}
          onCreate={createIndiceReferencia}
          onUpdate={updateIndiceReferencia}
          onDelete={deleteIndiceReferencia}
        />
      </div>
    </div>
  );
}
