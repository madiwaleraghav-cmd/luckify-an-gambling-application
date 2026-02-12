"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContext } from "@/context/GlobalContext";

interface MyBetsProps {
    onClose: () => void;
}

export default function MyBets({ onClose }: MyBetsProps) {
    const { bets } = useGlobalContext();
    const [activeTab, setActiveTab] = useState<"recent" | "completed">("recent");

    const filteredBets = bets.filter(bet => {
        if (activeTab === "recent") return bet.status === "active";
        return bet.status !== "active";
    });

    return (
        <div className="fixed inset-0 z-[70] flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="w-full max-w-md bg-[#0a0a0a] border-l border-white/10 h-full relative z-10 shadow-2xl flex flex-col"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white tracking-wide">My Bets</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab("recent")}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === "recent" ? "text-[#D4AF37]" : "text-white/40 hover:text-white"
                            }`}
                    >
                        Recent
                        {activeTab === "recent" && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("completed")}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === "completed" ? "text-[#D4AF37]" : "text-white/40 hover:text-white"
                            }`}
                    >
                        Completed
                        {activeTab === "completed" && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                        )}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {filteredBets.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-white/20 text-sm">No {activeTab} bets found.</p>
                        </div>
                    ) : (
                        filteredBets.map((bet) => (
                            <div key={bet.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[#D4AF37] text-xs font-bold uppercase">{bet.game}</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${bet.status === "won" ? "bg-green-500/20 text-green-500" :
                                            bet.status === "lost" ? "bg-red-500/20 text-red-500" :
                                                "bg-yellow-500/20 text-yellow-500"
                                        }`}>
                                        {bet.status}
                                    </span>
                                </div>
                                <p className="text-white text-sm font-medium mb-3">{bet.details}</p>
                                <div className="flex justify-between items-center text-xs text-white/50 border-t border-white/5 pt-3">
                                    <div>
                                        Stake: <span className="text-white">₹{bet.amount}</span>
                                    </div>
                                    <div>
                                        Potential Win: <span className="text-white">₹{bet.potentialWin.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}
