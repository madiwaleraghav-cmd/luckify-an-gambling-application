"use client";

import { motion } from "framer-motion";

export default function LimitsWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6 pointer-events-none mix-blend-difference"
        >
            <div className="flex flex-col">
                <span className="text-white/40 text-[0.6rem] uppercase tracking-[0.2em] mb-1">
                    Today Limit
                </span>
                <span className="text-white font-thin text-4xl tracking-tighter">
                    0
                </span>
            </div>

            <div className="w-8 h-[1px] bg-white/20" />

            <div className="flex flex-col gap-1">
                <span className="text-white/40 text-[0.6rem] uppercase tracking-[0.2em] mb-1">
                    Daily Limit
                </span>
                <span className="text-[#D4AF37] font-light text-sm tracking-widest">
                    500 INR
                </span>
                <span className="text-[#D4AF37] font-light text-sm tracking-widest">
                    $10 USD
                </span>
            </div>
        </motion.div>
    );
}
