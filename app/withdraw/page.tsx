"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WithdrawPage() {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");

    const methods = [
        { id: "upi", name: "UPI", icon: "📱" },
        { id: "netbanking", name: "Net Banking", icon: "🏦" },
        { id: "phonepe", name: "PhonePe", icon: "🟣" },
    ];

    return (
        <main className="min-h-screen bg-[#050505] text-white overflow-hidden">
            <Navbar />

            <section className="min-h-screen flex items-center justify-center relative px-4 pt-24 pb-12">
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4 border border-[#D4AF37]/30">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#D4AF37]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Withdraw Winnings</h1>
                        <p className="text-white/40 text-sm mt-1">Cash out your earnings directly to your bank.</p>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2 ml-1">
                            Withdrawal Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl font-light">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 pl-10 py-4 text-white text-xl font-bold placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                            />
                        </div>
                        <div className="flex justify-between mt-2 px-1">
                            <span className="text-xs text-white/40">Available Balance: <span className="text-white">$12,450.00</span></span>
                            <button className="text-xs text-[#D4AF37] hover:underline uppercase font-bold tracking-wider">Max</button>
                        </div>
                    </div>

                    {/* Method Selection */}
                    <div className="mb-8">
                        <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-3 ml-1">
                            Select Method
                        </label>
                        <div className="space-y-3">
                            {methods.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMethod(m.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${method === m.id
                                            ? "bg-[#D4AF37]/10 border-[#D4AF37]"
                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{m.icon}</span>
                                        <div className="text-left">
                                            <div className={`font-bold ${method === m.id ? "text-[#D4AF37]" : "text-white"}`}>{m.name}</div>
                                            <div className="text-xs text-white/30 hidden sm:block">Instant Transfer</div>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === m.id ? "border-[#D4AF37]" : "border-white/20"
                                        }`}>
                                        {method === m.id && <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {method && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-6 space-y-3"
                        >
                            <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-semibold ml-1">
                                {method === 'upi' || method === 'phonepe' ? 'UPI ID' : 'Account Number'}
                            </label>
                            <input
                                type="text"
                                placeholder={method === 'upi' || method === 'phonepe' ? "username@upi" : "000000000000"}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                            />
                        </motion.div>
                    )}

                    <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[#D4AF37] transition-colors uppercase tracking-wider text-sm">
                        Submit Request
                    </button>
                </motion.div>
            </section>
            <Footer />
        </main>
    );
}
