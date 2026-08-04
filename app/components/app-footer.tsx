export default function SiteFooter() {
  return (
    <footer className="relative border-t border-[#DAD3BD] bg-[#EDE9D9] overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row gap-2 sm:gap-0 items-start sm:items-center justify-between text-sm text-[#5B5646]">
        <p>
          &copy; {new Date().getFullYear()} Pemerintah Desa Sambirejo,
          Wonosalam.
        </p>
        <p
          className="text-[11px] tracking-[0.1em] uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Dibuat oleh KKN 35 UPN &ldquo;Veteran&ldquo; Jawa Timur
        </p>
      </div>
    </footer>
  );
}
