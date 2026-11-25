"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/app/(app)/actions";

export function UserMenu({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
      <form action={logout}>
        <Button type="submit" variant="ghost" size="icon" title="Cerrar sesion">
          <LogOut className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
