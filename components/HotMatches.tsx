"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MatchDetail from "./MatchDetail";

interface Match {
    id: number;
    league: string;
    teamA: string;
    teamALogo: string;
    teamB: string;
    teamBLogo: string;
    time: string;
    isLive: boolean;
    odds: {
        home: number;
        draw: number;
        away: number;
    };
    headToHead: string[];
}

export default function HotMatches() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch('/api/matches');
                const data = await res.json();
                setMatches(data.matches);
            } catch (error) {
                console.error("Failed to fetch matches:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatches();
        // Refresh every minute
        const interval = setInterval(fetchMatches, 60000);
        return () => clearInterval(interval);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === "right" ? scrollAmount : -scrollAmount,
                behavior: "smooth"
            });
        }
    };

    if (isLoading) return <div className="text-white text-center py-10">Loading Live Matches...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto px-6 z-40 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                    Hot Matches
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => scroll("left")} className="p-2 rounded-full border border-white/10 hover:bg-white/10 text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={() => scroll("right")} className="p-2 rounded-full border border-white/10 hover:bg-white/10 text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {matches.map((match) => (
                    <motion.div
                        key={match.id}
                        layoutId={`match-${match.id}`}
                        onClick={() => setSelectedMatch(match)}
                        className="min-w-[300px] snap-center relative rounded-xl p-4 border border-white/10 bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all cursor-pointer group flex flex-col justify-between hover:border-[#D4AF37]/50"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{match.league}</span>
                            {match.isLive ? (
                                <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold animate-pulse">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> LIVE
                                </span>
                            ) : (
                                <span className="text-[10px] text-white/50 font-mono">{match.time}</span>
                            )}
                        </div>

                        {/* Teams */}
                        <div className="flex justify-between items-center mb-6 px-2">
                            {/* Team A */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 p-2 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <img src={match.teamALogo} alt={match.teamA} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xs font-bold text-white max-w-[80px] text-center truncate">{match.teamA}</span>
                            </div>

                            <div className="flex flex-col items-center -mt-4">
                                <span className="text-sm font-black text-white/20 italic">VS</span>
                            </div>

                            {/* Team B */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 p-2 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <img src={match.teamBLogo} alt={match.teamB} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xs font-bold text-white max-w-[80px] text-center truncate">{match.teamB}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1 pt-3 border-t border-white/10">
                            <div className="py-1.5 bg-white/5 rounded flex flex-col items-center opacity-50">
                                <span className="text-[10px]">1</span>
                                <span className="text-sm font-bold">{match.odds.home.toFixed(2)}</span>
                            </div>
                            <div className="py-1.5 bg-white/5 rounded flex flex-col items-center opacity-50">
                                <span className="text-[10px]">X</span>
                                <span className="text-sm font-bold">{match.odds.draw.toFixed(2)}</span>
                            </div>
                            <div className="py-1.5 bg-white/5 rounded flex flex-col items-center opacity-50">
                                <span className="text-[10px]">2</span>
                                <span className="text-sm font-bold">{match.odds.away.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedMatch && (
                    <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

