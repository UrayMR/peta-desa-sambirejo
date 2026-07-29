import L from "leaflet";
import { LocationItem } from "@/app/lib/gis-sources";

export const getCategoryColor = (category: LocationItem["category"]) => {
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

/**
 * Bikin ikon marker custom (divIcon). Kalau isActive true, marker diberi
 * cincin putih + efek pulse supaya jelas terlihat sedang difokuskan.
 */
export const createCustomIcon = (
  category: LocationItem["category"],
  isActive: boolean,
) => {
  const { bg } = getCategoryColor(category);

  const htmlContent = `
    <div class="relative group cursor-pointer flex flex-col items-center">
      ${
        isActive
          ? '<span class="absolute -top-1 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/40 animate-ping"></span>'
          : ""
      }
      <div class="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full ${bg} text-white flex items-center justify-center shadow-md border-2 ${
        isActive
          ? "border-white ring-4 ring-white/80 scale-125"
          : "border-white"
      } transform group-hover:scale-125 transition-all duration-300">
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
