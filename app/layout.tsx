import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Humoller Inmobiliaria",
  description: "Sistema de gestion de alquileres de Humoller Inmobiliaria",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
