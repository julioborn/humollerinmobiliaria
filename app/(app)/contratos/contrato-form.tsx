"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type Option = { id: string; label: string };

function toItems(options: Option[]) {
  return options.map((o) => ({ value: o.id, label: o.label }));
}

type ContratoDefaults = {
  carpeta?: string | null;
  codigo?: string | null;
  inmueble_id?: string;
  inquilino_id?: string;
  propietario_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string | null;
  monto_inicial?: number;
  monto_actual?: number;
  moneda?: string;
  comision_porcentaje?: number;
  dia_vencimiento_pago?: number;
  indice_actualizacion?: string;
  periodicidad_meses?: number;
  valor_indice_referencia?: number | null;
  proxima_actualizacion?: string | null;
  estado?: string;
  notas?: string | null;
};

const indiceOptions = [
  { value: "FIJO", label: "Fijo (sin actualizacion)" },
  { value: "ICL", label: "ICL (BCRA)" },
  { value: "IPC", label: "IPC (INDEC)" },
  { value: "CASA_PROPIA", label: "Casa Propia" },
  { value: "OTRO", label: "Otro" },
];

const estadoOptions = [
  { value: "activo", label: "Activo" },
  { value: "finalizado", label: "Finalizado" },
  { value: "rescindido", label: "Rescindido" },
];

export function ContratoForm({
  action,
  defaults,
  inmuebles,
  inquilinos,
  propietarios,
  garantes,
  selectedGaranteIds = [],
  submitLabel = "Guardar",
}: {
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>;
  defaults?: ContratoDefaults;
  inmuebles: Option[];
  inquilinos: Option[];
  propietarios: Option[];
  garantes: Option[];
  selectedGaranteIds?: string[];
  submitLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [indice, setIndice] = useState(defaults?.indice_actualizacion ?? "FIJO");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      if (result?.success) {
        toast.success("Contrato guardado.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="carpeta">Carpeta</Label>
            <Input id="carpeta" name="carpeta" defaultValue={defaults?.carpeta ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="codigo">Codigo</Label>
            <Input id="codigo" name="codigo" defaultValue={defaults?.codigo ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              name="estado"
              defaultValue={defaults?.estado ?? "activo"}
              required
              items={estadoOptions}
            >
              <SelectTrigger className="w-full" id="estado">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {estadoOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="inmueble_id">Inmueble *</Label>
            <Select
              name="inmueble_id"
              defaultValue={defaults?.inmueble_id}
              required
              items={toItems(inmuebles)}
            >
              <SelectTrigger className="w-full" id="inmueble_id">
                <SelectValue placeholder="Seleccionar inmueble" />
              </SelectTrigger>
              <SelectContent>
                {inmuebles.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="inquilino_id">Inquilino *</Label>
            <Select
              name="inquilino_id"
              defaultValue={defaults?.inquilino_id}
              required
              items={toItems(inquilinos)}
            >
              <SelectTrigger className="w-full" id="inquilino_id">
                <SelectValue placeholder="Seleccionar inquilino" />
              </SelectTrigger>
              <SelectContent>
                {inquilinos.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="propietario_id">Propietario *</Label>
            <Select
              name="propietario_id"
              defaultValue={defaults?.propietario_id}
              required
              items={toItems(propietarios)}
            >
              <SelectTrigger className="w-full" id="propietario_id">
                <SelectValue placeholder="Seleccionar propietario" />
              </SelectTrigger>
              <SelectContent>
                {propietarios.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="fecha_inicio">Fecha de inicio *</Label>
            <Input
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              defaultValue={defaults?.fecha_inicio ?? ""}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fecha_fin">Fecha de fin</Label>
            <Input id="fecha_fin" name="fecha_fin" type="date" defaultValue={defaults?.fecha_fin ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dia_vencimiento_pago">Dia de vencimiento de pago</Label>
            <Input
              id="dia_vencimiento_pago"
              name="dia_vencimiento_pago"
              type="number"
              min={1}
              max={31}
              defaultValue={defaults?.dia_vencimiento_pago ?? 10}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="monto_inicial">Monto inicial *</Label>
            <Input
              id="monto_inicial"
              name="monto_inicial"
              type="number"
              step="0.01"
              defaultValue={defaults?.monto_inicial ?? ""}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="monto_actual">Monto vigente *</Label>
            <Input
              id="monto_actual"
              name="monto_actual"
              type="number"
              step="0.01"
              defaultValue={defaults?.monto_actual ?? defaults?.monto_inicial ?? ""}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="moneda">Moneda</Label>
            <Select
              name="moneda"
              defaultValue={defaults?.moneda ?? "ARS"}
              required
              items={[
                { value: "ARS", label: "ARS" },
                { value: "USD", label: "USD" },
              ]}
            >
              <SelectTrigger className="w-full" id="moneda">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARS">ARS</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="comision_porcentaje">Comision (%)</Label>
            <Input
              id="comision_porcentaje"
              name="comision_porcentaje"
              type="number"
              step="0.01"
              defaultValue={defaults?.comision_porcentaje ?? 10}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="indice_actualizacion">Indice de actualizacion</Label>
            <Select
              name="indice_actualizacion"
              value={indice}
              onValueChange={(value) => setIndice(value ?? "FIJO")}
              required
              items={indiceOptions}
            >
              <SelectTrigger className="w-full" id="indice_actualizacion">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {indiceOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="periodicidad_meses">Periodicidad (meses)</Label>
            <Input
              id="periodicidad_meses"
              name="periodicidad_meses"
              type="number"
              min={1}
              defaultValue={defaults?.periodicidad_meses ?? 12}
              required
            />
          </div>

          {indice !== "FIJO" && (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="valor_indice_referencia">Valor de indice de referencia</Label>
                <Input
                  id="valor_indice_referencia"
                  name="valor_indice_referencia"
                  type="number"
                  step="0.0001"
                  defaultValue={defaults?.valor_indice_referencia ?? ""}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="proxima_actualizacion">Proxima actualizacion</Label>
                <Input
                  id="proxima_actualizacion"
                  name="proxima_actualizacion"
                  type="date"
                  defaultValue={defaults?.proxima_actualizacion ?? ""}
                />
              </div>
            </>
          )}

          <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2">
            <Label>Garantes</Label>
            <div className="flex flex-col gap-2 rounded-md border p-3 max-h-40 overflow-y-auto">
              {garantes.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay garantes cargados.</p>
              )}
              {garantes.map((g) => (
                <label key={g.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    name="garante_ids"
                    value={g.id}
                    defaultChecked={selectedGaranteIds.includes(g.id)}
                  />
                  {g.label}
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea id="notas" name="notas" defaultValue={defaults?.notas ?? ""} />
          </div>
        </CardContent>
      </Card>

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
