import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biblioteca API",
  description: "Sistema de biblioteca con Next.js, Prisma y Supabase",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
