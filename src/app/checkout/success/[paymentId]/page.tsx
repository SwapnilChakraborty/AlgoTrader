"use client";

import { CheckCircle2, ArrowRight, Download, Share2, ShieldCheck, Zap, History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function PaymentSuccessPage({
    params
}: {
    params: { paymentId: string }
}) {
    return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 sm:p-12">
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="glass bg-zinc-950/60 border border-zinc-900 rounded-[3rem] p-10 md:p-16 text-center space-y-12 relative overflow-hidden shadow-2xl"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative mx-auto w-24 h-24 bg-gold rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-bounce-slow">
                        <CheckCircle2 className="w-12 h-12 text-black" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
                            Payment <span className="text-gold">Received</span>
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Verification Protocol Initiated</p>
                    </div>

                    <div className="bg-black/60 rounded-[2rem] border border-zinc-900 overflow-hidden divide-y divide-zinc-900">
                        <div className="p-8 flex items-center justify-between text-left">
                            <div>
                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Receipt Identifier</p>
                                <p className="text-white font-mono text-sm tracking-tight italic">#{params.paymentId.substring(0, 12).toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-1">Settlement Status</p>
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-amber-500 font-black uppercase text-[10px] tracking-widest">Pending Verification</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                <span className="text-zinc-500">Asset Verification</span>
                                <span className="text-white">AlgoMarket Indicator</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                <span className="text-zinc-500">Processing Time</span>
                                <span className="text-gold italic">1-4 Working Hours</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <Link href="/user/subscriptions" className="flex-1">
                            <Button size="lg" className="w-full h-16 shadow-xl shadow-gold/20 group">
                                Go To Billing <History className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="flex-1 h-16 border-zinc-800 hover:bg-zinc-900 font-bold text-zinc-400">
                            Print Invoice <Download className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    <div className="pt-6 border-t border-zinc-900/50 flex items-center gap-4 justify-center">
                        <ShieldCheck className="w-4 h-4 text-zinc-700" />
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em]">Encrypted Transaction Ledger</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

const bounceSlow = {
    animation: "bounce 3s infinite"
};
