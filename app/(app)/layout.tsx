import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopTabs } from "@/components/top-tabs";
import { UserMenu } from "@/components/user-menu";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-primary px-6 text-primary-foreground">
        <Link href="/inicio" className="flex items-center gap-3">
          <Image
            src="/icono_simetrico_512x512.png"
            alt="Humoller Inmobiliaria"
            width={44}
            height={44}
            priority
          />
          <span className="text-base font-semibold">Humoller Inmobiliaria</span>
        </Link>
        <UserMenu email={user.email ?? ""} />
      </header>
      <TopTabs />
      <main className="min-h-0 flex-1 overflow-y-auto bg-background p-6">{children}</main>
    </div>
  );
}
