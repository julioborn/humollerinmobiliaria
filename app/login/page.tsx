import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center gap-2 text-center">
          <Image
            src="/logo-humoller.jpg"
            alt="Humoller Inmobiliaria"
            width={64}
            height={64}
            className="rounded-md"
            priority
          />
          <CardTitle>RentaControl Online</CardTitle>
          <CardDescription>Humoller Inmobiliaria — acceso interno</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
