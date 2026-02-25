"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "🗺️ Map", href: "/gps/map" },
  { label: "📍 Riwayat Path", href: "/gps/polyline" },
];

export default function GpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          🌐 GPS + Peta
        </h1>
        <p className="text-white/40 text-sm">Kirim lokasi, lihat marker, dan riwayat perjalanan</p>
      </div>

      <nav className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 text-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              pathname === tab.href
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
