import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Work_Sans } from "next/font/google";
import "./globals.css";

export const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const bodyFont = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Peta Desa Sambirejo, Wonosalam",
  description: "Peta Desa Sambirejo, Wonosalam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-[#F1EEE1] text-[#262B1F]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
