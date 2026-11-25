export function formatARS(amount: number) {
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export function formatDateShort(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}

export function diasRestantes(iso: string) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(`${iso}T00:00:00`);
  return Math.round((fecha.getTime() - hoy.getTime()) / 86_400_000);
}

export function pluralizar(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export function labelRelativo(dias: number) {
  if (dias < 0) return `Vencido hace ${Math.abs(dias)}d`;
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  return `En ${dias} días`;
}
