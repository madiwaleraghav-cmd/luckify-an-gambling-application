"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContext } from "@/context/GlobalContext";
import Navbar from "@/components/Navbar";

type TileState = "hidden" | "safe" | "mined";

export default function MinesGame() {
    const { balance, placeBet, addTransaction } = useGlobalContext();
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover" | "cashed_out">("idle");
    const [mineCount, setMineCount] = useState(3);
    const [betAmount, setBetAmount] = useState(100);
    const [grid, setGrid] = useState<TileState[]>(Array(20).fill("hidden"));
    const [mines, setMines] = useState<number[]>([]); // Indices of mines
    const [revealedCount, setRevealedCount] = useState(0);

    const startGame = () => {
        if (balance < betAmount) return;
        placeBet({
            game: "Mines",
            details: `${mineCount} Mines`,
            amount: betAmount,
            potentialWin: 0,
        });

        // Generate mines
        const newMines = new Set<number>();
        while (newMines.size < mineCount) {
            newMines.add(Math.floor(Math.random() * 20));
        }

        setMines(Array.from(newMines));
        setGrid(Array(20).fill("hidden"));
        setRevealedCount(0);
        setGameState("playing");
    };

    const handleTileClick = (index: number) => {
        if (gameState !== "playing" || grid[index] !== "hidden") return;

        // Check if mine
        if (mines.includes(index)) {
            // Game Over
            const newGrid = [...grid];
            newGrid[index] = "mined";
            // Reveal all mines
            mines.forEach(m => newGrid[m] = "mined");
            setGrid(newGrid);
            setGameState("gameover");
        } else {
            // Safe
            const newGrid = [...grid];
            newGrid[index] = "safe";
            setGrid(newGrid);
            setRevealedCount(prev => prev + 1);
        }
    };

    const calculateMultiplier = () => {
        // Simple multiplier logic: (20 / (20 - mines)) ^ revealed
        // A bit simplified for game balance
        if (revealedCount === 0) return 1.0;

        let multiplier = 1.0;
        for (let i = 0; i < revealedCount; i++) {
            multiplier *= (20 - i) / (20 - mineCount - i);
        }
        return multiplier;
    };

    const currentMultiplier = calculateMultiplier();
    const currentWin = betAmount * currentMultiplier;

    const cashout = () => {
        addTransaction(currentWin, 'WIN', 'Mines Cashout');
        setGameState("cashed_out");
        // Reveal remaining (visual only)
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            <Navbar />
            <div className="pt-24 px-4 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-[#D4AF37]">Treasure Mines</h1>
                    <div className="text-xl font-bold">Balance: ₹{balance.toFixed(2)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Controls */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/10 h-fit">
                        <div className="mb-8">
                            <label className="text-xs text-white/30 block mb-2 font-bold uppercase tracking-widest">Bet Amount</label>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                                disabled={gameState === "playing"}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#D4AF37] outline-none transition-colors disabled:opacity-50"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="text-xs text-white/30 block mb-2 font-bold uppercase tracking-widest">Mines</label>
                            <div className="flex gap-2">
                                {[3, 5, 7, 10].map(count => (
                                    <button
                                        key={count}
                                        onClick={() => setMineCount(count)}
                                        disabled={gameState === "playing"}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${mineCount === count
                                            ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                                            : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                                            }`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {gameState === "playing" ? (
                            <button
                                onClick={cashout}
                                disabled={revealedCount === 0}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-lg transition-all ${revealedCount > 0
                                    ? "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                    : "bg-white/5 text-white/20"
                                    }`}
                            >
                                Cashout ₹{currentWin.toFixed(0)}
                            </button>
                        ) : (
                            <button
                                onClick={startGame}
                                className="w-full py-4 rounded-xl bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                            >
                                {gameState === "gameover" ? "Try Again" : gameState === "cashed_out" ? "Play Again" : "Start Game"}
                            </button>
                        )}

                        {gameState === "playing" && (
                            <div className="mt-8 text-center">
                                <p className="text-xs text-white/30 mb-1">Current Multiplier</p>
                                <p className="text-3xl font-bold text-[#D4AF37]">{currentMultiplier.toFixed(2)}x</p>
                            </div>
                        )}
                    </div>

                    {/* Grid */}
                    <div className="md:col-span-3 bg-[#111] p-8 rounded-2xl border border-white/10 flex items-center justify-center min-h-[600px]">
                        <div className="grid grid-cols-5 gap-4 w-full max-w-lg">
                            {grid.map((tile, i) => (
                                <motion.button
                                    key={i}
                                    onClick={() => handleTileClick(i)}
                                    disabled={gameState !== "playing" || tile !== "hidden"}
                                    whileHover={{ scale: gameState === "playing" && tile === "hidden" ? 1.05 : 1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        aspect-square rounded-xl border-b-4 relative overflow-hidden transition-all
                                        ${tile === "hidden" ? "bg-white/10 border-white/20 hover:bg-white/20" : ""}
                                        ${tile === "safe" ? "bg-[#D4AF37] border-[#b08d2b]" : ""}
                                        ${tile === "mined" ? "bg-red-500 border-red-700" : ""}
                                    `}
                                >
                                    <AnimatePresence>
                                        {tile === "safe" && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <div className="w-8 h-8 bg-black/20 rounded-full" />
                                            </motion.div>
                                        )}
                                        {tile === "mined" && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute inset-0 flex items-center justify-center text-4xl"
                                            >
                                                💣
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
