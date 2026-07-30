"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const InteractiveMap = dynamic(
  () => import("@/app/components/interactive-map"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-emerald-50 animate-pulse rounded-2xl flex flex-col items-center justify-center text-emerald-600 border-2 border-dashed border-emerald-200">
        <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="font-medium text-lg">
          Menyiapkan Peta Digital Sambirejo...
        </span>
        <span className="text-sm text-emerald-500 mt-1">
          Menghubungkan ke satelit alam
        </span>
      </div>
    ),
  },
);

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (mapSectionRef.current) {
      observer.observe(mapSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 text-emerald-950 font-sans">
      {/* SECTION 1: HERO SECTION - Desain Segar Pedesaan */}
      <section className="relative bg-emerald-50/50 pb-16 pt-12 overflow-hidden">
        {/* Dekorasi Latar Belakang (Opsional: Ikon Daun Samar) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="leaf-pattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnWrite"
              >
                <path
                  d="M50 15 C40 5, 20 5, 10 15 C0 25, 0 45, 10 55 C20 65, 40 65, 50 55 L50 85 M50 55 C60 65, 80 65, 90 55 C100 45, 100 25, 90 15 C80 5, 60 5, 50 15"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
          {/* Header Teks - Di atas Gambar */}
          <div className="text-center mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-100 text-lime-900 text-sm font-semibold border border-lime-200 shadow-inner mb-4">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Desa Sambirejo &bull; Wonosalam &bull; Jombang
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-emerald-950 leading-tight">
              Peta Desa <span className="text-emerald-700">Sambirejo</span>
            </h1>
            <p className="mt-6 text-xl text-emerald-800/90 leading-relaxed font-medium">
              Jelajahi wilayah Desa Sambirejo, temukan potensi alam, wisata, dan
              fasilitas publik melalui peta interaktif yang informatif dan ramah
              pengguna.
            </p>
          </div>

          {/* Container Gambar Peta Fisik - Tampil Utuh */}
          <div className="relative w-full max-w-5xl mx-auto group">
            {/* Bingkai Dekoratif Alami */}
            <div className="absolute -inset-4 bg-lime-600/10 rounded-3xl blur-2xl group-hover:bg-lime-600/15 transition-all duration-500"></div>

            <div className="relative bg-white p-4 sm:p-6 rounded-2xl border border-emerald-100 transform transition-all duration-500 ease-out">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                <Image
                  src="/peta-desa-sambirejo.png" // Pastikan file ada di /public
                  alt="Tampilan Peta Fisik Wilayah Desa Sambirejo Wonosalam"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain" // KUNCI: Menampilkan gambar utuh
                />
              </div>
            </div>

            {/* Aksen Daun Dekoratif di pojok bingkai */}
            <svg
              className="absolute -top-6 -left-6 w-16 h-16 text-lime-400 rotate-[-15deg] opacity-80"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C15,6 12,6 10,8C8,10 8,13 10,15L10,21 M10,15C9,16 7,16 6,15C5,14 5,12 6,10C7,8 9,8 10,9 M14,10C15,9 17,9 18,10C19,11 19,13 18,14C17,15 15,15 14,14"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* SECTION 2: MAP INTERAKTIF (LOAD WHEN VISIBLE) */}
      <section ref={mapSectionRef} className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="w-12 h-1 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full mb-6"></div>
          <h2 className="text-4xl font-bold tracking-tight text-emerald-950">
            Eksplorasi Digital
          </h2>
          <p className="text-lg text-emerald-800 mt-4 max-w-2xl leading-relaxed">
            Gunakan peta interaktif di bawah untuk menemukan titik lokasi
            penting,{" "}
            <span className="font-semibold text-emerald-700">potensi UMKM</span>
            , destinasi{" "}
            <span className="font-semibold text-emerald-700">wisata alam</span>,
            dan fasilitas umum di Sambirejo.
          </p>
        </div>

        {/* Hanya dirender saat section ini masuk ke viewport */}
        <div className="relative group">
          {/* Efek Glow Hijau di belakang Peta */}
          <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

          <div className="relative bg-white p-3 rounded-3xl shadow-lg border border-emerald-100">
            {isVisible ? (
              <InteractiveMap />
            ) : (
              <div className="w-full h-[600px] bg-emerald-50 rounded-2xl flex flex-col items-center justify-center text-emerald-600 border border-emerald-100 shadow-inner">
                <svg
                  className="w-16 h-16 mb-5 text-emerald-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span className="font-medium text-lg">
                  Gulir ke bawah untuk memuat peta interaktif
                </span>
                <span className="text-sm text-emerald-500 mt-1">
                  Hemat data, muat saat dibutuhkan
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER TIPIS (Opsional) */}
      <footer className="bg-emerald-950 text-emerald-200 py-8 px-6 mt-12 text-center text-sm border-t border-emerald-900 flex justify-between items-center flex-row">
        <p>
          &copy; {new Date().getFullYear()} Pemerintah Desa Sambirejo,
          Wonosalam.
        </p>
        <p>Dibuat oleh KKN 35 UPN &ldquo;Veteran&ldquo; Jawa Timur</p>
      </footer>
    </main>
  );
}
