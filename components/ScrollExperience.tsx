"use client";

import { useScroll, useTransform, useSpring, motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ScrollCanvas from "./ScrollCanvas";
import HotMatches from "./HotMatches";

export default function ScrollExperience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth scroll for momentum
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100, // Prompt spec
        damping: 30,    // Prompt spec
        mass: 1,
    });

    // Map 0-1 to 0-119 frames
    const currentFrame = useTransform(smoothProgress, [0, 1], [0, 119]);

    // Need to subscribe to change for passing to canvas
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const unsubscribe = currentFrame.on("change", (v) => {
            setFrame(v);
        });
        return () => unsubscribe();
    }, [currentFrame]);

    // Helper for text opacity transitions
    const useTextOpacity = (start: number, end: number) => {
        return useTransform(
            scrollYProgress,
            [start, start + 0.1, end - 0.1, end],
            [0, 1, 1, 0]
        );
    };

    const useTextY = (start: number, end: number) => {
        return useTransform(
            scrollYProgress,
            [start, start + 0.1, end - 0.1, end],
            [20, 0, 0, -20]
        );
    };

    // Hot Matches Animation Control
    const matchOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const matchY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
    const pointerEvents = useTransform(scrollYProgress, (v) => v > 0.1 ? "none" : "auto");

    return (
        <div className="relative bg-[#050505] min-h-screen">
            {/* Preloader */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] text-white"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <p className="text-sm tracking-[0.2em] text-white/60 uppercase">Initializing Suite</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll Container - 400vh */}
            <div ref={containerRef} className="relative h-[400vh]">

                {/* Sticky Canvas Layer */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">

                    {/* Canvas */}
                    <ScrollCanvas currentFrame={frame} onLoaded={() => setIsLoading(false)} />

                    {/* Gradient Vingette for Seamless Blend */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-80" />

                    {/* Scroll Indicator (0-10%) */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                        className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none"
                    >
                        <div className="text-white/40 text-xs tracking-[0.3em] uppercase animate-bounce">Scroll to Explore</div>
                    </motion.div>

                </div>

                <div className="fixed inset-0 pointer-events-none flex flex-col justify-center items-center w-full h-full z-10">

                    {/* Beat A: 0-20% - Centered Hero */}
                    <motion.div
                        className="absolute top-[15%] text-center max-w-4xl px-6"
                        style={{
                            opacity: useTextOpacity(0, 0.2),
                            y: useTextY(0, 0.2)
                        }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white/90 mb-2">LUCKIFY</h1>
                        <p className="text-lg md:text-xl text-white/60 tracking-[0.2em] font-light uppercase">stake within limit</p>
                    </motion.div>

                    {/* Hot Matches Overlay - Visible initially, fades on scroll */}
                    <motion.div
                        className="absolute bottom-[10%] w-full flex justify-center pointer-events-auto"
                        style={{
                            opacity: matchOpacity,
                            y: matchY,
                            pointerEvents: pointerEvents as any
                        }}
                    >
                        <HotMatches />
                    </motion.div>


                    {/* Final Beat: Buttons Only - Stays visible at end */}
                    <motion.div
                        className="absolute text-center"
                        style={{
                            opacity: useTransform(scrollYProgress, [0.75, 0.85], [0, 1]),
                            y: useTransform(scrollYProgress, [0.75, 0.85], [20, 0])
                        }}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-6 pointer-events-auto">
                            <button className="px-12 py-5 bg-transparent border-2 border-white/20 text-white text-2xl md:text-3xl font-black tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-sm uppercase backdrop-blur-sm">
                                PLAY
                            </button>
                            <button className="px-12 py-5 bg-transparent border-2 border-white/20 text-white text-2xl md:text-3xl font-black tracking-widest hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-sm uppercase backdrop-blur-sm">
                                SIGNUP
                            </button>
                            <button className="px-12 py-5 bg-transparent border-2 border-white/20 text-white text-2xl md:text-3xl font-black tracking-widest hover:bg-white/10 hover:border-white transition-all duration-300 rounded-sm uppercase backdrop-blur-sm">
                                LOGIN
                            </button>
                        </div>
                    </motion.div>

                </div>

            </div>
        </div>
    );
}
