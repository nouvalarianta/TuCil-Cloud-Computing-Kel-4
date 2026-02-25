"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MarkerData {
  lat: number;
  lng: number;
  popup?: string;
}

interface PolylinePoint {
  lat: number;
  lng: number;
  ts?: string;
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markers?: MarkerData[];
  polyline?: PolylinePoint[];
  className?: string;
}

export default function MapView({
  center = [-6.2, 106.8], // Default: Jakarta
  zoom = 13,
  markers = [],
  polyline = [],
  className = "",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], { icon: defaultIcon }).addTo(map);
      if (m.popup) marker.bindPopup(m.popup).openPopup();
    });

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 15);
    } else if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers]);

  // Update polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        map.removeLayer(layer);
      }
    });

    if (polyline.length > 0) {
      const latLngs: L.LatLngExpression[] = polyline.map((p) => [p.lat, p.lng]);
      const line = L.polyline(latLngs, {
        color: "#8b5cf6",
        weight: 4,
        opacity: 0.8,
      }).addTo(map);

      // Add start/end markers
      const start = polyline[0];
      const end = polyline[polyline.length - 1];

      L.marker([start.lat, start.lng], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(`Start: ${start.ts || ""}`)
        .openPopup();

      if (polyline.length > 1) {
        L.marker([end.lat, end.lng], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`End: ${end.ts || ""}`);
      }

      map.fitBounds(line.getBounds(), { padding: [50, 50] });
    }
  }, [polyline]);

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-xl overflow-hidden border border-white/10 ${className}`}
      style={{ height: "400px" }}
    />
  );
}
