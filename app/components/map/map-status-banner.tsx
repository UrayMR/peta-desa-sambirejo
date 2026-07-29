"use client";

interface MapStatusBannerProps {
  loading: boolean;
  error: string | null;
}

/** Indikator "Memuat data lokasi..." / pesan error di bawah filter bar */
export function MapStatusBanner({ loading, error }: MapStatusBannerProps) {
  if (!loading && !error) return null;

  return (
    <div className="absolute top-14 left-2.5 z-1000">
      <div
        className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-md ${
          error
            ? "bg-rose-100/95 text-rose-700 border border-rose-200"
            : "bg-white/90 text-emerald-800 border border-emerald-100"
        }`}
      >
        {error ?? "Memuat data lokasi..."}
      </div>
    </div>
  );
}
