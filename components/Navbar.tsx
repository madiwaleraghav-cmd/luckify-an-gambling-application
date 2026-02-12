"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import MyBets from "./MyBets";

import { useGlobalContext } from "@/context/GlobalContext";

export default function Navbar() {
    const { balance } = useGlobalContext();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showMyBets, setShowMyBets] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { name: "Home", href: "/" },
        { name: "Games", href: "/games" },
        { name: "Deposit", href: "/deposit" },
        { name: "Withdraw", href: "/withdraw" },
        { name: "Deposit History", href: "#" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
                    ? "bg-black/90 backdrop-blur-md border-white/10 py-3"
                    : "bg-transparent border-transparent py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Left: Logo & Branding */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        {/* Logo Icon */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C7321] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            <span className="text-black font-extrabold text-lg">L</span>
                        </div>
                        {/* Text Branding */}
                        <div className="flex flex-col">
                            <span className="text-white font-bold tracking-widest text-xl leading-none group-hover:text-[#D4AF37] transition-colors">
                                LUCKIFY
                            </span>
                            <span className="text-white/40 text-[0.6rem] uppercase tracking-[0.2em] leading-tight">
                                stake within limit
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 ml-12">
                        <Link href="/" className="text-white/70 hover:text-white text-sm font-medium tracking-widest uppercase transition-colors hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Home
                        </Link>
                        <Link href="/games" className="text-white/70 hover:text-white text-sm font-medium tracking-widest uppercase transition-colors hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Games
                        </Link>
                        <button onClick={() => setShowMyBets(true)} className="text-white/70 hover:text-white text-sm font-medium tracking-widest uppercase transition-colors hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            My Bets
                        </button>
                        <Link href="/deposit" className="text-white/70 hover:text-white text-sm font-medium tracking-widest uppercase transition-colors hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Deposit
                        </Link>
                        <Link href="/withdraw" className="text-white/70 hover:text-white text-sm font-medium tracking-widest uppercase transition-colors hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Withdraw
                        </Link>
                    </div>

                    {/* Right: Actions & Profile */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Balance Display */}
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-[0.65rem] text-[#D4AF37] tracking-widest uppercase mb-0.5">Balance</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-white font-medium text-lg">₹{balance.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Bonuses Button */}
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all group">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#D4AF37] group-hover:text-black transition-colors">
                                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold tracking-wider">BONUSES</span>
                        </button>

                        {/* Sign Up Button */}
                        <Link href="/signup">
                            <button className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full bg-[#D4AF37] text-black font-bold text-xs tracking-wider border border-[#D4AF37] hover:bg-transparent hover:text-[#D4AF37] transition-all shadow-[0_0_10px_rgba(212,175,55,0.4)] hover:shadow-none">
                                SIGN UP
                            </button>
                        </Link>

                        {/* Profile Icon */}
                        <Link href="/profile">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#222] to-[#000] border border-white/20 flex items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:shadow-[0_0_10px_rgba(212,175,55,0.2)] transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/70">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </Link>

                        {/* Menu Toggler */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 cursor-pointer z-50 group"
                        >
                            <motion.span
                                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className={`w-6 h-0.5 bg-white group-hover:bg-[#D4AF37] transition-colors`}
                            />
                            <motion.span
                                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className={`w-6 h-0.5 bg-white group-hover:bg-[#D4AF37] transition-colors`}
                            />
                            <motion.span
                                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className={`w-6 h-0.5 bg-white group-hover:bg-[#D4AF37] transition-colors`}
                            />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Side Menu Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-80 bg-[#0a0a0a] border-l border-white/10 z-50 p-8 pt-28 shadow-2xl"
                        >
                            <div className="flex flex-col gap-6">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="text-white/70 hover:text-[#D4AF37] text-lg font-medium tracking-wide flex items-center justify-between group transition-colors"
                                    >
                                        {item.name}
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}

                                <div className="h-px bg-white/10 my-4" />

                                <div className="mt-auto">
                                    <div className="flex justify-between items-center text-sm text-white/40 mb-2">
                                        <span>Current Balance</span>
                                    </div>
                                    <div className="text-2xl text-white font-bold mb-6">₹{balance.toFixed(2)}</div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showMyBets && <MyBets onClose={() => setShowMyBets(false)} />}
            </AnimatePresence>
        </>
    );
}
