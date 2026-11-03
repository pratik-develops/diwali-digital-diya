import { CardStudio } from "@/components/features/CardStudio";
import { DiyaGarden } from "@/components/features/DiyaGarden";
import { FireworksCelebration } from "@/components/features/FireworksCelebration";
import { FestivalGameTeaser } from "@/components/features/FestivalGameTeaser";
import { FloatingWishes } from "@/components/features/FloatingWishes";
import { GreetingGenerator } from "@/components/features/GreetingGenerator";
import { Hero } from "@/components/features/Hero";
import { JourneyTeaser } from "@/components/features/JourneyTeaser";
import { MysteryGift } from "@/components/features/MysteryGift";
import { QrGreeting } from "@/components/features/QrGreeting";
import { RangoliCreator } from "@/components/features/RangoliCreator";
import { SecretLetter } from "@/components/features/SecretLetter";

export default function Home() {
  return (
    <>
      <Hero />
      <FestivalGameTeaser />
      <GreetingGenerator />
      <DiyaGarden />
      <FireworksCelebration />
      <RangoliCreator />
      <FloatingWishes />
      <QrGreeting />
      <JourneyTeaser />
      <CardStudio />
      <MysteryGift />
      <SecretLetter />
    </>
  );
}
