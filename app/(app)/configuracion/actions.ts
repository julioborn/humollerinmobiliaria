"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyDbError } from "@/lib/supabase/errors";

const schema = z.object({
  tipo_indice: z.enum(["ICL", "IPC", "CASA_PROPIA", "FIJO", "OTRO"]),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  valor: z.coerce.number().positive("Debe ser mayor a 0"),
});

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" } as const;
  }
  return { data: parsed.data } as const;
}

export async function createIndiceReferencia(formData: FormData) {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("indices_referencia").insert(result.data);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/configuracion");
  return { success: true };
}

export async function updateIndiceReferencia(id: string, formData: FormData) {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("indices_referencia").update(result.data).eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/configuracion");
  return { success: true };
}

export async function deleteIndiceReferencia(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("indices_referencia").delete().eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/configuracion");
  return { success: true };
}
