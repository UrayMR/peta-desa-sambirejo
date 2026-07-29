"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export interface FlyTarget {
  pos: [number, number];
  zoom: number;
  /** Nilai unik supaya effect tetap jalan walau target sama persis diklik ulang */
  nonce: number;
  /**
   * Geser pusat kamera ke bawah sejauh N piksel (opsional). Dipakai saat
   * fokus ke marker supaya gabungan popup (yang muncul di ATAS marker)
   * dan marker itu sendiri terlihat center di layar - bukan cuma titik
   * markernya saja yang center (yang bikin tampilan jadi "mepet atas").
   */
  offsetY?: number;
  /**
   * Kalau true, popup yang sedang terbuka (kalau ada) akan ditutup
   * sebelum kamera bergerak. Dipakai khusus untuk aksi "kembali ke desa",
   * BUKAN saat fokus ke marker (supaya popup marker yang baru diklik
   * tidak ikut ketutup).
   */
  closePopup?: boolean;
}

/**
 * Komponen kontrol kamera peta:
 * - Mengatur tampilan awal ke pusat desa (dan mengikuti kalau data batas
 *   desa baru selesai dimuat), TAPI dilewati kalau user sudah pernah
 *   fokus ke suatu lokasi (supaya tidak menimpa posisi yang sedang dilihat).
 * - Menganimasikan kamera (flyTo) ke titik yang difokuskan saat marker
 *   diklik atau saat tombol "kembali ke desa" ditekan.
 * - Menutup popup yang sedang terbuka saat aksi "kembali ke desa" dipicu.
 */
export function MapController({
  villageCenter,
  hasUserFocused,
  flyTarget,
}: {
  villageCenter: [number, number];
  hasUserFocused: boolean;
  flyTarget: FlyTarget | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!hasUserFocused) {
      map.setView(villageCenter, map.getZoom());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [villageCenter[0], villageCenter[1]]);

  useEffect(() => {
    if (flyTarget) {
      if (flyTarget.closePopup) {
        map.closePopup();
      }

      const { pos, zoom, offsetY } = flyTarget;
      let target = L.latLng(pos[0], pos[1]);

      if (offsetY) {
        // Geser titik pusat kamera ke ATAS (dalam ruang piksel) sejauh
        // offsetY, supaya marker (yang tetap di posisi aslinya) akan
        // tampak di BAWAH pusat layar sejauh offsetY piksel - memberi
        // ruang untuk popup yang muncul di atasnya.
        const targetPoint = map.project(target, zoom);
        const shiftedPoint = targetPoint.subtract([0, offsetY]);
        target = map.unproject(shiftedPoint, zoom);
      }

      map.flyTo(target, zoom, { duration: 1.1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTarget?.nonce]);

  return null;
}
