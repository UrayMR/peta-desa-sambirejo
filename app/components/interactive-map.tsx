"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  GeoJSON,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { LocationItem, loadGisLocations } from "@/app/lib/gis-sources";
import {
  loadVillageBoundary,
  VillageBoundary,
} from "@/app/lib/village-boundary";

import {
  FALLBACK_SAMBIREJO_GEOJSON,
  FALLBACK_OUTSIDE_MASK_GEOJSON,
  FALLBACK_CENTER,
  VILLAGE_ZOOM,
  FOCUS_ZOOM,
  POPUP_VERTICAL_OFFSET,
  CATEGORIES,
} from "./map/map-config";
import { MapController, FlyTarget } from "./map/map-controller";
import { CategoryFilterBar } from "./map/category-filter-bar";
import { MapStatusBanner } from "./map/map-status-banner";
import { ResetViewButton } from "./map/reset-view-button";
import { MapLegend } from "./map/map-legend";
import { LocationMarker } from "./map/location-marker";
import { LocationNavArrows } from "./map/location-nav-arrows";

export default function InteractiveMap() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [boundary, setBoundary] = useState<VillageBoundary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);
  const nonceRef = useRef(0);

  const markerRefs = useRef<Record<number, LeafletMarker | null>>({});

  function registerMarkerRef(id: number, marker: LeafletMarker | null) {
    markerRefs.current[id] = marker;
  }

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
          setLoadError("Sebagian data lokasi gagal dimuat.");
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

  function focusLocation(loc: LocationItem) {
    nonceRef.current += 1;
    setActiveLocationId(loc.id);
    setFlyTarget({
      pos: loc.pos,
      zoom: FOCUS_ZOOM,
      nonce: nonceRef.current,
      offsetY: POPUP_VERTICAL_OFFSET,
    });
    markerRefs.current[loc.id]?.openPopup();
  }

  function navigateLocation(direction: 1 | -1) {
    if (activeLocationId === null || filteredLocations.length === 0) return;
    const currentIndex = filteredLocations.findIndex(
      (loc) => loc.id === activeLocationId,
    );
    if (currentIndex === -1) return;
    const nextIndex =
      (currentIndex + direction + filteredLocations.length) %
      filteredLocations.length;
    focusLocation(filteredLocations[nextIndex]);
  }

  function resetToVillage() {
    nonceRef.current += 1;
    setActiveLocationId(null);
    setFlyTarget({
      pos: mapCenter,
      zoom: VILLAGE_ZOOM,
      nonce: nonceRef.current,
      closePopup: true,
    });
  }

  return (
    <div className="relative w-full h-130 sm:h-162.5 rounded-2xl overflow-hidden shadow-xl border border-emerald-100 bg-stone-100">
      <CategoryFilterBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <MapStatusBanner loading={loading} error={loadError} />

      {activeLocationId !== null && (
        <ResetViewButton onClick={resetToVillage} />
      )}

      {activeLocationId !== null && filteredLocations.length > 1 && (
        <LocationNavArrows
          onPrev={() => navigateLocation(-1)}
          onNext={() => navigateLocation(1)}
        />
      )}

      <MapContainer
        center={mapCenter}
        zoom={VILLAGE_ZOOM}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0 font-sans"
      >
        <MapController
          villageCenter={mapCenter}
          hasUserFocused={activeLocationId !== null}
          flyTarget={flyTarget}
        />

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
        {filteredLocations.map((loc) => (
          <LocationMarker
            key={loc.id}
            location={loc}
            isActive={loc.id === activeLocationId}
            onClick={focusLocation}
            markerRef={registerMarkerRef}
          />
        ))}
      </MapContainer>

      <MapLegend
        isOpen={isLegendOpen}
        onOpen={() => setIsLegendOpen(true)}
        onClose={() => setIsLegendOpen(false)}
        visibleCount={filteredLocations.length}
      />
    </div>
  );
}
