import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PublicacionForm } from "../publicacion-form";
import { FotosManager } from "../fotos-manager";
import {
  updatePublicacion,
  uploadInmuebleFoto,
  deleteInmuebleFoto,
  reorderInmuebleFotos,
} from "../actions";

export default async function InmuebleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: inmueble }, { data: fotos }] = await Promise.all([
    supabase.from("inmuebles").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("inmueble_fotos")
      .select("*")
      .eq("inmueble_id", id)
      .order("orden"),
  ]);

  if (!inmueble) {
    notFound();
  }

  const fotosConUrl = (fotos ?? []).map((foto) => ({
    id: foto.id,
    storage_path: foto.storage_path,
    orden: foto.orden,
    url: supabase.storage.from("inmuebles-fotos").getPublicUrl(foto.storage_path).data.publicUrl,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestionar publicacion"
        description={inmueble.direccion}
        action={
          inmueble.publicado ? (
            <Button variant="outline" render={<Link href={`/propiedades/${id}`} target="_blank" />} nativeButton={false}>
              <ExternalLink className="h-4 w-4" />
              Ver publicacion
            </Button>
          ) : undefined
        }
      />

      <PublicacionForm
        action={updatePublicacion.bind(null, id)}
        defaults={{
          descripcion: inmueble.descripcion,
          precio: inmueble.precio,
          publicado: inmueble.publicado,
        }}
      />

      <FotosManager
        inmuebleId={id}
        fotos={fotosConUrl}
        onUpload={uploadInmuebleFoto}
        onDelete={deleteInmuebleFoto}
        onReorder={reorderInmuebleFotos}
      />
    </div>
  );
}
