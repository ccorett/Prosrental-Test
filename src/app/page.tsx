import { CorePrinciplesSection } from "@/components/home/CorePrinciplesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionSection } from "@/components/home/MissionSection";
import { StrategicFleetSection } from "@/components/home/StrategicFleetSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <StrategicFleetSection />
      <CorePrinciplesSection />
    </>
  );
}
