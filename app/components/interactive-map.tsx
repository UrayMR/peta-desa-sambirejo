"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  GeoJSON,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { LocationItem, loadGisLocations } from "@/app/lib/gis-sources";
import {
  loadVillageBoundary,
  VillageBoundary,
} from "@/app/lib/village-boundary";

// ----------------------------------------------------------------------
// POLIGON & PUSAT PETA CADANGAN (dipakai hanya jika desa-sambirejo.json
// gagal dimuat). Data batas desa yang sebenarnya diambil dari
// /gis/desa-sambirejo.json lewat loadVillageBoundary().
// ----------------------------------------------------------------------
const FALLBACK_SAMBIREJO_GEOJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
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

const FALLBACK_OUTSIDE_MASK_GEOJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
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

const FALLBACK_CENTER: [number, number] = [-7.714, 112.387];

const CATEGORIES = [
  "Semua",
  "Wisata",
  "UMKM & Kuliner",
  "Fasilitas Publik",
  "Kesehatan",
  "Tempat Ibadah",
] as const;

const getCategoryColor = (category: LocationItem["category"]) => {
  switch (category) {
    case "Wisata":
      return { bg: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-800" };
    case "UMKM & Kuliner":
      return { bg: "bg-amber-500", badge: "bg-amber-100 text-amber-900" };
    case "Fasilitas Publik":
      return { bg: "bg-blue-600", badge: "bg-blue-100 text-blue-800" };
    case "Kesehatan":
      return { bg: "bg-rose-500", badge: "bg-rose-100 text-rose-800" };
    case "Tempat Ibadah":
      return { bg: "bg-purple-600", badge: "bg-purple-100 text-purple-900" };
    default:
      return { bg: "bg-teal-600", badge: "bg-teal-100 text-teal-800" };
  }
};

const createCustomIcon = (category: LocationItem["category"]) => {
  const { bg } = getCategoryColor(category);

  const htmlContent = `
    <div class="relative group cursor-pointer flex flex-col items-center">
      <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full ${bg} text-white flex items-center justify-center shadow-md border-2 border-white transform group-hover:scale-125 transition-all duration-300">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div class="w-2 h-2 ${bg} rotate-45 -mt-1 rounded-sm border-r border-b border-white"></div>
    </div>
  `;

  return L.divIcon({
    className: "custom-leaflet-div-icon",
    html: htmlContent,
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -34],
  });
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function InteractiveMap() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [boundary, setBoundary] = useState<VillageBoundary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Ambil semua titik lokasi dari file GeoJSON di /public/gis, sekaligus
  // batas Desa Sambirejo dari /gis/desa-sambirejo.json.
  // (konversi CRS dilakukan di dalam lib/geo-utils.ts)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setLoadError(null);
      try {
        const [items, villageBoundary] = await Promise.all([
          loadGisLocations(),
          loadVillageBoundary(),
        ]);
        if (!cancelled) {
          setLocations(items);
          setBoundary(villageBoundary);
        }
      } catch (err) {
        console.error("Gagal memuat data GIS:", err);
        if (!cancelled) {
          setLoadError(
            "Sebagian data lokasi gagal dimuat. Periksa file di folder /public/gis.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLocations = useMemo(() => {
    if (selectedCategory === "Semua") return locations;
    return locations.filter((loc) => loc.category === selectedCategory);
  }, [selectedCategory, locations]);

  const mapCenter = boundary?.center ?? FALLBACK_CENTER;
  const boundaryFeature = boundary?.feature ?? FALLBACK_SAMBIREJO_GEOJSON;
  const maskFeature = boundary?.maskFeature ?? FALLBACK_OUTSIDE_MASK_GEOJSON;

  return (
    <div className="relative w-full h-[520px] sm:h-[650px] rounded-2xl overflow-hidden shadow-xl border border-emerald-100 bg-stone-100">
      {/* 1. FILTER TOP BAR RESPONSIF */}
      <div className="absolute top-2.5 left-2.5 right-14 sm:right-auto z-[1000] max-w-[calc(100%-4rem)] sm:max-w-xl">
        <div className="flex gap-1 bg-white/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-md border border-emerald-100/80 overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap flex items-center shrink-0 ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-emerald-950 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Indikator loading / error data GIS */}
      {(loading || loadError) && (
        <div className="absolute top-14 left-2.5 z-[1000]">
          <div
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-md ${
              loadError
                ? "bg-rose-100/95 text-rose-700 border border-rose-200"
                : "bg-white/90 text-emerald-800 border border-emerald-100"
            }`}
          >
            {loadError ?? "Memuat data lokasi..."}
          </div>
        </div>
      )}

      {/* 2. MAP CONTAINER */}
      <MapContainer
        center={mapCenter}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full z-0 font-sans"
      >
        <ChangeView center={mapCenter} />

        {/* Control Zoom di kanan bawah */}
        <ZoomControl position="bottomright" />

        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Peta Vektor">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="Satelit ArcGIS">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* MASKING LAYER */}
        <GeoJSON
          key={boundary ? "mask-real" : "mask-fallback"}
          data={maskFeature}
          style={{
            fillColor: "#ffffff",
            fillOpacity: 0.75,
            stroke: false,
          }}
        />

        {/* GARIS BATAS SAMBIREJO */}
        <GeoJSON
          key={boundary ? "boundary-real" : "boundary-fallback"}
          data={boundaryFeature}
          style={{
            color: "#eab308",
            weight: 3,
            dashArray: "6, 6",
            fillOpacity: 0,
          }}
        />

        {/* MARKERS DARI DATA GIS */}
        {filteredLocations.map((loc) => {
          const badgeStyle = getCategoryColor(loc.category).badge;

          return (
            <Marker
              key={loc.id}
              position={loc.pos}
              icon={createCustomIcon(loc.category)}
            >
              <Popup className="custom-leaflet-popup" maxWidth={260}>
                <div className="overflow-hidden rounded-lg font-sans -m-3 p-1">
                  <div className="relative h-28 w-full overflow-hidden rounded-t-md bg-stone-200">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm ${badgeStyle}`}
                    >
                      {loc.category}
                    </span>
                  </div>

                  <div className="p-2.5">
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-950 leading-tight mb-1">
                      {loc.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-2 mb-2 leading-relaxed">
                      {loc.description}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${loc.pos[0]},${loc.pos[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white! text-[11px] font-semibold py-1 px-2.5 rounded-md transition duration-200 no-underline"
                    >
                      Petunjuk Arah
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* 3. LEGENDA RESPONSIF (Toggleable & Compact) */}
      <div className="absolute bottom-3 left-2.5 z-[1000] max-w-[200px] sm:max-w-[220px]">
        {/* Tombol Ringkas Legenda khusus Mobile saat tertutup */}
        {!isLegendOpen && (
          <button
            onClick={() => setIsLegendOpen(true)}
            className="sm:hidden bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-emerald-100 text-[11px] font-bold text-emerald-950 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Legenda ({filteredLocations.length})
          </button>
        )}

        {/* Box Legenda */}
        <div
          className={`bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-xl border border-emerald-100 text-xs transition-all duration-300 ${
            isLegendOpen ? "block" : "hidden sm:block"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-stone-100">
            <h3 className="font-bold text-[11px] sm:text-xs text-emerald-950 flex items-center gap-1">
              Legenda Peta
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-[9px] sm:text-[10px] text-stone-400 font-medium mr-1">
                {filteredLocations.length} Titik
              </span>
              <button
                onClick={() => setIsLegendOpen(false)}
                className="sm:hidden text-stone-400 hover:text-stone-600 px-1 py-0.5 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-1 sm:space-y-1.5 mb-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span>Wisata</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span>UMKM & Kuliner</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span>Fasilitas Publik</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>Kesehatan</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
              <span>Tempat Ibadah</span>
            </div>
          </div>

          {/* Batas Wilayah */}
          <div className="pt-1.5 border-t border-stone-100 space-y-0.5">
            <div className="flex items-center gap-1.5 text-stone-800 font-medium text-[9px] sm:text-[11px]">
              <span className="w-3 h-0.5 border-b-2 border-dashed border-amber-500 shrink-0"></span>
              <span>Batas Desa Sambirejo</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400 text-[8px] sm:text-[10px]">
              <span className="w-2.5 h-2.5 bg-stone-200/80 border border-stone-300 rounded shrink-0"></span>
              <span>Luar Wilayah</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
