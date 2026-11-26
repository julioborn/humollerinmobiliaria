"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, GripVertical, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Foto = { id: string; storage_path: string; orden: number; url: string };

type ActionResult = { error?: string; success?: boolean };

export function FotosManager({
  inmuebleId,
  fotos,
  onUpload,
  onDelete,
  onReorder,
}: {
  inmuebleId: string;
  fotos: Foto[];
  onUpload: (inmuebleId: string, formData: FormData) => Promise<ActionResult>;
  onDelete: (fotoId: string, inmuebleId: string, storagePath: string) => Promise<ActionResult>;
  onReorder: (inmuebleId: string, orderedIds: string[]) => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
  const [prevFotos, setPrevFotos] = useState(fotos);
  const [ordered, setOrdered] = useState(fotos);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (fotos !== prevFotos) {
    setPrevFotos(fotos);
    setOrdered(fotos);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await onUpload(inmuebleId, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Foto subida.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  function handleDelete(foto: Foto) {
    startTransition(async () => {
      const result = await onDelete(foto.id, inmuebleId, foto.storage_path);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setOrdered((prev) => prev.filter((f) => f.id !== foto.id));
    });
  }

  function reorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || to >= ordered.length) return;
    const next = [...ordered];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrdered(next);
    startTransition(async () => {
      const result = await onReorder(inmuebleId, next.map((f) => f.id));
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            id="foto-upload"
            onChange={handleFileChange}
            disabled={isPending}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Subir foto
          </Button>
        </div>

        {ordered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavia no hay fotos cargadas para este inmueble.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ordered.map((foto, index) => (
              <div
                key={foto.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorder(dragIndex, index);
                  setDragIndex(null);
                }}
                className={cn(
                  "flex flex-col gap-2 rounded-md border border-border p-2 transition-opacity",
                  dragIndex === index && "opacity-40",
                )}
              >
                <span
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragEnd={() => setDragIndex(null)}
                  className="hidden w-fit cursor-grab items-center gap-1 text-xs text-muted-foreground active:cursor-grabbing sm:flex"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                  Arrastrar para ordenar
                </span>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-muted">
                  <Image src={foto.url} alt="" fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending || index === 0}
                      onClick={() => reorder(index, index - 1)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending || index === ordered.length - 1}
                      onClick={() => reorder(index, index + 1)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => handleDelete(foto)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
