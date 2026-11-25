"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createMovimiento, updateMovimiento, deleteMovimiento } from "./actions";

export type MovimientoRow = {
  id: string;
  contrato_id: string;
  contrato_label?: string;
  fecha: string;
  tipo: string;
  monto: number;
  medio_pago: string | null;
  estado: string;
  notas: string | null;
};

const tipoLabels: Record<string, string> = {
  cobro_inquilino: "Cobro a inquilino",
  pago_propietario: "Pago a propietario",
  comision: "Comision",
  gasto: "Gasto",
};

const estadoVariant: Record<string, "default" | "secondary"> = {
  pagado: "default",
  pendiente: "secondary",
};

export function MovimientosManager({
  rows,
  contratoOptions,
  fixedContratoId,
}: {
  rows: MovimientoRow[];
  contratoOptions?: { id: string; label: string }[];
  fixedContratoId?: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MovimientoRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MovimientoRow | null>(null);
  const [isPending, startTransition] = useTransition();

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
    [rows],
  );

  function openCreate() {
    setEditingRow(null);
    setSheetOpen(true);
  }

  function openEdit(row: MovimientoRow) {
    setEditingRow(row);
    setSheetOpen(true);
  }

  function handleSubmit(formData: FormData) {
    if (fixedContratoId) formData.set("contrato_id", fixedContratoId);
    startTransition(async () => {
      const result = editingRow
        ? await updateMovimiento(editingRow.id, formData)
        : await createMovimiento(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(editingRow ? "Movimiento actualizado." : "Movimiento creado.");
      setSheetOpen(false);
      setEditingRow(null);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteMovimiento(deleteTarget.id, deleteTarget.contrato_id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Movimiento eliminado.");
      setDeleteTarget(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nuevo movimiento
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              {!fixedContratoId && <TableHead>Contrato</TableHead>}
              <TableHead>Tipo</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Medio de pago</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={fixedContratoId ? 5 : 6} className="h-24 text-center text-muted-foreground">
                  Sin movimientos.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.fecha}</TableCell>
                {!fixedContratoId && <TableCell>{row.contrato_label}</TableCell>}
                <TableCell>{tipoLabels[row.tipo] ?? row.tipo}</TableCell>
                <TableCell>{row.monto.toLocaleString("es-AR")}</TableCell>
                <TableCell>{row.medio_pago || "-"}</TableCell>
                <TableCell>
                  <Badge variant={estadoVariant[row.estado] ?? "secondary"}>{row.estado}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(row)}>
                        <Pencil className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(row)}>
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
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingRow ? "Editar movimiento" : "Nuevo movimiento"}</SheetTitle>
            <SheetDescription>Registra un cobro, pago, comision o gasto.</SheetDescription>
          </SheetHeader>
          <form action={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
            {!fixedContratoId && (
              <div className="flex flex-col gap-2">
                <Label>Contrato *</Label>
                <Select
                  name="contrato_id"
                  defaultValue={editingRow?.contrato_id}
                  required
                  items={contratoOptions?.map((o) => ({ value: o.id, label: o.label }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contratoOptions?.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                defaultValue={editingRow?.fecha ?? new Date().toISOString().slice(0, 10)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo *</Label>
              <Select
                name="tipo"
                defaultValue={editingRow?.tipo ?? "cobro_inquilino"}
                required
                items={Object.entries(tipoLabels).map(([value, label]) => ({ value, label }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tipoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="monto">Monto *</Label>
              <Input
                id="monto"
                name="monto"
                type="number"
                step="0.01"
                defaultValue={editingRow?.monto ?? ""}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="medio_pago">Medio de pago</Label>
              <Input id="medio_pago" name="medio_pago" defaultValue={editingRow?.medio_pago ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Estado *</Label>
              <Select
                name="estado"
                defaultValue={editingRow?.estado ?? "pendiente"}
                required
                items={[
                  { value: "pendiente", label: "Pendiente" },
                  { value: "pagado", label: "Pagado" },
                ]}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea id="notas" name="notas" defaultValue={editingRow?.notas ?? ""} />
            </div>
            <SheetFooter className="px-0">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar movimiento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
