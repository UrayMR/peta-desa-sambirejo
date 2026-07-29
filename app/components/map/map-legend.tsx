"use client";

interface MapLegendProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  visibleCount: number;
}

export function MapLegend({
  isOpen,
  onOpen,
  onClose,
  visibleCount,
}: MapLegendProps) {
  return (
    <div className="absolute bottom-3 left-2.5 z-1000 max-w-50 sm:max-w-55">
      {/* Tombol Ringkas Legenda khusus Mobile saat tertutup */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="sm:hidden bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-emerald-100 text-[11px] font-bold text-emerald-950 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          Legenda ({visibleCount})
        </button>
      )}

      {/* Box Legenda */}
      <div
        className={`bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-xl border border-emerald-100 text-xs transition-all duration-300 ${
          isOpen ? "block" : "hidden sm:block"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5 pb-1 gap-4 border-b border-stone-100">
          <h3 className="font-bold text-[11px] sm:text-xs text-emerald-950 flex items-center gap-1">
            Legenda Peta
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-[9px] sm:text-[10px] text-stone-400 font-medium mr-1">
              {visibleCount} Titik
            </span>
            <button
              onClick={onClose}
              className="sm:hidden text-stone-400 hover:text-stone-600 px-1 py-0.5 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Kategori */}
        <div className="space-y-1 sm:space-y-1.5 mb-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
            <span>Wisata</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span>UMKM & Kuliner</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
            <span>Fasilitas Publik</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>Kesehatan</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-700">
            <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
            <span>Tempat Ibadah</span>
          </div>
        </div>

        {/* Batas Wilayah */}
        <div className="pt-1.5 border-t border-stone-100 space-y-0.5">
          <div className="flex items-center gap-1.5 text-stone-800 font-medium text-[9px] sm:text-[11px]">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-amber-500 shrink-0"></span>
            <span>Batas Desa Sambirejo</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-400 text-[8px] sm:text-[10px]">
            <span className="w-2.5 h-2.5 bg-stone-200/80 border border-stone-300 rounded shrink-0"></span>
            <span>Luar Wilayah</span>
          </div>
        </div>
      </div>
    </div>
  );
}
