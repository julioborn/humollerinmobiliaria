"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { friendlyDbError } from "@/lib/supabase/errors";
import { optionalField } from "@/lib/zod-helpers";

const FOTOS_BUCKET = "inmuebles-fotos";

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

const publicacionSchema = z.object({
  descripcion: z.string().optional(),
  precio: optionalField(z.coerce.number().nonnegative()),
  publicado: z.preprocess((v) => v === "true" || v === "on", z.boolean()),
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

export async function updatePublicacion(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = publicacionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos invalidos" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inmuebles").update(parsed.data).eq("id", id);
  if (error) return { error: friendlyDbError(error) };

  revalidatePath(`/inmuebles/${id}`);
  revalidatePath("/inmuebles");
  revalidatePath("/");
  revalidatePath(`/propiedades/${id}`);
  return { success: true };
}

export async function uploadInmuebleFoto(inmuebleId: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona una imagen." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen." };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: existing } = await supabase
    .from("inmueble_fotos")
    .select("orden")
    .eq("inmueble_id", inmuebleId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrden = (existing?.orden ?? -1) + 1;
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${inmuebleId}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await admin.storage
    .from(FOTOS_BUCKET)
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("inmueble_fotos").insert({
    inmueble_id: inmuebleId,
    storage_path: path,
    orden: nextOrden,
  });
  if (insertError) {
    await admin.storage.from(FOTOS_BUCKET).remove([path]);
    return { error: friendlyDbError(insertError) };
  }

  revalidatePath(`/inmuebles/${inmuebleId}`);
  revalidatePath("/");
  revalidatePath(`/propiedades/${inmuebleId}`);
  return { success: true };
}

export async function deleteInmuebleFoto(fotoId: string, inmuebleId: string, storagePath: string) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { error: deleteError } = await supabase.from("inmueble_fotos").delete().eq("id", fotoId);
  if (deleteError) return { error: friendlyDbError(deleteError) };

  await admin.storage.from(FOTOS_BUCKET).remove([storagePath]);

  revalidatePath(`/inmuebles/${inmuebleId}`);
  revalidatePath("/");
  revalidatePath(`/propiedades/${inmuebleId}`);
  return { success: true };
}

export async function reorderInmuebleFotos(inmuebleId: string, orderedIds: string[]) {
  const supabase = await createClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("inmueble_fotos").update({ orden: index }).eq("id", id),
    ),
  );

  revalidatePath(`/inmuebles/${inmuebleId}`);
  revalidatePath("/");
  revalidatePath(`/propiedades/${inmuebleId}`);
  return { success: true };
}
