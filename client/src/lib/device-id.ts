"use client";

/**
 * Generate a persistent device ID stored in localStorage.
 * Unique per browser/device.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "unknown";

  const KEY = "gps_device_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = "DEV-" + crypto.randomUUID().substring(0, 8).toUpperCase();
    localStorage.setItem(KEY, id);
  }
  return id;
}
