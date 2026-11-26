import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BedDouble, Ruler, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrigin } from "@/lib/site-url";
import { PublicHeader } from "@/components/public-header";
import { PhotoCarousel } from "@/components/photo-carousel";
import { WhatsappButton, getWhatsappHref } from "@/components/whatsapp-button";
import { Reveal } from "@/components/motion/reveal";

export const revalidate = 0;

export default async function PropiedadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data: inmueble } = await supabase
    .from("inmuebles")
    .select("*, inmueble_fotos(storage_path, orden)")
    .eq("id", id)
    .maybeSingle();

  if (!inmueble) {
    notFound();
  }

  const admin = createAdminClient();
  const { data: contratoActivo } = await admin
    .from("contratos")
    .select("id")
    .eq("inmueble_id", id)
    .eq("estado", "activo")
    .maybeSingle();

  if (contratoActivo) {
    notFound();
  }

  const photos = [...(inmueble.inmueble_fotos ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map((f) => supabase.storage.from("inmuebles-fotos").getPublicUrl(f.storage_path).data.publicUrl);

  const detailUrl = `${origin}/propiedades/${id}`;
  const whatsappHref = getWhatsappHref(detailUrl);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a propiedades
        </Link>

        <Reveal>
          <PhotoCarousel
            photos={photos}
            alt={inmueble.direccion}
            aspectClassName="aspect-[16/9]"
            priority
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div>
              {inmueble.tipo && (
                <span className="text-xs font-medium uppercase tracking-wide text-primary">
                  {inmueble.tipo}
                </span>
              )}
              <h1 className="mt-0.5 text-2xl font-semibold text-foreground">{inmueble.direccion}</h1>
              {inmueble.localidad && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {inmueble.localidad}
                </p>
              )}
              <div className="mt-3 flex items-center gap-5 text-sm text-muted-foreground">
                {inmueble.ambientes && (
                  <span className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4" />
                    {inmueble.ambientes} ambientes
                  </span>
                )}
                {inmueble.superficie && (
                  <span className="flex items-center gap-1.5">
                    <Ruler className="h-4 w-4" />
                    {inmueble.superficie} m²
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-semibold text-primary hover:underline"
                >
                  Consultar valor
                </a>
              ) : (
                <p className="text-2xl font-semibold text-foreground">Consultar valor</p>
              )}
              <WhatsappButton
                propertyUrl={detailUrl}
                label="Consultar por esta propiedad"
                className="px-6 py-3 text-base"
              />
            </div>
          </div>
        </Reveal>

        {inmueble.descripcion && (
          <Reveal delay={0.16}>
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="mb-2 text-base font-semibold text-foreground">Descripción</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {inmueble.descripcion}
              </p>
            </div>
          </Reveal>
        )}
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          Humoller Inmobiliaria · Alquileres y ventas
        </div>
      </footer>
    </div>
  );
}
