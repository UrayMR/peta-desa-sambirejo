"use client";

interface ResetViewButtonProps {
  onClick: () => void;
}

/** Tombol "Kembali ke Peta Desa", muncul saat sedang fokus ke satu lokasi */
export function ResetViewButton({ onClick }: ResetViewButtonProps) {
  return (
    <div className="absolute top-18 right-2.5 z-1000">
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-emerald-100 text-[11px] font-bold text-emerald-950 hover:bg-emerald-50 active:scale-95 transition-all"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 016 6v3"
          />
        </svg>
        Kembali ke Peta Desa
      </button>
    </div>
  );
}
