"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MapPlaceholder } from "@/app/components/map/map-placeholder";

const InteractiveMap = dynamic(
  () => import("@/app/components/interactive-map"),
  { ssr: false, loading: () => <MapPlaceholder state="loading" /> },
);

export default function MapSection() {
  const [mapVisible, setMapVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 py-20">
      <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-col">
        <div className="max-w-xl">
          <p
            className="text-[11px] tracking-[0.16em] uppercase text-[#8B5E3C]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Peta Interaktif
          </p>
          <h2
            className="mt-3 text-3xl sm:text-4xl text-[#1F3226]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Jelajahi wilayah desa
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#3C3C30]">
            Gunakan peta di bawah untuk menemukan titik UMKM, destinasi wisata
            alam, dan fasilitas umum di tiap dusun.
          </p>
        </div>

        <div className="mt-8 border border-[#DAD3BD] bg-[#FAF8EE] p-3">
          {mapVisible ? <InteractiveMap /> : <MapPlaceholder state="idle" />}
        </div>
      </div>
    </section>
  );
}
