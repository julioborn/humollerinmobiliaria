"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyDbError } from "@/lib/supabase/errors";
import { optionalField } from "@/lib/zod-helpers";

const schema = z.object({
  carpeta: z.string().optional(),
  codigo: z.string().optional(),
  inmueble_id: z.string().uuid("Selecciona un inmueble"),
  inquilino_id: z.string().uuid("Selecciona un inquilino"),
  propietario_id: z.string().uuid("Selecciona un propietario"),
  fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  fecha_fin: optionalField(z.string()),
  monto_inicial: z.coerce.number().positive("Debe ser mayor a 0"),
  monto_actual: z.coerce.number().positive("Debe ser mayor a 0"),
  moneda: z.string().min(1),
  comision_porcentaje: z.coerce.number().min(0).max(100),
  dia_vencimiento_pago: z.coerce.number().int().min(1).max(31),
  indice_actualizacion: z.enum(["ICL", "IPC", "CASA_PROPIA", "FIJO", "OTRO"]),
  periodicidad_meses: z.coerce.number().int().min(1),
  valor_indice_referencia: optionalField(z.coerce.number()),
  proxima_actualizacion: optionalField(z.string()),
  estado: z.enum(["activo", "finalizado", "rescindido"]),
  notas: z.string().optional(),
});

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" } as const;
  }
  const garanteIds = formData.getAll("garante_ids").map(String).filter(Boolean);
  return { data: parsed.data, garanteIds } as const;
}

async function syncGarantes(contratoId: string, garanteIds: string[]) {
  const supabase = await createClient();
  await supabase.from("contrato_garantes").delete().eq("contrato_id", contratoId);
  if (garanteIds.length > 0) {
    await supabase
      .from("contrato_garantes")
      .insert(garanteIds.map((garante_id) => ({ contrato_id: contratoId, garante_id })));
  }
}

export async function createContrato(formData: FormData) {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { data: contrato, error } = await supabase
    .from("contratos")
    .insert(result.data)
    .select("id")
    .single();

  if (error) return { error: friendlyDbError(error) };

  await syncGarantes(contrato.id, result.garanteIds);

  revalidatePath("/contratos");
  redirect(`/contratos/${contrato.id}`);
}

export async function updateContrato(id: string, formData: FormData) {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("contratos").update(result.data).eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  await syncGarantes(id, result.garanteIds);

  revalidatePath("/contratos");
  revalidatePath(`/contratos/${id}`);
  return { success: true };
}

export async function deleteContrato(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contratos").delete().eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/contratos");
  redirect("/contratos");
}
