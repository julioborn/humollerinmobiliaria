"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createComprobante, deleteComprobante, emitirComprobanteAction } from "./actions";

export type ComprobanteRow = {
  id: string;
  movimiento_id: string;
  movimiento_label: string;
  tipo_comprobante: string;
  punto_venta: number | null;
  numero: number | null;
  cae: string | null;
  estado: string;
};

const tipoLabels: Record<string, string> = {
  factura_c: "Factura C",
  recibo: "Recibo",
};

const estadoVariant: Record<string, "default" | "secondary" | "destructive"> = {
  emitido: "default",
  pendiente: "secondary",
  pendiente_credenciales: "secondary",
  error: "destructive",
};

export function ComprobantesManager({
  rows,
  movimientoOptions,
}: {
  rows: ComprobanteRow[];
  movimientoOptions: { id: string; label: string }[];
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createComprobante(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Comprobante registrado.");
      setSheetOpen(false);
    });
  }

  function handleEmitir(id: string) {
    startTransition(async () => {
      const result = await emitirComprobanteAction(id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Comprobante emitido.");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteComprobante(id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Comprobante eliminado.");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setSheetOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo comprobante
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Movimiento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Punto de venta</TableHead>
              <TableHead>Numero</TableHead>
              <TableHead>CAE</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Sin comprobantes.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.movimiento_label}</TableCell>
                <TableCell>{tipoLabels[row.tipo_comprobante] ?? row.tipo_comprobante}</TableCell>
                <TableCell>{row.punto_venta ?? "-"}</TableCell>
                <TableCell>{row.numero ?? "-"}</TableCell>
                <TableCell>{row.cae ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant={estadoVariant[row.estado] ?? "secondary"}>
                    {row.estado === "pendiente_credenciales" ? "Pendiente credenciales ARCA" : row.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEmitir(row.id)} disabled={isPending}>
                        <Send className="h-4 w-4" />
                        Emitir en ARCA
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(row.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Nuevo comprobante</SheetTitle>
            <SheetDescription>
              Se registra en estado pendiente hasta contar con credenciales de ARCA.
            </SheetDescription>
          </SheetHeader>
          <form action={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
            <div className="flex flex-col gap-2">
              <Label>Movimiento *</Label>
              <Select
                name="movimiento_id"
                required
                items={movimientoOptions.map((o) => ({ value: o.id, label: o.label }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar movimiento" />
                </SelectTrigger>
                <SelectContent>
                  {movimientoOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo de comprobante *</Label>
              <Select
                name="tipo_comprobante"
                defaultValue="factura_c"
                required
                items={[
                  { value: "factura_c", label: "Factura C" },
                  { value: "recibo", label: "Recibo" },
                ]}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="factura_c">Factura C</SelectItem>
                  <SelectItem value="recibo">Recibo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="punto_venta">Punto de venta</Label>
              <Input id="punto_venta" name="punto_venta" type="number" />
            </div>
            <SheetFooter className="px-0">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
