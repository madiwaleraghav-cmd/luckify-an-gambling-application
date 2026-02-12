"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RouletteWheel from "./RouletteWheel";
import BettingBoard from "./BettingBoard";
import ChipSelector from "./ChipSelector";
import BetHistory from "./BetHistory";
import { Bet, BetType, ChipValue, WHEEL_NUMBERS } from "./types";
import { calculateWinnings } from "./utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function RouletteGame() {
    const { balance, user, addTransaction, isLoading } = useGlobalContext();
    const [currentBets, setCurrentBets] = useState<Bet[]>([]);
    const [selectedChip, setSelectedChip] = useState<ChipValue>(10);
    const [history, setHistory] = useState<{ roundId: number, winningNumber: number, totalBet: number, totalWin: number }[]>([]);
    const [spinning, setSpinning] = useState(false);
    const [targetNumber, setTargetNumber] = useState<number | null>(null);
    const [lastWin, setLastWin] = useState<number | null>(null);

    // Sound effects refs could go here

    const handlePlaceBet = async (type: BetType, value: string | number) => {
        if (spinning) return;

        // Check balance (approximate check, real check on server)
        const currentTotalBet = currentBets.reduce((a, b) => a + b.amount, 0);
        if (balance < (currentTotalBet + selectedChip)) {
            alert("Insufficient funds!");
            return;
        }

        // Add bet to local state (we'll commit to server on spin or immediately? 
        // Real casinos deduct immediately. Let's do that for "Real" feel, but
        // for simplicity of "Clear Bets", maybe we deduct on Spin?
        // User asked "make sure credentials are stored...". 
        // Let's deduct on SPIN for easier "Clear Bets" implementation without multiple API calls.
        // OR better: Deduct now. If clear, refund.
        // Let's go with: Local state for placement, deduct ALL on Spin.

        const newBet: Bet = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            value,
            amount: selectedChip
        };

        setCurrentBets(prev => [...prev, newBet]);
    };

    const handleSpin = async () => {
        if (currentBets.length === 0) {
            alert("Place a bet first!");
            return;
        }
        if (spinning) return;

        const totalBetAmount = currentBets.reduce((sum, b) => sum + b.amount, 0);
        if (balance < totalBetAmount) {
            alert("Insufficient funds for total bet!");
            return;
        }

        // 1. Deduct Balance on Server
        const success = await addTransaction(totalBetAmount, 'BET', `Roulette Bet: ${currentBets.length} chips`);
        if (!success) {
            alert("Failed to place bet on server. Check connection.");
            return;
        }

        setSpinning(true);
        setLastWin(null);

        // Determine result immediately (client-side for demo)
        const randomIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
        const winningNum = WHEEL_NUMBERS[randomIndex];
        setTargetNumber(winningNum);
    };

    const onSpinComplete = async () => {
        setSpinning(false);

        if (targetNumber === null) return;

        // Calculate winnings
        const winnings = calculateWinnings(targetNumber, currentBets);

        // Update balance on Server if won
        if (winnings > 0) {
            await addTransaction(winnings, 'WIN', `Roulette Win: Number ${targetNumber}`);
            setLastWin(winnings);
        } else {
            setLastWin(0);
        }

        // Update history
        const totalBetAmount = currentBets.reduce((sum, b) => sum + b.amount, 0);
        setHistory(prev => [
            ...prev,
            {
                roundId: Date.now(),
                winningNumber: targetNumber,
                totalBet: totalBetAmount,
                totalWin: winnings
            }
        ].slice(-10)); // Keep last 10

        setCurrentBets([]);
    };

    const handleClearBets = () => {
        if (spinning) return;
        setCurrentBets([]);
    };

    if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-yellow-500/30">

            {/* Header / Stats */}
            <header className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        {/* Back Link */}
                        <span className="text-xl font-bold">←</span>
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                        LUCKIFY ROULETTE
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-neutral-400">BALANCE</span>
                        <span className="text-xl font-mono font-bold text-green-400">₹{balance?.toLocaleString()}</span>
                    </div>
                    {lastWin !== null && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="hidden md:flex flex-col items-end"
                        >
                            <span className="text-xs text-neutral-400">LAST WIN</span>
                            <span className={`text-xl font-mono font-bold ${lastWin > 0 ? 'text-yellow-400' : 'text-neutral-500'}`}>
                                {lastWin > 0 ? `+₹${lastWin.toLocaleString()}` : "₹0"}
                            </span>
                        </motion.div>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center">

                {/* Left Column: Wheel & Controls */}
                <div className="flex flex-col items-center gap-8 w-full max-w-md lg:w-1/3 order-1">
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-purple-600/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000" />
                        <RouletteWheel
                            spinning={spinning}
                            targetNumber={targetNumber}
                            onSpinComplete={onSpinComplete}
                        />
                    </div>

                    <div className="w-full bg-neutral-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-neutral-400">BET AMOUNT</span>
                            <span className="text-lg font-bold text-white">₹{currentBets.reduce((a, b) => a + b.amount, 0)}</span>
                        </div>

                        <button
                            onClick={handleSpin}
                            disabled={spinning || currentBets.length === 0}
                            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-bold text-xl rounded-xl shadow-lg hover:shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {spinning ? "SPINNING..." : "PLAY"}
                        </button>

                        <button
                            onClick={handleClearBets}
                            disabled={spinning || currentBets.length === 0}
                            className="w-full mt-3 py-2 text-sm text-neutral-400 hover:text-white underline decoration-neutral-700"
                        >
                            Clear All Bets
                        </button>
                    </div>

                    {/* Mobile History (visible on small screens) */}
                    <div className="lg:hidden w-full">
                        <BetHistory history={history} />
                    </div>
                </div>

                {/* Right Column: Betting Board */}
                <div className="flex flex-col gap-6 w-full lg:flex-1 order-2">
                    <div className="bg-neutral-900/80 p-6 rounded-2xl border-4 border-yellow-900/30 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                        <BettingBoard
                            currentBets={currentBets}
                            onPlaceBet={handlePlaceBet}
                            selectedChip={selectedChip}
                        />
                    </div>

                    <div className="flex flex-col items-center bg-black/40 p-4 rounded-xl border border-white/5">
                        <span className="text-sm text-neutral-400 uppercase tracking-widest mb-2">Select Chip Value</span>
                        <ChipSelector selectedChip={selectedChip} onSelectChip={setSelectedChip} />
                    </div>

                    {/* Desktop History */}
                    <div className="hidden lg:block">
                        <BetHistory history={history} />
                    </div>
                </div>

            </main>
        </div>
    );
}
