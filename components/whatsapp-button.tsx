import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

/** Builds the wa.me link for a property, or null if no number is configured yet. */
export function getWhatsappHref(propertyUrl: string) {
  if (!WHATSAPP_NUMBER) return null;
  const message = `Hola! Me interesó esta publicación: ${propertyUrl}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function WhatsappButton({
  propertyUrl,
  label = "Consultar",
  className,
}: {
  propertyUrl: string;
  label?: string;
  className?: string;
}) {
  const href = getWhatsappHref(propertyUrl);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57]",
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
