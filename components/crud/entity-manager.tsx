"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { MoreHorizontal } from "lucide-react";

export type EntityField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "email" | "number" | "select" | "date";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: string;
};

export type EntityColumn = {
  key: string;
  label: string;
  badgeMap?: Record<string, string>;
  /** When set, renders the value as a link that opens Google Maps, with this text appended to the search query. */
  mapsQuerySuffix?: string;
};

type ActionResult = { error?: string; success?: boolean };

export function EntityManager({
  entityLabel,
  entityLabelPlural,
  columns,
  fields,
  rows,
  onCreate,
  onUpdate,
  onDelete,
}: {
  entityLabel: string;
  entityLabelPlural: string;
  columns: EntityColumn[];
  fields: EntityField[];
  rows: Record<string, unknown>[];
  onCreate: (formData: FormData) => Promise<ActionResult>;
  onUpdate: (id: string, formData: FormData) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}) {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(term)),
    );
  }, [rows, search, columns]);

  function openCreate() {
    setEditingRow(null);
    setSheetOpen(true);
  }

  function openEdit(row: Record<string, unknown>) {
    setEditingRow(row);
    setSheetOpen(true);
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = editingRow
        ? await onUpdate(editingRow.id as string, formData)
        : await onCreate(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(editingRow ? `${entityLabel} actualizado.` : `${entityLabel} creado.`);
      setSheetOpen(false);
      setEditingRow(null);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await onDelete(deleteTarget.id as string);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${entityLabel} eliminado.`);
      setDeleteTarget(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar ${entityLabelPlural.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nuevo {entityLabel}
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center text-muted-foreground">
                  Sin registros.
                </TableCell>
              </TableRow>
            )}
            {filteredRows.map((row) => (
              <TableRow key={row.id as string}>
                {columns.map((col) => {
                  const value = row[col.key];
                  return (
                    <TableCell key={col.key}>
                      {col.badgeMap ? (
                        <Badge variant="secondary">
                          {col.badgeMap[String(value)] ?? String(value ?? "-")}
                        </Badge>
                      ) : col.mapsQuerySuffix && value ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${String(value)}, ${col.mapsQuerySuffix}`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {String(value)}
                        </a>
                      ) : (
                        String(value ?? "-")
                      )}
                    </TableCell>
                  );
                })}
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
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteTarget(row)}
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
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingRow ? `Editar ${entityLabel}` : `Nuevo ${entityLabel}`}</SheetTitle>
            <SheetDescription>Completa los datos y guarda los cambios.</SheetDescription>
          </SheetHeader>
          <form
            action={handleSubmit}
            className="flex flex-col gap-4 px-4 pb-4"
          >
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={(editingRow?.[field.name] as string) ?? ""}
                  />
                ) : field.type === "select" ? (
                  <Select
                    name={field.name}
                    required={field.required}
                    defaultValue={(editingRow?.[field.name] as string) ?? field.defaultValue}
                    items={field.options}
                  >
                    <SelectTrigger className="w-full" id={field.name}>
                      <SelectValue placeholder={field.placeholder ?? "Seleccionar..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={
                      field.type === "email"
                        ? "email"
                        : field.type === "number"
                          ? "number"
                          : field.type === "date"
                            ? "date"
                            : "text"
                    }
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={(editingRow?.[field.name] as string) ?? ""}
                  />
                )}
              </div>
            ))}
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
            <AlertDialogTitle>Eliminar {entityLabel.toLowerCase()}</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara el registro permanentemente.
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
