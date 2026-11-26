import { headers } from "next/headers";

export async function getOrigin() {
  const h = await headers();
  const host = h.get("host") ?? "humollerinmobiliaria.vercel.app";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
