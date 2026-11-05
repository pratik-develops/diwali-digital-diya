import Link from "next/link";
import { AvatarStudio } from "@/components/features/AvatarStudio";
import { DiwaliCamera } from "@/components/features/DiwaliCamera";
import { DiwaliGreetingStudio } from "@/components/features/DiwaliGreetingStudio";
import { DiyaGarden } from "@/components/features/DiyaGarden";
import { FireworksCelebration } from "@/components/features/FireworksCelebration";
import { FestivalGameTeaser } from "@/components/features/FestivalGameTeaser";
import { FloatingWishes } from "@/components/features/FloatingWishes";
import { Hero } from "@/components/features/Hero";
import { JourneyTeaser } from "@/components/features/JourneyTeaser";
import { MysteryGift } from "@/components/features/MysteryGift";
import { RangoliCreator } from "@/components/features/RangoliCreator";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-4xl px-4 pb-12 pt-2 text-center">
        <p className="mb-3 text-xs font-bold tracking-[0.32em] text-gold uppercase">
          A warm welcome
        </p>
        <h2 className="font-display text-3xl leading-tight text-amber-50 sm:text-5xl">
          Step into a brighter celebration.
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-amber-100/80 sm:text-xl">
          From stories and games to handcrafted greetings and glowing wishes, Diwali Digital Diya brings together every spark of joy in one luminous festival experience.
        </p>
      </section>

      <section id="stories" className="mx-auto max-w-6xl px-4 pb-8 pt-8">
        <SectionHeading
          kicker="Stories & Adventures"
          title="Stories & Adventures"
          lead="Discover the stories behind the light and embark on a festive adventure."
        />
      </section>
      <JourneyTeaser />
      <FestivalGameTeaser />

      <section id="explore" className="mx-auto max-w-6xl px-4 pb-8 pt-8">
        <SectionHeading
          kicker="Experience the Magic"
          title="Experience the Magic"
          lead="Light up the night and become part of the celebration."
        />
      </section>
      <DiyaGarden />
      <FireworksCelebration />
      <RangoliCreator />
      <FloatingWishes />

      <DiwaliGreetingStudio />
      <AvatarStudio />
      <DiwaliCamera />

      <MysteryGift />

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <div className="festive-card rounded-[2.2rem] px-6 py-10 sm:px-10 sm:py-12">
          <SectionHeading
            kicker="Keep the light alive"
            title="Keep Spreading the Light."
            lead="May every home keep a small brave light. May every heart find happiness, and may every shared wish make someone's Diwali brighter."
          />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="#create" className="btn-gold">
              Create Your Greeting
            </Link>
            <Link href="/#welcome" className="btn-ghost">
              Celebrate Again
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
