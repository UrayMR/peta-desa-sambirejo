import Image from "next/image";

const LOGOS = [
  { src: "/logo-jombang.png", alt: "Logo Kabupaten Jombang" },
  { src: "/logo-upn.png", alt: 'Logo UPN "Veteran" Jawa Timur' },
  { src: "/logo-kkn.png", alt: 'Logo KKN 35 UPN "Veteran" Jawa Timur' },
];

export default function AppHeader() {
  return (
    <header className="border-b border-[#DAD3BD]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-[#DAD3BD]">
            {LOGOS.map((logo) => (
              <div key={logo.src} className="relative h-9 w-9 shrink-0">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="(max-width: 640px) 2.25rem, 2.25rem"
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          <div>
            <p
              className="text-lg leading-none text-[#1F3226]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Desa Sambirejo
            </p>
            <p
              className="mt-1 text-[11px] tracking-[0.14em] uppercase text-[#6B6552]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Pemerintah Desa
            </p>
          </div>
        </div>

        <p
          className="hidden sm:block text-[11px] tracking-[0.14em] uppercase text-[#6B6552] shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Kec. Wonosalam &middot; Kab. Jombang
        </p>
      </div>
    </header>
  );
}
