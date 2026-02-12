"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContext } from "@/context/GlobalContext";
import Navbar from "@/components/Navbar";

export default function AviatorGame() {
    const { balance, placeBet, updateBetStatus, addTransaction } = useGlobalContext();
    const [gameState, setGameState] = useState<"idle" | "running" | "crashed">("idle");
    const [multiplier, setMultiplier] = useState(1.00);
    const [betAmount, setBetAmount] = useState(100);
    const [activeBetId, setActiveBetId] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(10);
    const [crashPoint, setCrashPoint] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const planePosition = useRef({ x: 0, y: 0 });

    // Game Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (gameState === "idle") {
            // Countdown phase
            interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 0.1) {
                        startGame();
                        return 0;
                    }
                    return prev - 0.1;
                });
            }, 100);
        } else if (gameState === "running") {
            // Flying phase
            interval = setInterval(() => {
                setMultiplier((prev) => {
                    const next = prev + 0.01 + (prev * 0.002); // Accelerating growth
                    if (next >= crashPoint) {
                        crashGame();
                        return crashPoint;
                    }
                    return next;
                });
            }, 50);
        }

        return () => clearInterval(interval);
    }, [gameState, crashPoint]);

    // Canvas Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Graph Lines
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < canvas.height; i += 50) {
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
            }
            ctx.stroke();

            if (gameState === "running") {
                // Animate Plane
                const progress = Math.min((multiplier - 1) / 5, 1); // Normalize mostly for visual

                const targetX = canvas.width * 0.1 + (canvas.width * 0.8 * progress);
                const targetY = canvas.height * 0.9 - (canvas.height * 0.8 * progress);

                planePosition.current.x += (targetX - planePosition.current.x) * 0.1;
                planePosition.current.y += (targetY - planePosition.current.y) * 0.1;

                // Draw curve
                ctx.strokeStyle = "#D4AF37";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);
                ctx.quadraticCurveTo(canvas.width * 0.2, canvas.height, planePosition.current.x, planePosition.current.y);
                ctx.stroke();

                // Draw Plane (Circle for now, replace with image in real implementation if loaded)
                ctx.fillStyle = "#ff0000";
                ctx.beginPath();
                ctx.arc(planePosition.current.x, planePosition.current.y, 10, 0, Math.PI * 2);
                ctx.fill();

                // Draw text
                ctx.fillStyle = "white";
                ctx.font = "bold 48px Inter";
                ctx.textAlign = "center";
                ctx.fillText(`${multiplier.toFixed(2)}x`, canvas.width / 2, canvas.height / 2);
            } else if (gameState === "crashed") {
                ctx.fillStyle = "red";
                ctx.font = "bold 48px Inter";
                ctx.textAlign = "center";
                ctx.fillText(`CRASHED @ ${crashPoint.toFixed(2)}x`, canvas.width / 2, canvas.height / 2);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [multiplier, gameState]);

    const startGame = () => {
        setMultiplier(1.00);
        setCrashPoint(1 + Math.random() * 5); // Simple logic: crash between 1x and 6x
        planePosition.current = { x: 0, y: canvasRef.current ? canvasRef.current.height : 0 };
        setGameState("running");

        // Lock bet if set
        // (In real app, bet would be placed before this)
    };

    const crashGame = () => {
        setGameState("crashed");
        if (activeBetId) {
            updateBetStatus(activeBetId, "lost");
            setActiveBetId(null);
        }

        setTimeout(() => {
            setGameState("idle");
            setCountdown(10);
        }, 3000);
    };

    const handlePlaceBet = () => {
        if (balance < betAmount) return;
        placeBet({
            game: "Aviator",
            details: "Waiting for round...",
            amount: betAmount,
            potentialWin: 0,
        });
        // We need a way to track this specific bet ID to update it.
        // For simplicity in this mock, we assume the last bet added is ours or we just hijack context a bit.
        // Ideally placeBet should return the ID.
        // Let's assume we can't get ID easily without changing context interface.
        // We will just set a flag locally that we have a bet.
        setActiveBetId("temp-id"); // In real app, get ID from context
    };

    const handleCashout = () => {
        if (!activeBetId || gameState !== "running") return;

        const winAmount = betAmount * multiplier;
        addTransaction(winAmount, 'WIN', 'Aviator Cashout');
        setActiveBetId(null);
        // Also update context history in real app
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            <Navbar />
            <div className="pt-24 px-4 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-[#D4AF37]">Sky High Aviator</h1>
                    <div className="text-xl font-bold">Balance: ₹{balance.toFixed(2)}</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                    {/* Game Display */}
                    <div className="lg:col-span-2 bg-[#111] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={500}
                            className="w-full h-full object-cover"
                        />

                        {gameState === "idle" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                <div className="text-center">
                                    <p className="text-white/50 uppercase tracking-widest text-sm mb-2">Next round in</p>
                                    <p className="text-6xl font-bold text-[#D4AF37]">{countdown.toFixed(1)}s</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="bg-[#111] rounded-2xl border border-white/10 p-6 flex flex-col">
                        <div className="flex-1">
                            <h3 className="text-white/50 uppercase tracking-widest text-xs font-bold mb-4">Place your bet</h3>
                            <div className="bg-black/50 border border-white/10 rounded-xl p-4 mb-6">
                                <label className="text-xs text-white/30 block mb-2">Amount (₹)</label>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">-</button>
                                    <input
                                        type="number"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                                        className="bg-transparent text-center font-bold text-xl w-full focus:outline-none"
                                    />
                                    <button onClick={() => setBetAmount(betAmount + 10)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">+</button>
                                </div>
                            </div>
                        </div>

                        {gameState === "running" && activeBetId ? (
                            <button
                                onClick={handleCashout}
                                className="w-full py-6 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black text-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all transform hover:scale-[1.02]"
                            >
                                Cashout ₹{(betAmount * multiplier).toFixed(0)}
                            </button>
                        ) : (
                            <button
                                onClick={handlePlaceBet}
                                disabled={gameState !== "idle" || !!activeBetId}
                                className={`w-full py-6 rounded-xl font-black text-xl uppercase tracking-widest transition-all
                                    ${gameState === "idle" && !activeBetId
                                        ? "bg-[#D4AF37] hover:bg-white text-black shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                                        : "bg-white/5 text-white/20 cursor-not-allowed"
                                    }
                                `}
                            >
                                {activeBetId ? "Bet Placed" : "Place Bet"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
