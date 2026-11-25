export function friendlyDbError(error: { code?: string; message: string }) {
  if (error.code === "23503") {
    return "No se puede eliminar: hay registros relacionados que dependen de este (contratos, inmuebles, etc).";
  }
  if (error.code === "23505") {
    return "Ya existe un registro con ese valor.";
  }
  return error.message;
}
