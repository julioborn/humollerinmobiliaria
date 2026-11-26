import Link from "next/link";
import { BedDouble, Ruler, MapPin } from "lucide-react";
import { PhotoCarousel } from "@/components/photo-carousel";
import { WhatsappButton, getWhatsappHref } from "@/components/whatsapp-button";

export type PublicInmueble = {
  id: string;
  direccion: string;
  localidad: string | null;
  tipo: string | null;
  ambientes: number | null;
  superficie: number | null;
  photos: string[];
};

export function PropertyCard({ inmueble, origin }: { inmueble: PublicInmueble; origin: string }) {
  const detailUrl = `${origin}/propiedades/${inmueble.id}`;
  const whatsappHref = getWhatsappHref(detailUrl);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/propiedades/${inmueble.id}`} className="block">
        <PhotoCarousel photos={inmueble.photos} alt={inmueble.direccion} />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {inmueble.tipo && (
            <span className="text-xs font-medium uppercase tracking-wide text-primary">
              {inmueble.tipo}
            </span>
          )}
          <Link href={`/propiedades/${inmueble.id}`} className="block">
            <h3 className="mt-0.5 text-base font-semibold text-foreground">{inmueble.direccion}</h3>
          </Link>
          {inmueble.localidad && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {inmueble.localidad}
            </p>
          )}
        </div>

        {(inmueble.ambientes || inmueble.superficie) && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {inmueble.ambientes && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" />
                {inmueble.ambientes} amb.
              </span>
            )}
            {inmueble.superficie && (
              <span className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4" />
                {inmueble.superficie} m²
              </span>
            )}
          </div>
        )}

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-primary hover:underline"
          >
            Consultar valor
          </a>
        ) : (
          <p className="text-lg font-semibold text-foreground">Consultar valor</p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Link
            href={`/propiedades/${inmueble.id}`}
            className="flex-1 rounded-md border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Ver más
          </Link>
          <WhatsappButton propertyUrl={detailUrl} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
