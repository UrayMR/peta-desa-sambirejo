// ----------------------------------------------------------------------
// UTILITAS BERSAMA UNTUK MEMBACA KOORDINAT DARI FILE GEOJSON DI /public/gis
//
// File-file di proyek ini TIDAK semua pakai proyeksi yang sama:
//  - Sebagian sudah lon/lat WGS84 langsung, tanpa properti "crs"
//    (biasanya properti kaya: OBJECTID, NAMOBJ, REMARK, dst).
//  - Sebagian pakai UTM meter dengan properti "crs" (EPSG:32749 = zona
//    49S, EPSG:32748 = zona 48S, dst) dan properti sederhana FID/Id.
// Modul ini dipakai bersama oleh gis-sources.ts (marker titik) dan
// village-boundary.ts (poligon batas desa).
// ----------------------------------------------------------------------
import { utmToLatLng } from "./utm";

export type RawPoint = [number, number];

// Rata-rata sederhana dari titik-titik sebuah ring/garis. Titik penutup
// (yang sama dengan titik awal pada Polygon) dibuang dulu supaya tidak
// bias, lalu dirata-ratakan sebagai perkiraan titik tengah (centroid).
export function averagePoints(points: number[][]): RawPoint | null {
  if (!points || points.length === 0) return null;
  const sum = points.reduce(
    (acc, pt) => [acc[0] + pt[0], acc[1] + pt[1]],
    [0, 0],
  );
  return [sum[0] / points.length, sum[1] / points.length];
}

export function ringCentroid(ring: number[][]): RawPoint | null {
  if (!ring || ring.length === 0) return null;
  const isClosed =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1];
  const pts = isClosed ? ring.slice(0, -1) : ring;
  return averagePoints(pts.length > 0 ? pts : ring);
}

/**
 * Ambil satu titik mentah (x, y - belum dikonversi) representatif dari
 * sebuah geometry GeoJSON, apapun tipenya (Point, MultiPoint, LineString,
 * Polygon, MultiPolygon, atau GeometryCollection). Untuk area/garis,
 * dipakai titik tengah (centroid) sebagai perkiraan posisi marker.
 */
export function getRepresentativeRawPoint(geometry: any): RawPoint | null {
  if (!geometry) return null;

  switch (geometry.type) {
    case "Point":
      return [geometry.coordinates[0], geometry.coordinates[1]];

    case "MultiPoint":
      return averagePoints(geometry.coordinates);

    case "LineString": {
      const pts: number[][] = geometry.coordinates;
      if (!pts || pts.length === 0) return null;
      return pts[Math.floor(pts.length / 2)] as RawPoint;
    }

    case "MultiLineString": {
      const lines: number[][][] = geometry.coordinates;
      if (!lines || lines.length === 0) return null;
      const longest = lines.reduce((a, b) => (b.length > a.length ? b : a));
      return longest[Math.floor(longest.length / 2)] as RawPoint;
    }

    case "Polygon":
      return ringCentroid(geometry.coordinates?.[0]);

    case "MultiPolygon": {
      const polys: number[][][][] = geometry.coordinates;
      if (!polys || polys.length === 0) return null;
      const outerRings = polys.map((p) => p[0]).filter(Boolean);
      const best = outerRings.reduce((a, b) => (b.length > a.length ? b : a));
      return ringCentroid(best);
    }

    case "GeometryCollection": {
      for (const g of geometry.geometries || []) {
        const p = getRepresentativeRawPoint(g);
        if (p) return p;
      }
      return null;
    }

    default:
      return null;
  }
}

// Kotak perkiraan area Desa Sambirejo & sekitarnya (Wonosalam, Jombang).
// Dipakai untuk memvalidasi hasil konversi koordinat - kalau hasilnya
// jatuh jauh di luar kotak ini, dicoba proyeksi lain.
export const REGION_BOUNDS = {
  minLat: -8.5,
  maxLat: -7.0,
  minLon: 111.5,
  maxLon: 113.0,
};

export function inRegion(lat: number, lon: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= REGION_BOUNDS.minLat &&
    lat <= REGION_BOUNDS.maxLat &&
    lon >= REGION_BOUNDS.minLon &&
    lon <= REGION_BOUNDS.maxLon
  );
}

/** Baca kode EPSG dari nama crs GeoJSON, mis. "EPSG:32749" -> zona 49 selatan. */
export function parseUtmEpsg(
  crsName: string | undefined,
): { zone: number; south: boolean } | null {
  if (!crsName) return null;
  const match = /EPSG:(\d+)/i.exec(crsName);
  if (!match) return null;
  const code = parseInt(match[1], 10);
  if (code >= 32601 && code <= 32660)
    return { zone: code - 32600, south: false };
  if (code >= 32701 && code <= 32760)
    return { zone: code - 32700, south: true };
  return null;
}

/**
 * Konversi satu titik mentah menjadi [lat, lon] final, dengan mencoba
 * beberapa kemungkinan proyeksi dan memilih yang paling masuk akal
 * (berada di sekitar Desa Sambirejo). Ini membuat loader tahan terhadap
 * file yang crs-nya tidak konsisten atau salah label.
 */
export function resolveLatLng(
  rawPoint: RawPoint,
  declaredCrsName: string | undefined,
  featureLabel: string,
): [number, number] | null {
  const [x, y] = rawPoint;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  const candidates: { lat: number; lon: number; method: string }[] = [];

  // 1. Kandidat sesuai CRS yang dideklarasikan file (jika ada & valid)
  const declared = parseUtmEpsg(declaredCrsName);
  if (declared) {
    const [lat, lon] = utmToLatLng(x, y, declared.zone, declared.south);
    candidates.push({
      lat,
      lon,
      method: `crs file (UTM ${declared.zone}${declared.south ? "S" : "N"})`,
    });
  }

  // 2. Kandidat: koordinat sudah lon/lat langsung (tanpa proyeksi)
  if (Math.abs(x) <= 180 && Math.abs(y) <= 90) {
    candidates.push({ lat: y, lon: x, method: "wgs84-langsung" });
  }

  // 3. Kandidat fallback: paksa UTM 49S / 48S (dua zona yang terpakai di
  //    dataset ini), untuk menangani file yang crs-nya salah label.
  for (const zone of [49, 48]) {
    const [lat, lon] = utmToLatLng(x, y, zone, true);
    candidates.push({ lat, lon, method: `paksa UTM ${zone}S` });
  }

  // Pilih kandidat pertama yang berada di sekitar Desa Sambirejo
  const best = candidates.find((c) => inRegion(c.lat, c.lon));
  if (best) {
    return [best.lat, best.lon];
  }

  // Tidak ada kandidat yang masuk akal -> pakai kandidat pertama & beri peringatan
  if (candidates.length > 0) {
    console.warn(
      `[GIS] ${featureLabel}: tidak ada hasil konversi yang berada di sekitar Sambirejo. ` +
        `Memakai perkiraan terbaik (${candidates[0].method}) - mohon cek ulang CRS file ini.`,
    );
    return [candidates[0].lat, candidates[0].lon];
  }

  return null;
}
