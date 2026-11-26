import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/site-url";
import { PublicHeader } from "@/components/public-header";
import { PropertyCard, type PublicInmueble } from "@/components/property-card";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data: inmuebles } = await supabase
    .from("inmuebles")
    .select("id, direccion, localidad, tipo, ambientes, superficie, precio, inmueble_fotos(storage_path, orden)")
    .eq("publicado", true)
    .eq("estado", "disponible")
    .order("created_at", { ascending: false });

  const listings: PublicInmueble[] = (inmuebles ?? []).map((i) => ({
    id: i.id,
    direccion: i.direccion,
    localidad: i.localidad,
    tipo: i.tipo,
    ambientes: i.ambientes,
    superficie: i.superficie,
    precio: i.precio,
    photos: [...(i.inmueble_fotos ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map((f) => supabase.storage.from("inmuebles-fotos").getPublicUrl(f.storage_path).data.publicUrl),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <section className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 sm:px-6">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Propiedades disponibles en Calchaquí
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Alquileres y ventas administrados por Humoller Inmobiliaria. Elegí una propiedad y
            consultanos directamente por WhatsApp.
          </p>
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
            {listings.map((inmueble) => (
              <PropertyCard key={inmueble.id} inmueble={inmueble} origin={origin} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          Humoller Inmobiliaria · Calchaquí, Santa Fe
        </div>
      </footer>
    </div>
  );
}
