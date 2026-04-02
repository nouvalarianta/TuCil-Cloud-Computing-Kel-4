"use client";

import { useState, useEffect } from "react";
import { GAS_EXTERNAL_URL } from "@/lib/gas-config";

export default function SettingsPage() {
  const [gasTarget, setGasTarget] = useState<"own" | "external">("own");
  const [externalUrl, setExternalUrl] = useState(GAS_EXTERNAL_URL || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedTarget = localStorage.getItem("gasTarget") as "own" | "external";
    const savedUrl = localStorage.getItem("gasExternalUrl");
    if (savedTarget) setGasTarget(savedTarget);
    if (savedUrl) setExternalUrl(savedUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem("gasTarget", gasTarget);
    localStorage.setItem("gasExternalUrl", externalUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto pb-12 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold mb-6">⚙️ Pengaturan Swap Test</h1>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4 text-white/90">Target GAS Backend</h2>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setGasTarget("own")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
              gasTarget === "own"
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                : "text-white/50 border border-white/10 hover:bg-white/5"
            }`}
          >
            🏠 GAS Sendiri
          </button>
          <button
            onClick={() => setGasTarget("external")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
              gasTarget === "external"
                ? "bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/10"
                : "text-white/50 border border-white/10 hover:bg-white/5"
            }`}
          >
            🌐 GAS Eksternal
          </button>
        </div>

        {gasTarget === "external" && (
          <div className="mb-6 p-4 bg-violet-500/5 border border-violet-500/10 rounded-xl">
            <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block font-medium">
              URL Tujuan GAS Eksternal
            </label>
            <input
              type="text"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-violet-400 font-mono focus:outline-none focus:border-violet-500/50"
            />
            <p className="text-xs text-white/30 mt-2">
              URL ini akan otomatis digunakan di seluruh halaman absensi (Scanner dan Generate) jika mode "GAS Eksternal" aktif.
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
            saved
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10"
          }`}
        >
          {saved ? "✅ Berhasil Disimpan" : "Simpan Pengaturan"}
        </button>
      </div>

      <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-sm text-white/70">
        <p className="font-semibold text-blue-400 mb-1">Informasi Global</p>
        <p>Dengan memusatkan pengaturan di sini, tampilan di halaman Scanner dan Generate akan menjadi lebih bersih, tanpa perlu input ulang link.</p>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
