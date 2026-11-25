"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  ShieldCheck,
  FileText,
  Banknote,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inmuebles", label: "Inmuebles", icon: Building2 },
  { href: "/propietarios", label: "Propietarios", icon: Users },
  { href: "/inquilinos", label: "Inquilinos", icon: UserCheck },
  { href: "/garantes", label: "Garantes", icon: ShieldCheck },
  { href: "/contratos", label: "Contratos", icon: FileText },
  { href: "/movimientos", label: "Movimientos", icon: Banknote },
  { href: "/facturacion", label: "Facturacion", icon: Receipt },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuracion", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <Image
          src="/logo-humoller.jpg"
          alt="Humoller Inmobiliaria"
          width={36}
          height={36}
          className="rounded-md"
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold">RentaControl</p>
          <p className="text-xs text-sidebar-foreground/70">Humoller Inmobiliaria</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
