/**
 * Servicio de emision de comprobantes electronicos (ARCA, ex AFIP).
 *
 * Pendiente de credenciales reales de Humoller Inmobiliaria:
 *   - CUIT emisor
 *   - Certificado digital (.crt) y clave privada (.key) generados con la Clave Fiscal
 *   - Punto de venta habilitado para factura electronica
 *
 * Hasta tener esos datos, este servicio no emite comprobantes reales: solo
 * confirma que el comprobante quedo registrado en estado "pendiente_credenciales".
 * Cuando Humoller entregue las credenciales, esta funcion se reemplaza por la
 * llamada real al Web Service de ARCA (WSFEv1), apuntando primero al ambiente
 * de homologacion (testing) antes de pasar a produccion.
 */

const ARCA_CREDENTIALS_CONFIGURED = Boolean(
  process.env.ARCA_CUIT && process.env.ARCA_CERT && process.env.ARCA_PRIVATE_KEY,
);

export type EmisionResult =
  | { ok: true; cae: string; caeVencimiento: string; numero: number }
  | { ok: false; reason: "pendiente_credenciales" | "error"; message: string };

export async function emitirComprobante(): Promise<EmisionResult> {
  if (!ARCA_CREDENTIALS_CONFIGURED) {
    return {
      ok: false,
      reason: "pendiente_credenciales",
      message:
        "Faltan las credenciales de ARCA (CUIT, certificado y clave privada). El comprobante queda pendiente hasta que Humoller las provea.",
    };
  }

  // Integracion real con WSFEv1 (homologacion/produccion) pendiente de implementar
  // una vez que existan credenciales para probar contra el ambiente de ARCA.
  return {
    ok: false,
    reason: "error",
    message: "Integracion con ARCA aun no implementada.",
  };
}
