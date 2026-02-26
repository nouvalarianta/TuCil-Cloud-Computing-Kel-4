import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kelompok 4 — Praktik Komputasi Awan",
  description: "Sistem presensi QR dinamis, accelerometer, dan GPS berbasis cloud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-white min-h-screen`}>
        {/* Gradient background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
          {children}
        </main>

        <BottomNav />
      </body>
    </html>
  );
}
