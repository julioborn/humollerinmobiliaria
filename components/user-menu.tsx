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
        <AvatarFallback className="bg-primary-foreground text-primary text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="hidden text-sm text-primary-foreground/90 sm:inline">{email}</span>
      <form action={logout}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          title="Cerrar sesion"
          className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
