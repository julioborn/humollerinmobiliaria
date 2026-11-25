"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileText,
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  Banknote,
  MoreHorizontal,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const mainTabs = [
  { href: "/contratos", label: "Contratos", icon: FileText },
  { href: "/propietarios", label: "Propietarios", icon: Users },
  { href: "/inquilinos", label: "Inquilinos", icon: UserCheck },
  { href: "/garantes", label: "Garantes", icon: ShieldCheck },
  { href: "/inmuebles", label: "Inmuebles", icon: Building2 },
  { href: "/movimientos", label: "Movimientos", icon: Banknote },
];

const moreTabs = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/facturacion", label: "Facturacion", icon: Receipt },
  { href: "/configuracion", label: "Configuracion", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopTabs() {
  const pathname = usePathname();
  const moreActive = moreTabs.some((t) => isActive(pathname, t.href));

  return (
    <nav className="flex items-end gap-1 border-b border-border bg-secondary/40 px-4 pt-2">
      {mainTabs.map((tab) => {
        const active = isActive(pathname, tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 rounded-t-md border border-b-0 px-3 py-2 text-sm font-medium transition-colors",
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

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-2 rounded-t-md rounded-b-none border border-b-0 px-3 py-2 text-sm font-medium h-auto",
                moreActive
                  ? "border-border bg-background text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground",
              )}
            />
          }
        >
          <MoreHorizontal className={cn("h-4 w-4", moreActive && "text-primary")} />
          Mas
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {moreTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <DropdownMenuItem key={tab.href} render={<Link href={tab.href} />}>
                <Icon className="h-4 w-4" />
                {tab.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
