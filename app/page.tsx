import Image from "next/image";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrigin } from "@/lib/site-url";
import { PublicHeader } from "@/components/public-header";
import { PropertyCard, type PublicInmueble } from "@/components/property-card";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const origin = await getOrigin();

  const admin = createAdminClient();
  const [{ data: inmuebles }, { data: contratosActivos }] = await Promise.all([
    supabase
      .from("inmuebles")
      .select("id, direccion, localidad, tipo, ambientes, superficie, inmueble_fotos(storage_path, orden)")
      .eq("publicado", true)
      .eq("estado", "disponible")
      .order("created_at", { ascending: false }),
    admin.from("contratos").select("inmueble_id").eq("estado", "activo"),
  ]);

  const inmueblesConContrato = new Set((contratosActivos ?? []).map((c) => c.inmueble_id));

  const listings: PublicInmueble[] = (inmuebles ?? [])
    .filter((i) => !inmueblesConContrato.has(i.id))
    .map((i) => ({
      id: i.id,
      direccion: i.direccion,
      localidad: i.localidad,
      tipo: i.tipo,
      ambientes: i.ambientes,
      superficie: i.superficie,
      photos: [...(i.inmueble_fotos ?? [])]
        .sort((a, b) => a.orden - b.orden)
        .map((f) => supabase.storage.from("inmuebles-fotos").getPublicUrl(f.storage_path).data.publicUrl),
    }));

  const featured = listings.find((l) => l.photos.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <section className="relative overflow-hidden border-b border-border bg-card">
        <div
          aria-hidden
          className="hero-glow pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="hero-glow pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          style={{ animationDelay: "3s" }}
        />
        {!featured && (
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 translate-x-1/4 sm:block"
          >
            <Image
              src="/icono_simetrico_512x512.png"
              alt=""
              width={380}
              height={380}
              className="opacity-10 blur-sm"
            />
          </div>
        )}

        <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex flex-col gap-4">
            <Reveal>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
                Encontrá tu próxima propiedad en alquiler o venta.
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                Gestionamos alquileres y ventas con atención personalizada. Elegí una propiedad y
                consultanos directamente por WhatsApp.
              </p>
            </Reveal>
            {listings.length > 0 && (
              <Reveal delay={0.16}>
                <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  <Counter value={listings.length} className="text-base font-semibold tabular-nums" />
                  <span className="text-muted-foreground">
                    {listings.length === 1 ? "propiedad disponible ahora" : "propiedades disponibles ahora"}
                  </span>
                </div>
              </Reveal>
            )}
          </div>

          {featured && (
            <Reveal delay={0.2} className="hidden shrink-0 lg:block">
              <Link
                href={`/propiedades/${featured.id}`}
                className="group relative block w-[300px] overflow-hidden rounded-2xl shadow-xl xl:w-[360px]"
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={featured.photos[0]}
                  alt={featured.direccion}
                  fill
                  priority
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="360px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                  {featured.tipo && (
                    <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                      {featured.tipo}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-white">{featured.direccion}</p>
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-8 sm:px-6">
        {listings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Por el momento no hay propiedades publicadas. Volvé a consultar pronto.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((inmueble, index) => (
              <Reveal key={inmueble.id} delay={Math.min(index, 5) * 0.06}>
                <PropertyCard inmueble={inmueble} origin={origin} />
              </Reveal>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          Humoller Inmobiliaria · Alquileres y ventas
        </div>
      </footer>
    </div>
  );
}
