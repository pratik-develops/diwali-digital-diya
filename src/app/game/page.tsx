import type { Metadata } from "next";
import { DemonSlayerGame } from "@/components/features/DemonSlayerGame";

export const metadata: Metadata = {
  title: "Demon Slayer: Festival of Light | Diwali Digital Diya",
  description:
    "Play a festive Diwali arcade game. Protect the palace, defeat shadow sprites, and challenge a friend to beat your score.",
};

export default function GamePage() {
  return <DemonSlayerGame />;
}
