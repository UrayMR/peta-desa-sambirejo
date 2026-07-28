// ----------------------------------------------------------------------
// KONVERSI KOORDINAT UTM -> WGS84 (lat/lng)
// File GeoJSON di /public/gis menggunakan proyeksi UTM (mis. EPSG:32749,
// Zona 49S), sehingga perlu dikonversi manual sebelum dipakai sebagai
// posisi Marker Leaflet (yang butuh lat/lng biasa / EPSG:4326).
// ----------------------------------------------------------------------

function toDegrees(rad: number) {
  return (rad * 180) / Math.PI;
}

/**
 * Konversi satu titik UTM ke [lat, lng].
 *
 * @param easting - koordinat X (meter)
 * @param northing - koordinat Y (meter)
 * @param zoneNumber - nomor zona UTM (mis. 49 untuk EPSG:32749)
 * @param isSouthernHemisphere - true jika zona "S" (belahan bumi selatan)
 */
export function utmToLatLng(
  easting: number,
  northing: number,
  zoneNumber: number,
  isSouthernHemisphere: boolean,
): [number, number] {
  const a = 6378137.0; // WGS84 semi-major axis
  const eccSquared = 0.00669438; // WGS84 eccentricity squared
  const k0 = 0.9996;

  const e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));

  const x = easting - 500000.0;
  let y = northing;
  if (isSouthernHemisphere) {
    y -= 10000000.0;
  }

  const longOrigin = (zoneNumber - 1) * 6 - 180 + 3;
  const eccPrimeSquared = eccSquared / (1 - eccSquared);

  const M = y / k0;
  const mu =
    M /
    (a *
      (1 -
        eccSquared / 4 -
        (3 * eccSquared * eccSquared) / 64 -
        (5 * Math.pow(eccSquared, 3)) / 256));

  const phi =
    mu +
    ((3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * Math.pow(e1, 4)) / 32) * Math.sin(4 * mu) +
    ((151 * Math.pow(e1, 3)) / 96) * Math.sin(6 * mu) +
    ((1097 * Math.pow(e1, 4)) / 512) * Math.sin(8 * mu);

  const N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi) * Math.sin(phi));
  const T1 = Math.tan(phi) * Math.tan(phi);
  const C1 = eccPrimeSquared * Math.cos(phi) * Math.cos(phi);
  const R1 =
    (a * (1 - eccSquared)) /
    Math.pow(1 - eccSquared * Math.sin(phi) * Math.sin(phi), 1.5);
  const D = x / (N1 * k0);

  let lat =
    phi -
    ((N1 * Math.tan(phi)) / R1) *
      ((D * D) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) *
          Math.pow(D, 4)) /
          24 +
        ((61 +
          90 * T1 +
          298 * C1 +
          45 * T1 * T1 -
          252 * eccPrimeSquared -
          3 * C1 * C1) *
          Math.pow(D, 6)) /
          720);
  lat = toDegrees(lat);

  let lon =
    (D -
      ((1 + 2 * T1 + C1) * Math.pow(D, 3)) / 6 +
      ((5 -
        2 * C1 +
        28 * T1 -
        3 * C1 * C1 +
        8 * eccPrimeSquared +
        24 * T1 * T1) *
        Math.pow(D, 5)) /
        120) /
    Math.cos(phi);
  lon = longOrigin + toDegrees(lon);

  return [lat, lon];
}
