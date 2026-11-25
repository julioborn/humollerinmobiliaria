"use client";

import Link, { useLinkStatus } from "next/link";
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
  Loader2,
  type LucideIcon,
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

function TabContent({ label, icon: Icon, active }: { label: string; icon: LucideIcon; active: boolean }) {
  const { pending } = useLinkStatus();
  return (
    <>
      {pending ? (
        <Loader2 size={18} className="animate-spin text-primary" />
      ) : (
        <Icon size={18} className={active ? "text-primary" : undefined} />
      )}
      <span className={pending ? "opacity-60" : undefined}>{label}</span>
    </>
  );
}

export function TopTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex h-[54px] items-stretch overflow-x-auto border-b border-border bg-card px-4">
      {tabs.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex h-full shrink-0 items-center gap-2 px-3 text-[15px] font-medium transition-colors active:translate-y-px",
              "after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-full after:transition-colors",
              active
                ? "text-foreground after:bg-primary"
                : "text-muted-foreground after:bg-transparent hover:text-foreground",
            )}
          >
            <TabContent label={tab.label} icon={tab.icon} active={active} />
          </Link>
        );
      })}
    </nav>
  );
}
