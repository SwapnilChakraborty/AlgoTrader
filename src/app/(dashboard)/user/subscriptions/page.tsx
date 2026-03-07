import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { Activity, Clock, Zap, ExternalLink, CreditCard, ArrowRight, Trophy, ShieldCheck, Key, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function UserSubscriptionsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch user's subscriptions
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
            indicatorId: data.indicatorId,
            indicator,
            status: data.status,
            accessStatus: data.accessStatus || "pending",
            currentPeriodEnd: data.currentPeriodEnd?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
        };
    }));

    // Sort in memory to avoid missing index error
    subscriptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">
                    Billing & <span className="text-gold">Deployment</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase">Financial records and strategy activation matrix</p>
            </div>

            {subscriptions.length === 0 ? (
                <div className="glass rounded-[3rem] p-24 text-center border-dashed border-2 border-zinc-900 group">
                    <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-zinc-800 group-hover:scale-110 group-hover:border-gold/30 transition-all duration-500 shadow-2xl">
                        <CreditCard className="w-12 h-12 text-zinc-600 group-hover:text-gold" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-6 uppercase italic tracking-widest">No Active Records</h3>
                    <p className="text-zinc-500 max-w-md mx-auto font-medium leading-relaxed uppercase tracking-wide mb-12">
                        You haven't initiated any deployments yet. Visit the marketplace to deploy high-probability mathematical engines.
                    </p>
                    <Link href="/indicators">
                        <Button size="lg" className="h-16 px-12 text-sm uppercase tracking-[0.2em] shadow-xl shadow-gold/20">
                            Access Marketplace <ArrowRight className="w-5 h-5 ml-3" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                    {subscriptions.map((sub) => (
                        <Card key={sub.id} className="relative group overflow-hidden border-zinc-900 bg-zinc-950/40 hover:border-gold/30 hover:bg-zinc-900/30 transition-all duration-500 rounded-[2.5rem] flex flex-col items-stretch">
                            <CardContent className="p-10 flex flex-col h-full">
                                {/* Status Header */}
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                                        <Activity className={`w-8 h-8 ${sub.status === 'active' ? 'text-gold drop-shadow-[0_0_8px_#D4AF37]' : 'text-zinc-600'}`} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-inner flex items-center gap-2 ${sub.status === 'active'
                                        ? 'bg-gold/10 text-gold border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                                        : 'bg-zinc-900/50 text-zinc-500 border-zinc-800'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-gold animate-pulse' : 'bg-zinc-600'}`}></span>
                                        {sub.status === 'active' ? 'Account Paid' : 'Payment Required'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter group-hover:text-gold transition-colors">{sub.indicator.name}</h3>
                                <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider mb-10 line-clamp-2">
                                    {sub.indicator.description || "Elite TradingView script deployment via AlgoMarket matrix."}
                                </p>

                                <div className="space-y-5 pt-8 border-t border-zinc-900/50 mt-auto">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-zinc-600 flex items-center gap-2.5">
                                            <Clock className="w-3.5 h-3.5" /> Billing Cycle
                                        </span>
                                        <span className="text-white italic">
                                            {sub.status === 'active' ? sub.currentPeriodEnd.toLocaleDateString() : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-zinc-600 flex items-center gap-2.5">
                                            <Key className="w-3.5 h-3.5" /> Deployment
                                        </span>
                                        {sub.accessStatus === "granted" ? (
                                            <span className="text-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]">Authorized</span>
                                        ) : (
                                            <span className={`${sub.status === 'active' ? 'text-amber-500' : 'text-zinc-600'} flex items-center gap-2`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-600'}`}></span>
                                                {sub.status === 'active' ? 'Syncing...' : 'Locked'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10">
                                    {sub.status === 'active' ? (
                                        <Button variant="outline" className="w-full h-14 text-[10px] font-black uppercase tracking-widest border-zinc-800 bg-zinc-900/50 text-zinc-400 cursor-not-allowed">
                                            Subscription Active
                                        </Button>
                                    ) : (
                                        <Link href={`/checkout/${sub.indicatorId}`} className="w-full">
                                            <Button className="w-full h-14 text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                                Pay Now & Activate
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

