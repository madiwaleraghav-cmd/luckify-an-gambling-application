"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MinesPromo() {
    return (
        <div className="relative w-full max-w-sm mx-auto group cursor-pointer">
            <Link href="/games/mines">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] aspect-[4/5] shadow-2xl"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596727147705-56a53741d26a?q=80&w=2070&auto=format&fit=crop')" }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                                <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase">Trending Now</span>
                            </div>

                            <h3 className="text-4xl font-black text-white mb-2 leading-none">
                                TREASURE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#8C7321]">MINES</span>
                            </h3>

                            <p className="text-white/60 text-sm mb-6 line-clamp-2">
                                Navigate the minefield and multiply your wealth. High risk, infinite rewards.
                            </p>

                            <button className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                                Play Now
                            </button>
                        </motion.div>
                    </div>

                    {/* Floating Elements decoration */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="text-xs font-bold text-white">RTP 99%</span>
                    </div>

                </motion.div>
            </Link>
        </div>
    );
}
