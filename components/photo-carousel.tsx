"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhotoCarousel({
  photos,
  alt,
  aspectClassName = "aspect-[4/3]",
  priority = false,
}: {
  photos: string[];
  alt: string;
  aspectClassName?: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className={cn("flex w-full items-center justify-center rounded-md bg-muted", aspectClassName)}>
        <Building2 className="h-10 w-10 text-muted-foreground/40" />
      </div>
    );
  }

  function go(delta: 1 | -1, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + delta + photos.length) % photos.length);
  }

  return (
    <div className={cn("relative w-full overflow-hidden rounded-md bg-muted", aspectClassName)}>
      <Image
        src={photos[index]}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-opacity"
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
      />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(e) => go(-1, e)}
            className="absolute inset-y-0 left-0 flex w-9 items-center justify-center text-white"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-black/60">
              <ChevronLeft className="h-4 w-4" />
            </span>
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={(e) => go(1, e)}
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-white"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-black/60">
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
            {photos.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-white/60 transition-all",
                  i === index && "w-3 bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
