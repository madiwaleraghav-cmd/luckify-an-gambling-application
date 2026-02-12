"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGlobalContext } from "@/context/GlobalContext";

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
    headToHead?: string[]; // Array of strings describing past results
}

interface MatchDetailProps {
    match: Match;
    onClose: () => void;
}

export default function MatchDetail({ match, onClose }: MatchDetailProps) {
    const { placeBet, balance } = useGlobalContext();
    const [selectedOdd, setSelectedOdd] = useState<"home" | "draw" | "away" | null>(null);
    const [betAmount, setBetAmount] = useState<string>("");

    const handlePlaceBet = () => {
        if (!selectedOdd || !betAmount) return;
        const amount = parseFloat(betAmount);
        if (isNaN(amount) || amount <= 0) return;
        if (amount > balance) {
            alert("Insufficient balance!");
            return;
        }

        const oddsValue = match.odds[selectedOdd];
        const selectionName = selectedOdd === "home" ? match.teamA : selectedOdd === "away" ? match.teamB : "Draw";

        placeBet({
            game: "Match Betting",
            details: `${match.teamA} vs ${match.teamB} - ${selectionName} @ ${oddsValue}`,
            amount: amount,
            potentialWin: amount * oddsValue,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative z-10 shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start">
                    <div>
                        <h3 className="text-white font-bold text-lg">{match.league}</h3>
                        <p className="text-white/40 text-xs">{match.isLive ? "LIVE NOW" : match.time}</p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {/* Teams Score/VS */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex flex-col items-center gap-2 w-1/3">
                            <img src={match.teamALogo} alt={match.teamA} className="w-16 h-16 object-contain" />
                            <span className="text-sm font-bold text-center">{match.teamA}</span>
                        </div>
                        <div className="text-2xl font-bold text-[#D4AF37]">VS</div>
                        <div className="flex flex-col items-center gap-2 w-1/3">
                            <img src={match.teamBLogo} alt={match.teamB} className="w-16 h-16 object-contain" />
                            <span className="text-sm font-bold text-center">{match.teamB}</span>
                        </div>
                    </div>

                    {/* Head to Head */}
                    <div className="mb-6 bg-white/5 rounded-xl p-4">
                        <h4 className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">Head to Head</h4>
                        <div className="space-y-2">
                            {match.headToHead ? match.headToHead.map((rec, i) => (
                                <div key={i} className="text-xs text-white/70 flex justify-between border-b border-white/5 pb-1">
                                    <span>{rec}</span>
                                </div>
                            )) : (
                                <p className="text-xs text-white/40 italic">No recent records available.</p>
                            )}
                        </div>
                    </div>

                    {/* Odds Selection */}
                    <h4 className="text-white text-sm font-bold mb-3">Match Winner</h4>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {(["home", "draw", "away"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedOdd(type)}
                                className={`py-3 rounded-lg border flex flex-col items-center transition-all ${selectedOdd === type
                                        ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                    }`}
                            >
                                <span className={`text-xs ${selectedOdd === type ? "opacity-70" : "opacity-40"}`}>
                                    {type === "home" ? "1" : type === "draw" ? "X" : "2"}
                                </span>
                                <span className="font-bold text-lg">{match.odds[type].toFixed(2)}</span>
                            </button>
                        ))}
                    </div>

                    {/* Bet Amount */}
                    <div className="mb-6">
                        <label className="text-xs text-white/40 block mb-2">Bet Amount (INR)</label>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            placeholder="Enter amount..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                        <div className="flex justify-between mt-2 text-xs text-white/40">
                            <span>Balance: ₹{balance.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Place Bet Button */}
                    <button
                        onClick={handlePlaceBet}
                        disabled={!selectedOdd || !betAmount}
                        className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${!selectedOdd || !betAmount
                                ? "bg-white/10 text-white/30 cursor-not-allowed"
                                : "bg-[#D4AF37] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                            }`}
                    >
                        Place Bet
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
