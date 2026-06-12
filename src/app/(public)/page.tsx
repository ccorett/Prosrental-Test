import { CompanyOverviewSection } from "@/components/home/CompanyOverviewSection";
import { CorePrinciplesSection } from "@/components/home/CorePrinciplesSection";
import { FeaturedEquipmentSection } from "@/components/home/FeaturedEquipmentSection";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { ServiceHighlightsSection } from "@/components/home/ServiceHighlightsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CompanyOverviewSection />
      <FeaturedEquipmentSection />
      <MissionSection />
      <ServiceHighlightsSection />
      <CorePrinciplesSection />
      <CtaBanner />
    </>
  );
}
