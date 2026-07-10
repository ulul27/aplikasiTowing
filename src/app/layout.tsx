import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TowingPro | Jasa Towing Profesional & Terpercaya",
  description: "Pesan jasa towing mobil, motor, dan mesin industri dengan harga transparan dan pelayanan cepat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-50 selection:bg-primary-500/30">
        {children}
      </body>
    </html>
  );
}
