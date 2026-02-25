"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { postGpsLocation, getGpsMarker } from "@/lib/api-client";
import { getDeviceId } from "@/lib/device-id";

const MapView = dynamic(() => import("@/components/map-view"), { ssr: false });

const MARKER_STORAGE_KEY = "gps_last_marker";

interface MarkerInfo {
  lat: number;
  lng: number;
  accuracy: number;
  altitude: number;
  ts: string;
}

function saveMarker(m: MarkerInfo) {
  localStorage.setItem(MARKER_STORAGE_KEY, JSON.stringify(m));
}

function loadMarker(): MarkerInfo | null {
  const raw = localStorage.getItem(MARKER_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export default function GpsMapPage() {
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState<MarkerInfo | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState("");
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-set device ID + restore last marker from localStorage
  useEffect(() => {
    setDeviceId(getDeviceId());
    const saved = loadMarker();
    if (saved) setMarker(saved);
  }, []);

  const showStatus = useCallback((msg: string, duration = 3000) => {
    setStatus(msg);
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setStatus(""), duration);
  }, []);

  // Get current location, send to server, then show marker
  const handleMyLocation = useCallback(async () => {
    if (!deviceId) return;
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung");
      return;
    }

    setLoading(true);
    setError("");
    showStatus("📡 Mencari lokasi...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy, altitude } = position.coords;

        showStatus("🚀 Mengirim ke server...");

        const res = await postGpsLocation({
          device_id: deviceId,
          lat: latitude,
          lng: longitude,
          accuracy: accuracy,
          altitude: altitude ?? 0,
          ts: new Date().toISOString(),
        });

        if (res.ok) {
          showStatus("✅ Lokasi tersimpan!");

          const markerRes = await getGpsMarker({ device_id: deviceId });
          const m: MarkerInfo = markerRes.ok && markerRes.data
            ? markerRes.data
            : { lat: latitude, lng: longitude, accuracy, altitude: altitude ?? 0, ts: new Date().toISOString() };

          setMarker(m);
          saveMarker(m); // Persist to localStorage
        } else {
          setError(res.error ?? "Gagal mengirim lokasi");
        }

        setLoading(false);
      },
      (err) => {
        setError(`Gagal mendapatkan lokasi: ${err.message}`);
        setLoading(false);
        setStatus("");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, [deviceId, showStatus]);

  return (
    <div className="space-y-4">
      {/* Device ID bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10 text-sm">
        <span className="text-white/40">📱 Device:</span>
        <span className="text-emerald-400 font-mono">{deviceId || "..."}</span>
      </div>

      {/* Map — always visible */}
      <div className="relative">
        <MapView
          markers={
            marker
              ? [
                  {
                    lat: marker.lat,
                    lng: marker.lng,
                    popup: `📍 ${deviceId}<br/>Akurasi: ${marker.accuracy.toFixed(1)}m<br/>Altitude: ${marker.altitude.toFixed(1)}m<br/>${marker.ts}`,
                  },
                ]
              : []
          }
          className="!h-[450px]"
        />

        {/* Floating My Location button */}
        <button
          onClick={handleMyLocation}
          disabled={loading}
          className="absolute bottom-4 right-4 z-[1000] w-12 h-12 bg-white rounded-full shadow-lg shadow-black/30 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-wait"
          title="Ambil & kirim lokasi saat ini"
        >
          {loading ? (
            <span className="animate-spin text-xl">⏳</span>
          ) : (
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
          )}
        </button>

        {/* Status toast */}
        {status && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-gray-900/90 backdrop-blur-md rounded-full text-sm text-white shadow-lg">
            {status}
          </div>
        )}
      </div>

      {/* Marker info card */}
      {marker && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <span className="text-white/40 text-xs">Latitude</span>
            <p className="text-white font-mono">{marker.lat.toFixed(6)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <span className="text-white/40 text-xs">Longitude</span>
            <p className="text-white font-mono">{marker.lng.toFixed(6)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <span className="text-white/40 text-xs">Akurasi</span>
            <p className="text-white font-mono">{marker.accuracy.toFixed(1)}m</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <span className="text-white/40 text-xs">Waktu</span>
            <p className="text-emerald-400 text-xs">{marker.ts}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm">
          <p className="text-red-400">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
