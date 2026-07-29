"use client";

import type { Marker as LeafletMarker } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { LocationItem } from "@/app/lib/gis-sources";
import { createCustomIcon, getCategoryColor } from "./marker-icon";

interface LocationMarkerProps {
  location: LocationItem;
  isActive: boolean;
  onClick: (location: LocationItem) => void;
  /** Dipanggil dengan instance Leaflet Marker saat mount/unmount, supaya
   * parent bisa membuka popup-nya secara terprogram (mis. dari tombol
   * navigasi sebelumnya/selanjutnya). */
  markerRef?: (id: number, marker: LeafletMarker | null) => void;
}

export function LocationMarker({
  location,
  isActive,
  onClick,
  markerRef,
}: LocationMarkerProps) {
  const badgeStyle = getCategoryColor(location.category).badge;

  return (
    <Marker
      ref={(instance) => markerRef?.(location.id, instance)}
      position={location.pos}
      icon={createCustomIcon(location.category, isActive)}
      eventHandlers={{
        click: () => onClick(location),
      }}
    >
      <Popup className="custom-leaflet-popup" maxWidth={260}>
        <div className="overflow-hidden rounded-lg font-sans -m-3 p-1">
          <div className="relative h-28 w-full overflow-hidden rounded-t-md bg-stone-200">
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm ${badgeStyle}`}
            >
              {location.category}
            </span>
          </div>

          <div className="p-2.5">
            <h4 className="font-bold text-xs sm:text-sm text-emerald-950 leading-tight mb-1">
              {location.name}
            </h4>
            <p className="text-[10px] text-stone-500 line-clamp-2 mb-2 leading-relaxed">
              {location.description}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${location.pos[0]},${location.pos[1]}`}
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
}
