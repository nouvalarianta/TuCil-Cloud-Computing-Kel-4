"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const dosenTabs = [
  { label: "Generate QR", href: "/presence/generate", icon: "🔑" },
];

const mahasiswaTabs = [
  { label: "Scan & Check-in", href: "/presence/scan", icon: "📷" },
  { label: "Status", href: "/presence/status", icon: "📋" },
];

export default function PresenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine which role's tabs to show
  const isRoleSelect = pathname === "/presence";
  const isDosen = pathname.startsWith("/presence/generate");
  const isMahasiswa =
    pathname.startsWith("/presence/scan") ||
    pathname.startsWith("/presence/status");

  const tabs = isDosen ? dosenTabs : isMahasiswa ? mahasiswaTabs : [];
  const roleLabel = isDosen ? "👨‍🏫 Dosen" : isMahasiswa ? "🎓 Mahasiswa" : "";

  return (
    <div>
      {/* Page header — only show when inside a role */}
      {!isRoleSelect && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              📱 Presensi QR Dinamis
            </h1>
            <Link
              href="/presence"
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
            >
              {roleLabel} · Ganti Role
            </Link>
          </div>
          <p className="text-white/40 text-sm">
            Generate token, scan QR, dan cek status presensi
          </p>
        </div>
      )}

      {/* Tab navigation — only when inside a role */}
      {tabs.length > 0 && (
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/5 mb-6">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/20"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}

      {children}
    </div>
  );
}
