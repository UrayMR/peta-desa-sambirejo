// app/components/interactive-map.tsx
"use client";

import { useState, useMemo } from "react";
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

// ----------------------------------------------------------------------
// DATA GEOJSON POLIGON SAMBIREJO & MASKING
// ----------------------------------------------------------------------
const SAMBIREJO_GEOJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
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

const OUTSIDE_MASK_GEOJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
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
      SAMBIREJO_GEOJSON.geometry.coordinates[0],
    ],
  },
};

export interface LocationItem {
  id: number;
  name: string;
  pos: [number, number];
  category:
    | "Wisata"
    | "Fasilitas Publik"
    | "Kesehatan"
    | "UMKM & Kuliner"
    | "Perkebunan";
  description: string;
  image: string;
  address: string;
  rating?: number;
}

const LOCATIONS: LocationItem[] = [
  {
    id: 1,
    name: "Balai Desa Sambirejo",
    pos: [-7.7123, 112.3854],
    category: "Fasilitas Publik",
    description:
      "Pusat pelayanan administrasi dan pemerintahan masyarakat Desa Sambirejo.",
    image:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80",
    address: "Jl. Raya Sambirejo No. 01, Wonosalam",
  },
  {
    id: 2,
    name: "Kampung Durian Sambirejo",
    pos: [-7.718, 112.389],
    category: "Wisata",
    description:
      "Destinasi wisata agrowisata petik durian Bido khas Wonosalam.",
    image:
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
    address: "Dusun Sambirejo, Wonosalam",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Poskesdes Sambirejo",
    pos: [-7.71, 112.382],
    category: "Kesehatan",
    description:
      "Pelayanan kesehatan dasar bagi warga desa dan pertolongan pertama.",
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
    address: "RT 02 / RW 01, Desa Sambirejo",
  },
  {
    id: 4,
    name: "Kedai Kopi Excelsa Sambirejo",
    pos: [-7.7145, 112.3875],
    category: "UMKM & Kuliner",
    description: "Nikmati cita rasa Kopi Excelsa asli lereng Anjasmoro.",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    address: "Dusun Krajan, Sambirejo",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Kebun Cengkeh & Kopi Organik",
    pos: [-7.708, 112.388],
    category: "Perkebunan",
    description:
      "Kawasan perkebunan warga produsen utama cengkeh dan biji kopi berkualitas.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
    address: "Sambirejo bagian Utara",
  },
];

const SAMBIREJO_CENTER: [number, number] = [-7.714, 112.387];
const CATEGORIES = [
  "Semua",
  "Wisata",
  "UMKM & Kuliner",
  "Fasilitas Publik",
  "Kesehatan",
  "Perkebunan",
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
    case "Perkebunan":
      return { bg: "bg-lime-600", badge: "bg-lime-100 text-lime-900" };
    default:
      return { bg: "bg-teal-600", badge: "bg-teal-100 text-teal-800" };
  }
};

const createCustomIcon = (category: LocationItem["category"]) => {
  const { bg } = getCategoryColor(category);

  const htmlContent = `
    <div class="relative group cursor-pointer flex flex-col items-center">
      <div class="w-8 h-8 rounded-full ${bg} text-white flex items-center justify-center shadow-md border-2 border-white transform group-hover:scale-125 transition-all duration-300">
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
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true); // State untuk toggle legenda di mobile

  const filteredLocations = useMemo(() => {
    if (selectedCategory === "Semua") return LOCATIONS;
    return LOCATIONS.filter((loc) => loc.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="relative w-full h-[550px] sm:h-[650px] rounded-2xl overflow-hidden shadow-xl border border-emerald-100 bg-stone-100">
      {/* 1. FILTER TOP BAR (RESPONSIF - Diberi margin-right agar tidak nabrak LayerControl) */}
      <div className="absolute top-3 left-3 right-14 sm:right-auto z-[1000] max-w-[calc(100%-4.5rem)] sm:max-w-xl">
        <div className="flex gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-emerald-100/80 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1 shrink-0 ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/20 scale-102"
                    : "text-emerald-950 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAP CONTAINER */}
      <MapContainer
        center={SAMBIREJO_CENTER}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false} // Matikan zoom default di kiri atas (AGAR TIDAK NABRAK)
        className="w-full h-full z-0 font-sans"
      >
        <ChangeView center={SAMBIREJO_CENTER} />

        {/* Pindahkan Tombol Zoom ke Kanan Bawah */}
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
          data={OUTSIDE_MASK_GEOJSON}
          style={{
            fillColor: "#ffffff",
            fillOpacity: 0.75,
            stroke: false,
          }}
        />

        {/* GARIS BATAS SAMBIREJO */}
        <GeoJSON
          data={SAMBIREJO_GEOJSON}
          style={{
            color: "#eab308",
            weight: 3,
            dashArray: "6, 6",
            fillOpacity: 0,
          }}
        />

        {/* MARKERS */}
        {filteredLocations.map((loc) => {
          const badgeStyle = getCategoryColor(loc.category).badge;

          return (
            <Marker
              key={loc.id}
              position={loc.pos}
              icon={createCustomIcon(loc.category)}
            >
              <Popup className="custom-leaflet-popup" maxWidth={280}>
                <div className="overflow-hidden rounded-xl font-sans -m-3 p-1">
                  <div className="relative h-32 w-full overflow-hidden rounded-t-lg bg-stone-200">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                    />
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${badgeStyle}`}
                    >
                      {loc.category}
                    </span>
                  </div>

                  <div className="p-3">
                    <h4 className="font-bold text-sm text-emerald-950 leading-tight mb-1">
                      {loc.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mb-2 leading-relaxed">
                      {loc.description}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${loc.pos[0]},${loc.pos[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white! text-xs font-semibold py-1.5 px-3 rounded-lg transition duration-200 shadow-sm no-underline"
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

      {/* 3. LEGENDA RESPONSIF (Dapat di-toggle di Layar HP) */}
      <div className="absolute bottom-3 left-3 z-[1000] max-w-[220px]">
        {/* Tombol Toggle Legenda khusus tampilan Mobile jika ditutup */}
        {!isLegendOpen && (
          <button
            onClick={() => setIsLegendOpen(true)}
            className="sm:hidden bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-emerald-100 text-xs font-bold text-emerald-950 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              ></path>
            </svg>
            Legenda
          </button>
        )}

        {/* Box Legenda */}
        <div
          className={`bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-emerald-100 text-xs transition-all duration-300 ${
            isLegendOpen ? "block" : "hidden sm:block"
          }`}
        >
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-100">
            <h3 className="font-bold text-emerald-950 flex items-center gap-1.5">
              Legenda Peta
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-stone-400 font-medium mr-1">
                {filteredLocations.length} Titik
              </span>
              {/* Button Close Legenda di Mobile */}
              <button
                onClick={() => setIsLegendOpen(false)}
                className="sm:hidden text-stone-400 hover:text-stone-600 p-0.5"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-1.5 mb-2.5">
            <div className="flex items-center gap-2 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shrink-0"></span>
              <span>Wisata Alam</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shrink-0"></span>
              <span>UMKM & Kuliner</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shrink-0"></span>
              <span>Fasilitas Publik</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shrink-0"></span>
              <span>Kesehatan</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-600 inline-block shrink-0"></span>
              <span>Perkebunan</span>
            </div>
          </div>

          {/* Batas Wilayah */}
          <div className="pt-2 border-t border-stone-100 space-y-1">
            <div className="flex items-center gap-2 text-stone-800 font-medium text-[11px]">
              <span className="w-4 h-0.5 border-b-2 border-dashed border-amber-500 inline-block shrink-0"></span>
              <span>Batas Desa Sambirejo</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-[10px]">
              <span className="w-3 h-3 bg-stone-200/80 border border-stone-300 rounded inline-block shrink-0"></span>
              <span>Luar Wilayah (Dimmed)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
