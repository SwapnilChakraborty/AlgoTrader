import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { Zap, Plus, Settings, Users, Activity, TrendingUp, DollarSign, ArrowUpRight, Globe, Lock, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function VendorIndicatorsPage() {
    const session = await getServerSession(authOptions);

    const indicatorsSnapshot = await adminDb.collection("indicators").get();

    let totalRevenue = 0;
    let totalActiveSubs = 0;

    const indicators = await Promise.all(indicatorsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const subsSnapshot = await adminDb.collection("subscriptions")
            .where("indicatorId", "==", doc.id)
            .where("status", "==", "active")
            .get();

        const activeCount = subsSnapshot.size;
        totalActiveSubs += activeCount;
        totalRevenue += (activeCount * (data.price || 0));

        return {
            id: doc.id,
            name: data.name,
            description: data.description,
            price: data.price,
            status: data.isLive ? "Live" : "Draft",
            _count: {
                subscriptions: activeCount
            }
        };
    }));

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">
                        Creator <span className="text-gold">Hub</span>
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase">Managing the global distribution of quantitative edge</p>
                </div>
                <Link href="/vendor/indicators/new">
                    <Button size="lg" className="shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        <Plus className="w-5 h-5 mr-2" />
                        Publish Script
                    </Button>
                </Link>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-zinc-900 bg-zinc-950/40 relative overflow-hidden group hover:border-gold/30 transition-all duration-500 rounded-[2.5rem]">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                        <DollarSign className="w-32 h-32 text-gold" />
                    </div>
                    <CardContent className="p-8 relative z-10">
                        <div className="flex items-center gap-3 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                            <div className="p-2 rounded-xl bg-gold/10 text-gold border border-gold/20">
                                <DollarSign className="w-4 h-4" />
                            </div>
                            Monthly Revenue (MRR)
                        </div>
                        <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4">${totalRevenue.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <span className="flex items-center text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
                            </span>
                            <span className="text-zinc-600 ml-1">Delta vs Previous</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-900 bg-zinc-950/40 relative overflow-hidden group hover:border-gold/30 transition-all duration-500 rounded-[2.5rem]">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                        <Users className="w-32 h-32 text-gold" />
                    </div>
                    <CardContent className="p-8 relative z-10">
                        <div className="flex items-center gap-3 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                            <div className="p-2 rounded-xl bg-gold/10 text-gold border border-gold/20">
                                <Users className="w-4 h-4" />
                            </div>
                            Active Deployment List
                        </div>
                        <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4">{totalActiveSubs.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <span className="flex items-center text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> +8.1%
                            </span>
                            <span className="text-zinc-600 ml-1">Scaling Factor</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-900 bg-zinc-950/40 relative overflow-hidden group hover:border-gold/30 transition-all duration-500 rounded-[2.5rem]">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                        <Activity className="w-32 h-32 text-gold" />
                    </div>
                    <CardContent className="p-8 relative z-10">
                        <div className="flex items-center gap-3 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                            <div className="p-2 rounded-xl bg-gold/10 text-gold border border-gold/20">
                                <Zap className="w-4 h-4" />
                            </div>
                            Distribution Status
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter mb-4 uppercase">Operational</h2>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <span className="flex items-center text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                                <Activity className="w-3 h-3 mr-1" /> 100.0%
                            </span>
                            <span className="text-zinc-600 ml-1">Uptime SLA</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List Header */}
            <div className="pt-6 flex items-center justify-between border-b border-zinc-900 pb-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic tracking-widest">
                    <Trophy className="w-6 h-6 text-gold drop-shadow-[0_0_10px_#D4AF37]" />
                    Strategy Matrix
                </h2>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                    <span className="px-5 py-2 rounded-full bg-gold/10 text-gold border border-gold-500/30 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all">All [{indicators.length}]</span>
                    <span className="px-5 py-2 rounded-full text-zinc-600 hover:text-white hover:bg-zinc-900 border border-transparent cursor-pointer transition-all">Drafts [0]</span>
                </div>
            </div>

            {/* Indicators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {indicators.length === 0 ? (
                    <div className="col-span-full text-center py-24 px-10 glass rounded-[3rem] border border-dashed border-zinc-800 bg-transparent group">
                        <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-zinc-800 shadow-2xl group-hover:scale-110 group-hover:border-gold/30 transition-all duration-500">
                            <Zap className="w-12 h-12 text-zinc-700 group-hover:text-gold" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-6 uppercase italic tracking-widest">Empire Construction</h3>
                        <p className="text-zinc-500 max-w-md mx-auto font-medium leading-relaxed uppercase tracking-wide mb-12">
                            Publish your first institutional vector. We provide the infrastructure for subscription scaling and secure invite-only distribution.
                        </p>
                        <Link href="/vendor/indicators/new">
                            <Button size="lg" className="h-16 px-12 shadow-xl shadow-gold/20">
                                <Plus className="w-5 h-5 mr-3" /> Initialize First Script
                            </Button>
                        </Link>
                    </div>
                ) : indicators.map(indicator => (
                    <Card key={indicator.id} className="relative group overflow-hidden border-zinc-900 bg-zinc-950/40 hover:border-gold/30 hover:bg-zinc-900/30 transition-all duration-500 rounded-[2.5rem] flex flex-col group overflow-hidden">
                        <CardContent className="p-10 flex-grow relative">
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                                    <Activity className="w-8 h-8 text-gold" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Live
                                    </span>
                                    <Link href={`/vendor/indicators/${indicator.id}/edit`}>
                                        <button className="p-2.5 text-zinc-600 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter group-hover:text-gold transition-colors duration-500">{indicator.name}</h3>
                            <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider mb-10 line-clamp-2">
                                {indicator.description || "Experimental quant vector awaiting metadata expansion."}
                            </p>

                            {/* UI Visualization Layer */}
                            <div className="w-full h-12 flex items-end gap-1.5 mb-10 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
                                {[40, 70, 45, 90, 65, 85, 100, 55, 75, 60].map((h, i) => (
                                    <div key={i} className="flex-1 bg-gold rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.2)]" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                        </CardContent>

                        <div className="p-8 bg-black/40 border-t border-zinc-900 grid grid-cols-2 gap-8">
                            <div className="border-r border-zinc-900/50 pr-4">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5" /> Fleet
                                </p>
                                <p className="text-2xl font-black text-white italic tracking-tighter">{indicator._count.subscriptions}</p>
                            </div>
                            <div className="pl-4">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <DollarSign className="w-3.5 h-3.5" /> License
                                </p>
                                <p className="text-2xl font-black text-white italic tracking-tighter">
                                    <span className="text-gold">${indicator.price}</span><span className="text-xs font-bold text-zinc-600 ml-1">MO</span>
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

