"use client";

interface CategoryFilterBarProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryFilterBar({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterBarProps) {
  return (
    <div className="absolute top-2.5 left-2.5 right-16 w-[calc(100%-10rem)] sm:right-auto sm:w-max z-1000">
      <div className="flex gap-1 bg-white/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-md border border-emerald-100/80 overflow-x-auto [ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap flex items-center shrink-0 ${
                isActive
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-emerald-950 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
