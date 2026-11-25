"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { friendlyDbError } from "@/lib/supabase/errors";
import { emitirComprobante } from "@/lib/arca/client";
import { optionalField } from "@/lib/zod-helpers";

const schema = z.object({
  movimiento_id: z.string().uuid("Selecciona un movimiento"),
  tipo_comprobante: z.enum(["factura_c", "recibo"]),
  punto_venta: optionalField(z.coerce.number().int()),
});

export async function createComprobante(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comprobantes").insert({
    ...parsed.data,
    estado: "pendiente_credenciales",
  });
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/facturacion");
  return { success: true };
}

export async function emitirComprobanteAction(id: string) {
  const supabase = await createClient();
  const resultado = await emitirComprobante();

  if (resultado.ok) {
    await supabase
      .from("comprobantes")
      .update({
        estado: "emitido",
        cae: resultado.cae,
        cae_vencimiento: resultado.caeVencimiento,
        numero: resultado.numero,
      })
      .eq("id", id);
    revalidatePath("/facturacion");
    return { success: true };
  }

  await supabase
    .from("comprobantes")
    .update({ estado: resultado.reason === "pendiente_credenciales" ? "pendiente_credenciales" : "error" })
    .eq("id", id);
  revalidatePath("/facturacion");
  return { error: resultado.message };
}

export async function deleteComprobante(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("comprobantes").delete().eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath("/facturacion");
  return { success: true };
}
