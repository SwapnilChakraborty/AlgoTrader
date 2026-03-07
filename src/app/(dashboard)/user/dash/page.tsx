import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { Activity, ArrowRight, CheckCircle, Clock, CreditCard, Crown, ExternalLink, History, Key, LogOut, Settings, ShieldAlert, ShieldCheck, Sparkles, TrendingUp, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    // Fetch user's subscriptions (active or pending payment)
    const subsSnapshot = await adminDb.collection("subscriptions")
        .where("userId", "==", session.user.id)
        .get();

    const subscriptions = await Promise.all(subsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        let indicator = { name: "Unknown Indicator", description: "", vendorId: "" };

        if (data.indicatorId) {
            const indDoc = await adminDb.collection("indicators").doc(data.indicatorId).get();
            if (indDoc.exists) {
                const indData = indDoc.data();
                if (indData) {
                    indicator = {
                        name: indData.name || indicator.name,
                        description: indData.description || indicator.description,
                        vendorId: indData.vendorId || indicator.vendorId
                    };
                }
            }
        }

        return {
            id: doc.id,
            indicator,
            indicatorId: data.indicatorId,
            status: data.status,
            accessStatus: data.accessStatus || "pending",
            currentPeriodEnd: data.currentPeriodEnd?.toDate() || new Date(),
        };
    }));

    return (
        <div className="space-y-10 pb-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">
                        Trader <span className="text-gold">Command Central</span>
                    </h1>
                    <p className="text-[10px] text-zinc-500 font-mono">Internal ID: {session.user.id}</p>
                    <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase">Operational status of your high-frequency strategies</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/settings">
                        <Button variant="outline" size="lg" className="border-zinc-800 hover:bg-zinc-900">
                            <Settings className="w-5 h-5 mr-2" />
                            Terminal Settings
                        </Button>
                    </Link>
                    <Link href="/indicators">
                        <Button size="lg" className="shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                            <Sparkles className="w-5 h-5 mr-2" />
                            Deploy New Edge
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Premium Status Banner */}
            <div className="glass rounded-[2.5rem] p-10 border border-gold/10 bg-gradient-to-br from-zinc-900/50 via-black to-gold/5 relative overflow-hidden shadow-2xl">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                <div className="flex flex-col md:flex-row gap-10 items-start md:items-center relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold to-gold-700 p-[2px] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        <div className="w-full h-full bg-black rounded-3xl flex items-center justify-center text-3xl font-black text-gold">
                            {session.user.name ? session.user.name.charAt(0).toUpperCase() : session.user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-3">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{session.user.name || 'Terminal User'}</h2>
                            <span className="px-4 py-1.5 rounded-full bg-gold/10 text-gold text-[10px] font-black tracking-[0.2em] uppercase border border-gold/20 shadow-[inset_0_0_10px_rgba(212,175,55,0.2)]">
                                Elite Alpha Member
                            </span>
                        </div>
                        <p className="text-zinc-500 mb-6 font-bold tracking-widest uppercase text-xs">{session.user.email}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-inner">
                                <div className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Auth Link</p>
                                    <p className="text-sm font-bold text-white uppercase italic">TradingView Verified</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 shadow-inner">
                                <div className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Edge</p>
                                    <p className="text-sm font-bold text-white uppercase italic">{subscriptions.length} High-Frequency Scripts</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto self-stretch md:self-center flex md:flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-900 pt-10 md:pt-0 md:pl-12">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-[0.3em]">Capital Exposure</p>
                            <p className="text-5xl font-black text-white italic tracking-tight pr-2">
                                <span className="text-gold">{subscriptions.length}</span> Assets
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Scripts Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic tracking-widest">
                        <Trophy className="w-6 h-6 text-gold drop-shadow-[0_0_10px_#D4AF37]" />
                        Active Script Matrix
                    </h2>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="p-16 border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8 border border-zinc-800 shadow-xl">
                                <Activity className="w-10 h-10 text-zinc-600" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase italic">No Active Vectors Found</h3>
                            <p className="text-zinc-500 mb-10 max-w-sm font-medium tracking-wide">
                                Your terminal is currently idle. Connect your first predictive engine from the marketplace to start generating alpha.
                            </p>
                            <Link href="/indicators">
                                <Button size="lg" className="h-14 px-10">Access Marketplace</Button>
                            </Link>
                        </Card>

                        {/* Recommendation Card */}
                        <div className="relative group overflow-hidden rounded-[2.5rem]">
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <Card className="h-full border-gold/30 bg-gold/5 p-10 relative z-10">
                                <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-gold text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gold/20">Alpha Pick</div>
                                <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center mb-8 shadow-2xl shadow-gold/20">
                                    <TrendingUp className="w-8 h-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Institutional Liquidity Vector</h3>
                                <p className="text-zinc-400 mb-8 font-medium leading-relaxed">
                                    Expose hidden market setups with high-probability liquidity cluster detection. Built for elite prop firm validation.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-3xl text-white italic tracking-tighter">
                                        <span className="text-gold">$49</span><span className="text-sm font-bold text-zinc-600 ml-1">USD/MO</span>
                                    </span>
                                    <Link href="/indicators">
                                        <Button variant="outline" className="group border-gold/30 hover:bg-gold/10">
                                            Execute <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {subscriptions.map((sub) => (
                            <Card key={sub.id} className="relative group overflow-hidden border-zinc-900 bg-zinc-950/40 hover:border-gold/30 hover:bg-zinc-900/30 transition-all duration-500 rounded-[2rem]">
                                <CardContent className="p-8">
                                    {/* Status Badge */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-xl group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                                            <Zap className="w-7 h-7 text-gold" />
                                        </div>
                                        {sub.status === "active" ? (
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Operational
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                Pending Payment
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter group-hover:text-gold transition-colors">{sub.indicator.name}</h3>
                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-2 mb-8 uppercase tracking-wide">
                                        {sub.indicator.description || "Quantum-enhanced predictive trading script."}
                                    </p>

                                    <div className="space-y-4 pt-6 border-t border-zinc-900">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-zinc-600 flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" /> Next Epoch
                                            </span>
                                            <span className="text-white italic">{sub.currentPeriodEnd.toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-zinc-600 flex items-center gap-2">
                                                <Key className="w-3.5 h-3.5" /> Access Matrix
                                            </span>
                                            {sub.accessStatus === "granted" ? (
                                                <span className="text-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]">Authorized</span>
                                            ) : sub.accessStatus === "failed" ? (
                                                <span className="text-red-500 flex items-center gap-2 group/error cursor-help">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                    Blocked
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-red-500 text-white text-[8px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center shadow-2xl pointer-events-none z-50">
                                                        Access grant failed. Ensure your TradingView username is correct in Settings.
                                                    </div>
                                                </span>
                                            ) : (
                                                <span className="text-amber-500 flex items-center gap-2 group/pending cursor-help">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                    Syncing
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-zinc-900 text-white text-[8px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-48 text-center shadow-2xl pointer-events-none z-50 border border-zinc-800">
                                                        Our node is currently authorizing your account on TradingView. Usually takes 5-10 minutes.
                                                    </div>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <Link href="/user/subscriptions" className="w-full">
                                            <Button variant="outline" className="w-full h-12 text-[10px] uppercase tracking-widest border-zinc-800 hover:bg-zinc-900 border-gold/30 text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                                Billing & Status
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
