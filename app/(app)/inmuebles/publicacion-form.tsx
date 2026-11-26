"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

export function PublicacionForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>;
  defaults: { descripcion: string | null; precio: number | null; publicado: boolean };
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Publicacion actualizada.");
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              placeholder="Describi el inmueble para la publicacion web: ambientes, estado, zona, comodidades..."
              defaultValue={defaults.descripcion ?? ""}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                placeholder="Dejar vacio para mostrar 'Consultar valor'"
                defaultValue={defaults.precio ?? ""}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox name="publicado" value="true" defaultChecked={defaults.publicado} />
                Publicado en la web
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar publicacion"}
        </Button>
      </div>
    </form>
  );
}
