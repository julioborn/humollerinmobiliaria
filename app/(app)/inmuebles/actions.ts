"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyDbError } from "@/lib/supabase/errors";
import { optionalField } from "@/lib/zod-helpers";

const schema = z.object({
  direccion: z.string().min(1, "La direccion es obligatoria"),
  localidad: z.string().optional(),
  tipo: z.string().optional(),
  ambientes: optionalField(z.coerce.number().int()),
  superficie: optionalField(z.coerce.number()),
  propietario_id: optionalField(z.string().uuid()),
  estado: z.enum(["disponible", "alquilado", "reservado", "inactivo"]),
  notas: z.string().optional(),
});

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" } as const;
  }
  return { data: parsed.data } as const;
}

export async function createInmueble(formData: FormData) {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("inmuebles").insert(result.data);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/inmuebles");
  return { success: true };
}

export async function updateInmueble(id: string, formData: FormData) {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("inmuebles").update(result.data).eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/inmuebles");
  return { success: true };
}

export async function deleteInmueble(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("inmuebles").delete().eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/inmuebles");
  return { success: true };
}
