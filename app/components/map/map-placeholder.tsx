export function MapPlaceholder({ state }: { state: "idle" | "loading" }) {
  return (
    <div className="w-full h-[420px] sm:h-[560px] flex flex-col items-center justify-center gap-3 bg-[#EDE9D9] text-[#6B6552]">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 21s-7-6.2-7-11.2A7 7 0 0119 9.8C19 14.8 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle
          cx="12"
          cy="9.5"
          r="2.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
      <p className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>
        {state === "loading"
          ? "Memuat peta interaktif"
          : "Gulir untuk memuat peta"}
      </p>
    </div>
  );
}
