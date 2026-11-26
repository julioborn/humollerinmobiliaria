"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { diasRestantes, labelRelativo } from "@/lib/format";

type ContratoRow = {
  id: string;
  carpeta: string | null;
  codigo: string | null;
  monto_actual: number;
  moneda: string;
  estado: string;
  fecha_fin: string | null;
  inmueble_direccion: string;
  inquilino_nombre: string;
  propietario_nombre: string;
};

const estadoVariant: Record<string, "success" | "destructive"> = {
  activo: "success",
  finalizado: "destructive",
  rescindido: "destructive",
};

const PRONTO_DIAS = 14;

export function ContratosTable({ rows }: { rows: ContratoRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const term = search.toLowerCase();
    return rows.filter((r) =>
      [r.carpeta, r.codigo, r.inmueble_direccion, r.inquilino_nombre, r.propietario_nombre]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term)),
    );
  }, [rows, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contratos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Carpeta</TableHead>
              <TableHead>Inmueble</TableHead>
              <TableHead>Inquilino</TableHead>
              <TableHead>Propietario</TableHead>
              <TableHead>Monto vigente</TableHead>
              <TableHead>Vence</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Sin contratos.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => {
              const dias = row.fecha_fin ? diasRestantes(row.fecha_fin) : null;
              const prontoAVencer = row.estado === "activo" && dias !== null && dias <= PRONTO_DIAS;
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    "cursor-pointer",
                    prontoAVencer && "bg-destructive/10 hover:bg-destructive/15",
                  )}
                >
                  <TableCell>
                    <Link href={`/contratos/${row.id}`} className="block">
                      {row.carpeta || "-"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/contratos/${row.id}`} className="block">
                      {row.inmueble_direccion}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/contratos/${row.id}`} className="block">
                      {row.inquilino_nombre}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/contratos/${row.id}`} className="block">
                      {row.propietario_nombre}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/contratos/${row.id}`} className="block">
                      {row.moneda} {row.monto_actual.toLocaleString("es-AR")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/contratos/${row.id}`}
                      className={
                        prontoAVencer
                          ? "flex items-center gap-1.5 font-semibold text-destructive"
                          : "block text-muted-foreground"
                      }
                    >
                      {row.fecha_fin
                        ? new Date(`${row.fecha_fin}T00:00:00`).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "-"}
                      {prontoAVencer && dias !== null && (
                        <span className="text-xs">({labelRelativo(dias)})</span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={estadoVariant[row.estado] ?? "secondary"}>{row.estado}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
