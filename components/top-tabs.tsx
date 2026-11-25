"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  Banknote,
  BarChart3,
  Receipt,
  Settings,
} from "lucide-react";

const tabs = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/contratos", label: "Contratos", icon: FileText },
  { href: "/propietarios", label: "Propietarios", icon: Users },
  { href: "/inquilinos", label: "Inquilinos", icon: UserCheck },
  { href: "/garantes", label: "Garantes", icon: ShieldCheck },
  { href: "/inmuebles", label: "Inmuebles", icon: Building2 },
  { href: "/movimientos", label: "Movimientos", icon: Banknote },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/facturacion", label: "Facturacion", icon: Receipt },
  { href: "/configuracion", label: "Configuracion", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex items-end gap-1 overflow-x-auto border-b border-border bg-secondary/40 px-4 pt-2">
      {tabs.map((tab) => {
        const active = isActive(pathname, tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-t-md border border-b-0 px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "border-border bg-background text-foreground"
                : "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4", active && "text-primary")} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
