"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyDbError } from "@/lib/supabase/errors";
import { optionalField } from "@/lib/zod-helpers";

const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  cuit_dni: z.string().optional(),
  telefono: z.string().optional(),
  email: optionalField(z.string().email()),
  direccion: z.string().optional(),
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

export async function createInquilino(formData: FormData) {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("inquilinos").insert(result.data);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/inquilinos");
  return { success: true };
}

export async function updateInquilino(id: string, formData: FormData) {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("inquilinos").update(result.data).eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/inquilinos");
  return { success: true };
}

export async function deleteInquilino(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("inquilinos").delete().eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/inquilinos");
  return { success: true };
}
