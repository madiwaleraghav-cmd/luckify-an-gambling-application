import RouletteGame from "@/components/roulette/RouletteGame";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Roulette Pro | Luckify",
    description: "Play classic European Roulette. Place your bets and spin to win!",
};

export default function RoulettePage() {
    return <RouletteGame />;
}
