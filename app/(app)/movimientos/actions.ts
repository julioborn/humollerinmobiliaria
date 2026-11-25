"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyDbError } from "@/lib/supabase/errors";
import type { ActionResult } from "@/lib/types";

const schema = z.object({
  contrato_id: z.string().uuid("Selecciona un contrato"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  tipo: z.enum(["cobro_inquilino", "pago_propietario", "comision", "gasto"]),
  monto: z.coerce.number().positive("Debe ser mayor a 0"),
  medio_pago: z.string().optional(),
  estado: z.enum(["pendiente", "pagado"]),
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

function revalidateAll(contratoId?: string) {
  revalidatePath("/movimientos");
  if (contratoId) revalidatePath(`/contratos/${contratoId}`);
}

export async function createMovimiento(formData: FormData): Promise<ActionResult> {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("movimientos").insert(result.data);
  if (error) return { error: friendlyDbError(error) };

  revalidateAll(result.data.contrato_id);
  return { success: true };
}

export async function updateMovimiento(id: string, formData: FormData): Promise<ActionResult> {
  const result = parse(formData);
  if ("error" in result) return result;

  const supabase = await createClient();
  const { error } = await supabase.from("movimientos").update(result.data).eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidateAll(result.data.contrato_id);
  return { success: true };
}

export async function deleteMovimiento(id: string, contratoId?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("movimientos").delete().eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidateAll(contratoId);
  return { success: true };
}
