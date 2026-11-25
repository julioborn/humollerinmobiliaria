import Image from "next/image";
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
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-primary px-6 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-humoller.jpg"
            alt="Humoller Inmobiliaria"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-semibold">Humoller Inmobiliaria</span>
        </div>
        <UserMenu email={user.email ?? ""} />
      </header>
      <TopTabs />
      <main className="flex-1 overflow-y-auto bg-secondary/20 p-6">{children}</main>
    </div>
  );
}
