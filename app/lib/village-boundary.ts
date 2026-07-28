import { resolveLatLng } from "./geo-utils";

// Nama file GeoJSON batas Desa Sambirejo di /public/gis
const BOUNDARY_FILE = "desa_sambirejo.json";

export interface VillageBoundary {
  /** Poligon batas desa, siap dipakai langsung sebagai data <GeoJSON /> */
  feature: GeoJSON.Feature<GeoJSON.Polygon>;
  /** Poligon "dunia dikurangi batas desa", untuk efek masking di luar wilayah */
  maskFeature: GeoJSON.Feature<GeoJSON.Polygon>;
  /** Titik tengah (centroid kasar) batas desa, format [lat, lon] */
  center: [number, number];
}

/**
 * Konversi satu ring (array titik [x,y,...]) menjadi array [lat, lon]
 * memakai resolveLatLng yang sama dipakai untuk marker (auto-detect
 * CRS per titik: WGS84 langsung, atau UTM sesuai crs file / fallback).
 */
function ringToLatLng(
  ring: number[][],
  crsName: string | undefined,
  label: string,
): [number, number][] {
  const points: [number, number][] = [];
  ring.forEach((coord, idx) => {
    const resolved = resolveLatLng(
      [coord[0], coord[1]],
      crsName,
      `${label} vertex #${idx}`,
    );
    if (resolved) points.push(resolved); // [lat, lon]
  });
  return points;
}

export async function loadVillageBoundary(): Promise<VillageBoundary | null> {
  const res = await fetch(`/gis/${BOUNDARY_FILE}`);
  if (!res.ok) {
    console.warn(`[GIS] Gagal memuat batas desa dari ${BOUNDARY_FILE}.`);
    return null;
  }

  const geojson = await res.json();
  const crsName: string | undefined = geojson?.crs?.properties?.name;
  const feature = geojson?.features?.[0];

  if (!feature?.geometry) {
    console.warn(
      `[GIS] ${BOUNDARY_FILE}: tidak ada fitur/geometry yang valid.`,
    );
    return null;
  }

  // Dukung Polygon langsung, atau ambil ring luar dari MultiPolygon
  // (pilih bagian dengan titik terbanyak sebagai wilayah utama).
  let outerRing: number[][] | undefined;
  if (feature.geometry.type === "Polygon") {
    outerRing = feature.geometry.coordinates?.[0];
  } else if (feature.geometry.type === "MultiPolygon") {
    const outerRings = (feature.geometry.coordinates as number[][][][])
      .map((poly) => poly[0])
      .filter(Boolean);
    outerRing = outerRings.reduce((a, b) => (b.length > a.length ? b : a));
  }

  if (!outerRing || outerRing.length < 3) {
    console.warn(
      `[GIS] ${BOUNDARY_FILE}: geometry "${feature.geometry.type}" tidak didukung sebagai batas desa.`,
    );
    return null;
  }

  const latLngPoints = ringToLatLng(outerRing, crsName, BOUNDARY_FILE);
  if (latLngPoints.length < 3) {
    console.warn(
      `[GIS] ${BOUNDARY_FILE}: jumlah titik batas desa tidak cukup setelah konversi.`,
    );
    return null;
  }

  // GeoJSON standar pakai urutan [lon, lat]
  const ringLonLat: [number, number][] = latLngPoints.map(([lat, lon]) => [
    lon,
    lat,
  ]);

  // Pastikan ring tertutup (titik awal = titik akhir)
  const first = ringLonLat[0];
  const last = ringLonLat[ringLonLat.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ringLonLat.push(first);
  }

  const villageName: string =
    feature.properties?.NAMOBJ?.trim?.() ||
    feature.properties?.name ||
    "Desa Sambirejo";

  const boundaryFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: { name: villageName },
    geometry: {
      type: "Polygon",
      coordinates: [ringLonLat],
    },
  };

  const maskFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    properties: { name: "Outside Mask" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90],
        ],
        ringLonLat,
      ],
    },
  };

  // Centroid kasar (rata-rata titik) untuk posisi awal peta
  const sumLat = latLngPoints.reduce((s, [lat]) => s + lat, 0);
  const sumLon = latLngPoints.reduce((s, [, lon]) => s + lon, 0);
  const center: [number, number] = [
    sumLat / latLngPoints.length,
    sumLon / latLngPoints.length,
  ];

  return { feature: boundaryFeature, maskFeature, center };
}
