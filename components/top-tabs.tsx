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
  MoreHorizontal,
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

const mainTabs = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/contratos", label: "Contratos", icon: FileText },
  { href: "/propietarios", label: "Propietarios", icon: Users },
  { href: "/inquilinos", label: "Inquilinos", icon: UserCheck },
  { href: "/garantes", label: "Garantes", icon: ShieldCheck },
  { href: "/inmuebles", label: "Inmuebles", icon: Building2 },
  { href: "/movimientos", label: "Movimientos", icon: Banknote },
];

const moreTabs = [
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/facturacion", label: "Facturacion", icon: Receipt },
  { href: "/configuracion", label: "Configuracion", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

const itemClass = (active: boolean) =>
  cn(
    "relative flex h-full shrink-0 items-center gap-2 px-3 text-[15px] font-medium transition-colors",
    "after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-full after:transition-colors",
    active
      ? "text-foreground after:bg-primary"
      : "text-muted-foreground after:bg-transparent hover:text-foreground",
  );

export function TopTabs() {
  const pathname = usePathname();
  const moreActive = moreTabs.some((t) => isActive(pathname, t.href));

  return (
    <nav className="flex h-[54px] items-stretch overflow-x-auto border-b border-border bg-card px-4">
      {mainTabs.map((tab) => {
        const active = isActive(pathname, tab.href);
        const Icon = tab.icon;
        return (
          <Link key={tab.href} href={tab.href} className={itemClass(active)}>
            <Icon size={18} className={active ? "text-primary" : undefined} />
            {tab.label}
          </Link>
        );
      })}

      <DropdownMenu>
        <DropdownMenuTrigger className={cn(itemClass(moreActive), "cursor-pointer")}>
          <MoreHorizontal size={18} className={moreActive ? "text-primary" : undefined} />
          Mas
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {moreTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <DropdownMenuItem key={tab.href} render={<Link href={tab.href} />}>
                <Icon size={16} />
                {tab.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
