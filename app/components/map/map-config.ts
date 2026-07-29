// ----------------------------------------------------------------------
// KONSTANTA & DATA CADANGAN UNTUK PETA
// ----------------------------------------------------------------------

// Poligon & pusat peta CADANGAN, dipakai hanya jika desa-sambirejo.json
// gagal dimuat. Data batas desa yang sebenarnya diambil dari
// /gis/desa-sambirejo.json lewat loadVillageBoundary().
export const FALLBACK_SAMBIREJO_GEOJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
  type: "Feature",
  properties: { name: "Desa Sambirejo" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [112.368, -7.705],
        [112.385, -7.702],
        [112.398, -7.712],
        [112.41, -7.725],
        [112.395, -7.728],
        [112.38, -7.72],
        [112.368, -7.715],
        [112.368, -7.705],
      ],
    ],
  },
};

export const FALLBACK_OUTSIDE_MASK_GEOJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
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
      FALLBACK_SAMBIREJO_GEOJSON.geometry.coordinates[0],
    ],
  },
};

export const FALLBACK_CENTER: [number, number] = [-7.714, 112.387];

// Zoom saat menampilkan seluruh desa vs. saat fokus ke satu titik lokasi.
// Zoom 18 dipilih karena cukup dekat untuk melihat detail bangunan/area
// per titik, tapi masih dalam batas wajar tile satelit/vektor yang dipakai.
export const VILLAGE_ZOOM = 14;
export const FOCUS_ZOOM = 18;

// Perkiraan setengah tinggi kartu popup (gambar + judul + deskripsi +
// tombol) dalam piksel. Dipakai untuk menggeser pusat kamera ke bawah
// saat fokus ke marker, supaya popup+marker terlihat center, bukan
// cuma markernya. Sesuaikan angka ini kalau ukuran/isi popup berubah.
export const POPUP_VERTICAL_OFFSET = 130;

export const CATEGORIES = [
  "Semua",
  "Wisata",
  "UMKM & Kuliner",
  "Fasilitas Publik",
  "Kesehatan",
  "Tempat Ibadah",
] as const;
