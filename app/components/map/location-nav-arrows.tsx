"use client";

interface LocationNavArrowsProps {
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Tombol panah kiri/kanan melayang di tepi peta, untuk pindah ke lokasi
 * sebelumnya/selanjutnya secara berurutan (mengikuti daftar lokasi yang
 * sedang ditampilkan / difilter). Muncul hanya saat ada lokasi yang
 * sedang difokuskan dan ada lebih dari satu lokasi untuk dinavigasi.
 */
export function LocationNavArrows({ onPrev, onNext }: LocationNavArrowsProps) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Lokasi sebelumnya"
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-1000 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-emerald-100 flex items-center justify-center hover:bg-emerald-50 active:scale-90 transition-all"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-900"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={onNext}
        aria-label="Lokasi selanjutnya"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-1000 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-emerald-100 flex items-center justify-center hover:bg-emerald-50 active:scale-90 transition-all"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-900"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
}
