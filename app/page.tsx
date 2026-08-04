import AppHeader from "@/app/components/app-header";
import HeroSection from "@/app/components/hero-section";
import MapSection from "@/app/components/map-section";
import AppFooter from "@/app/components/app-footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F1EEE1]">
      <AppHeader />
      <HeroSection />
      <MapSection />
      <AppFooter />
    </main>
  );
}
