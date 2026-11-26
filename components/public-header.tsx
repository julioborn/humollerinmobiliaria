import Image from "next/image";
import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icono_simetrico_512x512.png" alt="Humoller Inmobiliaria" width={40} height={40} priority />
          <span className="text-base font-semibold text-foreground">Humoller Inmobiliaria</span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Ingresar
        </Link>
      </div>
    </header>
  );
}
