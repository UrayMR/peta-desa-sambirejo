import Image from "next/image";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const facilities = [
  { code: "01", name: "Ponkesdes", note: "Layanan kesehatan desa" },
  { code: "02", name: "Lapangan Voli", note: "Ruang olahraga warga" },
  { code: "03", name: "Lapangan Andum Alpukat", note: "Titik panen bersama" },
  { code: "04", name: "Masjid", note: "5 titik di seluruh desa" },
  { code: "05", name: "Gereja", note: "Rumah ibadah" },
  { code: "06", name: "Pura", note: "Rumah ibadah" },
  { code: "07", name: "Makam", note: "Area pemakaman desa" },
  { code: "08", name: "Sekolah Dasar", note: "Pendidikan anak desa" },
  { code: "09", name: "Kantor Desa", note: "Pusat pemerintahan" },
];

const sources = [
  "Rupabumi Indonesia (RBI)",
  "Batas Wilayah Kecamatan (RBI)",
  "Jaringan Jalan (RBI)",
];

export default function Home() {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen font-[family-name:var(--font-body)]`}
      style={{ backgroundColor: "#EFE6D2", color: "#2A2620" }}
    >
      {/* corner coordinate ticks — signature motif borrowed from the map's own margin */}
      <div className="pointer-events-none fixed inset-4 z-40 hidden sm:block">
        <div className="relative h-full w-full">
          <Tick corner="top-left" label="112°20'0&quot;E" />
          <Tick corner="top-right" label="7°40'0&quot;S" />
          <Tick corner="bottom-left" label="7°45'0&quot;S" />
          <Tick corner="bottom-right" label="112°25'0&quot;E" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14">
        {/* header */}
        <header
          className="flex items-start justify-between gap-6 border-b pb-6"
          style={{ borderColor: "#2A262033" }}
        >
          <div>
            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: "#5B7A4C", fontFamily: "var(--font-mono)" }}
            >
              Kecamatan Wonosalam · Kabupaten Jombang
            </p>
            <h1
              className="mt-2 text-3xl italic leading-none sm:text-4xl"
              style={{ fontFamily: "var(--font-display)", color: "#24382A" }}
            >
              Desa Sambirejo
            </h1>
          </div>
          <Compass />
        </header>

        {/* hero: the map itself, presented like a document plate */}
        <section className="mt-10">
          <div
            className="relative overflow-hidden rounded-sm border shadow-[0_18px_40px_-20px_rgba(36,56,42,0.45)]"
            style={{ borderColor: "#24382A" }}
          >
            <div className="relative aspect-[16/11] w-full">
              <Image
                src="/peta-desa-sambirejo.jpeg"
                alt="Peta Desa Sambirejo, Kecamatan Wonosalam, Kabupaten Jombang"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* stamped title block, bottom-left, like an inset legend */}
            <div
              className="absolute bottom-3 left-3 max-w-xs px-4 py-3"
              style={{
                backgroundColor: "#EFE6D2E6",
                border: "1px solid #24382A",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{ fontFamily: "var(--font-mono)", color: "#A85D30" }}
              >
                Peta Desa · Skala 1:15.000
              </p>
              <p
                className="mt-1 text-sm"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Proyeksi UTM · Datum WGS 1984 Zone 49S
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm italic" style={{ color: "#2A262099" }}>
            Disusun untuk keperluan administrasi wilayah, KKN 35 Tahun 2026.
          </p>
        </section>

        {/* facilities directory, styled after the map's own legend panel */}
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2
              className="text-xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: "#24382A",
              }}
            >
              Fasilitas Umum
            </h2>
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-mono)", color: "#5B7A4C" }}
            >
              {facilities.length} titik terpetakan
            </span>
          </div>

          <div
            className="mt-6 grid grid-cols-1 gap-x-8 gap-y-0 border-t sm:grid-cols-3"
            style={{ borderColor: "#2A262033" }}
          >
            {facilities.map((f) => (
              <div
                key={f.code}
                className="flex items-baseline gap-3 border-b py-3"
                style={{ borderColor: "#2A262022" }}
              >
                <span
                  className="text-xs tabular-nums"
                  style={{ fontFamily: "var(--font-mono)", color: "#A85D30" }}
                >
                  {f.code}
                </span>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#2A2620" }}
                  >
                    {f.name}
                  </p>
                  <p className="text-xs" style={{ color: "#2A262099" }}>
                    {f.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* data sources + indeks, side by side like the map's lower panel */}
        <section className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <h2
              className="text-xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: "#24382A",
              }}
            >
              Sumber Data
            </h2>
            <ol className="mt-4 space-y-2">
              {sources.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm">
                  <span
                    style={{ fontFamily: "var(--font-mono)", color: "#5B7A4C" }}
                  >
                    {i + 1}.
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div
            className="rounded-sm border p-5"
            style={{ borderColor: "#24382A33", backgroundColor: "#24382A0D" }}
          >
            <h2
              className="text-xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: "#24382A",
              }}
            >
              Disahkan Oleh
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs" style={{ color: "#2A262099" }}>
                  Kepala Desa
                </p>
                <p
                  className="mt-1"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  Desa Sambirejo
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "#2A262099" }}>
                  Ketua KKN 35 Tahun 2026
                </p>
                <p
                  className="mt-1"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  Desa Sambirejo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* footer */}
        <footer
          className="mt-16 flex items-center justify-between border-t pt-6 text-xs"
          style={{ borderColor: "#2A262033", color: "#2A262099" }}
        >
          <span style={{ fontFamily: "var(--font-mono)" }}>
            N ↑ · Sistem Grid Geografis
          </span>
          <span>© Desa Sambirejo, Kecamatan Wonosalam</span>
        </footer>
      </div>
    </div>
  );
}

function Tick({
  corner,
  label,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  label: string;
}) {
  const pos: Record<string, string> = {
    "top-left": "top-0 left-0 items-start",
    "top-right": "top-0 right-0 items-end text-right",
    "bottom-left": "bottom-0 left-0 items-start",
    "bottom-right": "bottom-0 right-0 items-end text-right",
  };
  return (
    <div className={`absolute flex flex-col ${pos[corner]}`}>
      <span
        className="text-[10px] tracking-wide"
        style={{ fontFamily: "var(--font-mono)", color: "#24382A66" }}
      >
        {label}
      </span>
    </div>
  );
}

function Compass() {
  return (
    <div className="flex flex-col items-center pt-1">
      <span
        className="text-lg"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "#A85D30",
        }}
      >
        N
      </span>
      <svg width="20" height="20" viewBox="0 0 20 20" className="mt-1">
        <path d="M10 1 L13 10 L10 19 L7 10 Z" fill="#24382A" />
      </svg>
    </div>
  );
}
