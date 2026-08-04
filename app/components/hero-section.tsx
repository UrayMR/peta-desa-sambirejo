"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DUSUN = ["Sambirejo", "Komboh", "Jumok", "Sumber Arum"];
const FAKTA = [
  { label: "Ketinggian", value: "600–700", unit: "mdpl" },
  { label: "Luas wilayah", value: "±515", unit: "Ha" },
  { label: "Dusun", value: String(DUSUN.length), unit: "wilayah" },
];

const MAP_SRC = "/peta-desa-sambirejo.png";
const MAP_ALT = "Peta fisik wilayah administratif Desa Sambirejo, Wonosalam";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Tutup dengan Esc + kunci scroll body selama modal terbuka
  useEffect(() => {
    if (!fullscreen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen]);

  return (
    <section className="relative overflow-hidden bg-amber-50">
      <div className="relative max-w-6xl mx-auto px-6 py-16  grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 items-start">
        {/* Kolom teks */}
        <div
          className={`transition-opacity duration-700 motion-reduce:transition-none ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <p
            className="text-[11px] tracking-[0.16em] uppercase text-[#8B5E3C]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Peta &amp; Profil Wilayah
          </p>

          <h1
            className="mt-4 text-[2.75rem] sm:text-6xl leading-[1.05] text-[#1F3226]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Peta Desa
            <br />
            <em className="not-italic text-[#34503B]">Sambirejo</em>
          </h1>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#3C3C30] max-w-md">
            Terletak di kaki lereng Gunung Anjasmoro, Sambirejo dikenal lewat
            kopi robusta, cengkeh, dan durian dari empat dusunnya. Peta ini
            memuat batas wilayah, titik penting, dan potensi desa secara
            interaktif.
          </p>

          {/* Plakat data — bukan kartu ikon, murni tipografi & garis */}
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-5 border-t border-[#DAD3BD] pt-6">
            {FAKTA.map((f) => (
              <div key={f.label}>
                <dt
                  className="text-[10px] tracking-[0.14em] uppercase text-[#8B8464]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {f.label}
                </dt>
                <dd
                  className="mt-1 text-2xl text-[#1F3226]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  {f.value}{" "}
                  <span
                    className="text-sm align-middle text-[#6B6552]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {f.unit}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="max-w-6xl mx-auto py-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className="text-[10px] tracking-[0.14em] uppercase text-[#8B8464]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Dusun
            </span>
            {DUSUN.map((d, i) => (
              <span key={d} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="w-1 h-1 rounded-full bg-[#B9B192]" />
                )}
                <span
                  className="text-[13px] text-[#3C3C30]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {d}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Kolom gambar — bingkai sederhana, tanpa glow/blur */}
        <div
          className={`transition-opacity duration-700 delay-150 motion-reduce:transition-none ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="border border-[#DAD3BD] bg-[#FAF8EE] p-3">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] w-full overflow-hidden bg-[#EDE9D9] group">
              <Image
                src={MAP_SRC}
                alt={MAP_ALT}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-contain"
              />

              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="absolute top-3 right-3 inline-flex items-center gap-2 border border-[#DAD3BD] bg-white px-3 py-1.5 text-[#3C3C30] hover:bg-[#FAF8EE] hover:border-[#34503B] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34503B] focus-visible:outline-offset-2"
                aria-label="Lihat peta dalam layar penuh"
              >
                <ExpandIcon />
                <span
                  className="text-[11px] tracking-[0.1em] uppercase"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Layar penuh
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-[#1F1B12]/95 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Peta Desa Sambirejo — layar penuh"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex items-center gap-2 border border-[#DAD3BD]/40 text-[#F1EEE1] px-3 py-1.5 hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F1EEE1] focus-visible:outline-offset-2"
            aria-label="Tutup layar penuh"
          >
            <CloseIcon />
            <span
              className="text-[11px] tracking-[0.1em] uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Tutup
            </span>
          </button>

          <div
            className="relative w-full h-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={MAP_SRC}
              alt={MAP_ALT}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function ExpandIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 5l14 14M19 5L5 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
