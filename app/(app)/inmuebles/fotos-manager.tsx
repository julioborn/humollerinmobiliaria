"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
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
  const [ordered, setOrdered] = useState(fotos);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target], next[index]];
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
              <div key={foto.id} className="flex flex-col gap-2 rounded-md border border-border p-2">
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
                      onClick={() => move(index, -1)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending || index === ordered.length - 1}
                      onClick={() => move(index, 1)}
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
