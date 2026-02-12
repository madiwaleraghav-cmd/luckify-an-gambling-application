"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const games = [
    {
        id: 1,
        title: "Neon Roulette",
        category: "Table Game",
        image: "/roulette.png",
        href: "/games/roulette"
    },
    {
        id: 2,
        title: "Sky High Aviator",
        category: "Crash Game",
        image: "/aviator.png",
        href: "/games/aviator"
    },
    {
        id: 3,
        title: "Treasure Mines",
        category: "Chance",
        image: "https://images.unsplash.com/photo-1596727147705-56a53741d26a?q=80&w=2070&auto=format&fit=crop",
        href: "/games/mines"
    },
    {
        id: 4,
        title: "High Stakes Poker",
        category: "Card Game",
        image: "https://images.unsplash.com/photo-1541270941907-3d7143e8cbab?q=80&w=2074&auto=format&fit=crop",
        href: "#"
    },
    {
        id: 5,
        title: "Royal Blackjack",
        category: "Card Game",
        image: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=2073&auto=format&fit=crop",
        href: "#"
    },
];

export default function GamesPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            {/* Header Section */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
                    >
                        PREMIUM <span className="text-[#D4AF37]">GAMES</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 text-lg max-w-2xl mx-auto"
                    >
                        Experience the thrill of high-stakes gaming with our curated selection of world-class tables and slots.
                    </motion.p>
                </div>
            </section>

            {/* Games Grid */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {games.map((game, index) => (
                        <Link key={game.id} href={game.href}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-[#D4AF37]/50 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                            >
                                {/* Image Background */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${game.image})` }}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-2 block">
                                        {game.category}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                                        {game.title}
                                    </h3>
                                    <div className="h-0 group-hover:h-12 transition-all duration-300 overflow-hidden">
                                        <button className="mt-4 px-6 py-2 bg-[#D4AF37] text-black text-sm font-bold rounded-full uppercase tracking-wide hover:bg-white transition-colors">
                                            Play Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
