"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative z-10">
            {/* Bottom Call to Action */}
            <div className="bg-gradient-to-b from-[#050505] to-neutral-950 py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <Link href="/games" className="group">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all group-hover:scale-105 duration-300">
                            <h3 className="text-2xl font-bold text-white group-hover:text-black mb-2 uppercase tracking-widest">Play Now</h3>
                            <p className="text-white/50 group-hover:text-black/70 text-sm">Dive into high-stakes action instantly.</p>
                        </div>
                    </Link>
                    <Link href="/signup" className="group">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white hover:border-white transition-all group-hover:scale-105 duration-300">
                            <h3 className="text-2xl font-bold text-white group-hover:text-black mb-2 uppercase tracking-widest">Sign Up</h3>
                            <p className="text-white/50 group-hover:text-black/70 text-sm">Join the elite club of winners today.</p>
                        </div>
                    </Link>
                    <Link href="#" className="group">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all group-hover:scale-105 duration-300">
                            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Login</h3>
                            <p className="text-white/50 text-sm">Access your premium account.</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="bg-neutral-950 py-16 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center">
                                    <span className="text-[#D4AF37] font-bold text-sm">L</span>
                                </div>
                                <span className="text-white font-bold tracking-widest text-xl">LUCKIFY</span>
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                                The premiere destination for high-stakes entertainment. <br />
                                Experience the thrill within your limits.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-white font-bold tracking-widest text-xs mb-6 uppercase text-[#D4AF37]">Platform</h4>
                            <ul className="space-y-4 text-sm text-white/50">
                                <li><Link href="#" className="hover:text-white transition-colors">Games</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">VIP Club</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Promotions</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Tournaments</Link></li>
                            </ul>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-white font-bold tracking-widest text-xs mb-6 uppercase text-[#D4AF37]">Support</h4>
                            <ul className="space-y-4 text-sm text-white/50">
                                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Fairness</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-white/30 text-xs">
                            &copy; {new Date().getFullYear()} Luckify Entertainment. All rights reserved.
                        </p>
                        <div className="flex items-center gap-8">
                            <Link href="#" className="text-white/30 text-xs hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-white/30 text-xs hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="#" className="text-white/30 text-xs hover:text-white transition-colors">Cookies Agreement</Link>
                        </div>
                    </div>
                    <div className="mt-8 text-center md:text-left">
                        <p className="text-white/20 text-[10px] leading-relaxed">
                            Gambling involves risk. Please gamble responsibly. 18+ only.
                            <br />
                            License No. GL-88392-HK. Operates under the International Gaming Authority.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
