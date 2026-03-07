import { adminDb } from "@/lib/firebase/admin";
import { Zap, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Star, Sparkles, Trophy, Globe } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { IndicatorsClient } from "./IndicatorsClient";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function IndicatorsMarketplacePage() {
    // Fetch all live indicators
    const indicatorsSnapshot = await adminDb
        .collection("indicators")
        .where("isLive", "==", true)
        .get();

    const indicators = indicatorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as any[];

    // Optimize: Batch fetch all unique vendors to avoid N+1 queries
    const vendorIds = Array.from(new Set(indicators.map(i => i.vendorId).filter(Boolean)));
    const vendorMap: Record<string, string> = {};

    if (vendorIds.length > 0) {
        const vendorSnapshots = await Promise.all(
            vendorIds.map(id => adminDb.collection("users").doc(id).get())
        );
        vendorSnapshots.forEach(snap => {
            if (snap.exists) {
                vendorMap[snap.id] = snap.data()?.name || "Verified Creator";
            }
        });
    }

    const formattedIndicators = indicators.map(i => ({
        id: i.id,
        name: i.name || "Strategy",
        description: i.description || "No description provided.",
        price: i.price || 0,
        vendorName: vendorMap[i.vendorId] || "Verified Creator",
    }));

    return (
        <div className="flex bg-black min-h-screen flex-col selection:bg-gold/30 selection:text-white">
            <Navbar />

            <main className="flex-1 p-8 md:p-16 max-w-7xl mx-auto w-full relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="mb-20 text-center relative z-10">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gold/5 border border-gold/20 text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-10 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                        <Trophy className="w-3.5 h-3.5 animate-bounce" />
                        <span>Elite Mathematical Marketplace</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase italic mb-8 leading-tight">
                        The <span className="text-gold">Alpha</span> Repository
                    </h1>

                    <p className="text-xl text-zinc-500 max-w-3xl mx-auto font-medium leading-relaxed tracking-wide uppercase italic">
                        Access high-probability institutional vectors.
                        <span className="text-white font-bold ml-2">Verified performance. Zero latency delivery.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 opacity-40 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
                    <div className="flex items-center gap-4 p-6 rounded-3xl bg-zinc-900/20 border border-zinc-800/50">
                        <Zap className="w-6 h-6 text-gold" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Instant Provisioning</span>
                    </div>
                    <div className="flex items-center gap-4 p-6 rounded-3xl bg-zinc-900/20 border border-zinc-800/50">
                        <ShieldCheck className="w-6 h-6 text-gold" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Source Shielded</span>
                    </div>
                    <div className="flex items-center gap-4 p-6 rounded-3xl bg-zinc-900/20 border border-zinc-800/50">
                        <Globe className="w-6 h-6 text-gold" />
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Global Accessibility</span>
                    </div>
                </div>

                <IndicatorsClient indicators={formattedIndicators} />
            </main>
        </div>
    );
}

