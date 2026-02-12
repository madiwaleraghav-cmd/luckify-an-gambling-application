"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useGlobalContext } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";

export default function DepositPage() {
    const { addTransaction, user, isLoading } = useGlobalContext();
    const router = useRouter();
    const [currency, setCurrency] = useState("USD");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currencies = ["USD", "INR"];
    const methods = ["Credit Card", "Crypto", "UPI", "Net Banking"];

    // Bonus Calculation
    const depositAmount = parseFloat(amount) || 0;
    const bonusAmount = depositAmount * 0.20;
    const totalAmount = depositAmount + bonusAmount;

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    const handleDeposit = async () => {
        if (!amount || !method) {
            alert("Please enter amount and select a method.");
            return;
        }

        setIsSubmitting(true);
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const success = await addTransaction(depositAmount, 'DEPOSIT', `Deposit via ${method}`);

        setIsSubmitting(false);

        if (success) {
            alert(`Deposit Successful! +20% Bonus Applied. Total: ${totalAmount}`);
            router.push("/profile");
        } else {
            alert("Deposit Failed. Please try again.");
        }
    };

    if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-[#050505] text-white overflow-hidden">
            <Navbar />

            <section className="min-h-screen flex items-center justify-center relative px-4 pt-24 pb-12">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl"
                >
                    <h1 className="text-3xl font-bold text-center mb-1 text-white">Deposit Funds</h1>
                    <p className="text-center text-white/40 text-sm mb-8">Add funds to your account securely.</p>

                    {/* Currency Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-black/40 p-1 rounded-full border border-white/10 flex">
                            {currencies.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === c
                                        ? "bg-[#D4AF37] text-black shadow-lg"
                                        : "text-white/50 hover:text-white"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2 ml-1">
                            Amount ({currency === "USD" ? "$" : "₹"})
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl font-light">
                                {currency === "USD" ? "$" : "₹"}
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 pl-10 py-4 text-white text-xl font-bold placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                            />
                        </div>
                        {depositAmount > 0 && (
                            <div className="mt-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex justify-between items-center">
                                <span className="text-green-400 text-sm font-bold">20% Bonus Applied!</span>
                                <span className="text-white text-sm">
                                    + {currency === "USD" ? "$" : "₹"}{bonusAmount.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Payment Methods */}
                    <div className="mb-8">
                        <label className="block text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-3 ml-1">
                            Select Method
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {methods.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMethod(m)}
                                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${method === m
                                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                                        : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20"
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleDeposit}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#8C7321] text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? "Processing..." : "Proceed to Payment"}
                    </button>

                </motion.div>
            </section>
            <Footer />
        </main>
    );
}
