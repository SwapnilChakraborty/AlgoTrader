"use client";

import { useState } from "react";
import { Zap, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Star, Search, X, Trophy, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Indicator = {
    id: string;
    name: string;
    description: string;
    price: number;
    vendorName: string;
};

export function IndicatorsClient({ indicators }: { indicators: Indicator[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredIndicators = indicators.filter(indicator => {
        const query = searchQuery.toLowerCase();
        return (
            indicator.name.toLowerCase().includes(query) ||
            indicator.description.toLowerCase().includes(query) ||
            indicator.vendorName.toLowerCase().includes(query)
        );
    });

    return (
        <div className="w-full space-y-16">
            {/* Search Matrix */}
            <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/50 to-gold/20 rounded-3xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl focus-within:border-gold/50 transition-all duration-500">
                    <div className="pl-8 pr-4">
                        <Search className="h-6 w-6 text-zinc-500 group-focus-within:text-gold transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="w-full py-6 pr-16 bg-transparent outline-none text-white placeholder:text-zinc-600 font-bold uppercase tracking-widest text-sm italic"
                        placeholder="Scan repository for indicators, creators, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <AnimatePresence>
                        {searchQuery && (
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onClick={() => setSearchQuery("")}
                                className="absolute right-6 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
                {searchQuery && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mt-6 text-center text-[10px] font-black text-gold uppercase tracking-[0.3em]"
                    >
                        Vectors Found: <span className="text-white ml-2">[{filteredIndicators.length}]</span>
                    </motion.div>
                )}
            </div>

            {/* Results Grid */}
            {filteredIndicators.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[3rem] p-24 text-center border-dashed border-2 border-zinc-900 group"
                >
                    <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-zinc-800 group-hover:scale-110 group-hover:border-gold/30 transition-all duration-500">
                        <ShieldCheck className="w-12 h-12 text-zinc-700 group-hover:text-gold" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-6 uppercase italic tracking-widest">
                        {searchQuery ? "No Vectors Matched Search" : "Repository Encrypted"}
                    </h3>
                    <p className="text-zinc-500 max-w-md mx-auto font-medium leading-relaxed uppercase tracking-wide">
                        {searchQuery
                            ? "The requested algorithmic pattern does not exist in our secure repository. Try a broader search."
                            : "New institutional-grade scripts are currently in whitelisting phase. Check back shortly for public access."}
                    </p>
                    {searchQuery && (
                        <div className="mt-12">
                            <Button variant="outline" onClick={() => setSearchQuery("")} className="px-10 h-14">
                                Clear Scan Results
                            </Button>
                        </div>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredIndicators.map((indicator, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                key={indicator.id}
                            >
                                <Card className="h-full border-zinc-900 bg-zinc-950/40 hover:border-gold/30 hover:bg-zinc-900/40 transition-all duration-500 rounded-[2.5rem] flex flex-col group overflow-hidden">
                                    <div className="p-10 flex-grow relative">
                                        {/* Status Glow */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-start justify-between mb-10 relative z-10">
                                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                                                <TrendingUp className="w-8 h-8 text-gold" />
                                            </div>
                                            <div className="flex bg-gold/10 border border-gold/20 px-4 py-2 rounded-full items-center gap-2 shadow-inner">
                                                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                                                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Elite 5.0</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter group-hover:text-gold transition-colors duration-500">
                                            {indicator.name}
                                        </h3>

                                        <div className="flex items-center gap-3 mb-8">
                                            <Crown className="w-4 h-4 text-gold/60" />
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Architect: <span className="text-white ml-2">{indicator.vendorName}</span></span>
                                        </div>

                                        <p className="text-zinc-500 font-medium leading-relaxed line-clamp-3 mb-10 uppercase text-xs tracking-wide">
                                            {indicator.description}
                                        </p>

                                        <div className="space-y-4 pt-8 border-t border-zinc-900/50">
                                            <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                                <Zap className="w-4 h-4 text-gold/50" /> Instant Provisioning
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                                <ShieldCheck className="w-4 h-4 text-gold/50" /> Quant Verified
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-black/40 border-t border-zinc-900 flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Access Pass</span>
                                            <p className="text-3xl font-black text-white italic tracking-tighter">
                                                <span className="text-gold">${indicator.price}</span><span className="text-xs font-bold text-zinc-600 ml-1">USD/MO</span>
                                            </p>
                                        </div>
                                        <Link href={`/checkout/${indicator.id}`}>
                                            <Button className="h-14 px-8 shadow-xl shadow-gold/10 group">
                                                Subscribe
                                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

