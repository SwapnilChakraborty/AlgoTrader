import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import { Activity, Users, ShoppingCart, ShieldCheck, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, History, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    // Fetch stats
    const usersSnap = await adminDb.collection("users").get();
    const paymentsSnap = await adminDb.collection("manual_payments").get();
    const subsSnap = await adminDb.collection("subscriptions").where("status", "==", "active").get();

    const totalUsers = usersSnap.size;
    const activeSubs = subsSnap.size;

    let totalRevenue = 0;
    let pendingPayments = 0;

    paymentsSnap.forEach(doc => {
        const data = doc.data();
        if (data.status === "approved" && data.amount) {
            totalRevenue += parseFloat(data.amount.toString());
        } else if (data.status === "pending") {
            pendingPayments++;
        }
    });

    const stats = [
        { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <TrendingUp className="w-6 h-6 text-emerald-500" />, trend: "+12.5%", color: "text-emerald-500" },
        { label: "Active Vectors", value: activeSubs, icon: <Zap className="w-6 h-6 text-gold" />, trend: "+3", color: "text-gold" },
        { label: "Total Population", value: totalUsers, icon: <Users className="w-6 h-6 text-indigo-500" />, trend: "+8", color: "text-indigo-500" },
        { label: "Pending Liquidations", value: pendingPayments, icon: <ShoppingCart className="w-6 h-6 text-amber-500" />, trend: "Active", color: "text-amber-500" },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">
                    Matrix <span className="text-gold">Command Center</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase italic">Level 4 Administrative Oversight / Real-time System Matrix</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-zinc-950/40 border-zinc-900 rounded-[2rem] hover:border-gold/20 transition-all duration-500 group">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 group-hover:bg-gold/5 transition-colors">
                                    {stat.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color} bg-white/5 px-2 py-1 rounded-md`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Actions */}
                <Card className="lg:col-span-2 bg-zinc-950/40 border-zinc-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-zinc-900 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black text-white uppercase italic tracking-widest">Recent Matrix Activity</CardTitle>
                            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mt-1">Live Transaction Stream</p>
                        </div>
                        <Link href="/admin/payments">
                            <Button variant="outline" size="sm" className="text-[10px] font-black border-zinc-800 hover:bg-zinc-900 p-4 rounded-xl">View All</Button>
                        </Link>
                    </CardHeader>
                    <div className="divide-y divide-zinc-900">
                        {paymentsSnap.docs.slice(0, 5).map(doc => {
                            const data = doc.data();
                            return (
                                <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${data.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                            data.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-red-500/10 border-red-500/20 text-red-500'
                                            }`}>
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">{data.buyerEmail || 'Unknown'}</p>
                                            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{data.indicatorName || 'Sub'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white italic">${data.amount}</p>
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${data.status === 'approved' ? 'text-emerald-500' :
                                            data.status === 'pending' ? 'text-amber-500' :
                                                'text-red-500'
                                            }`}>{data.status}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-zinc-950/40 border-zinc-900 rounded-[2.5rem] p-8 space-y-8">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Administrative Hub</h3>
                    <div className="grid gap-4">
                        <Link href="/admin/users">
                            <button className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-gold/30 hover:bg-gold/5 transition-all text-left group">
                                <Users className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">Population Control</p>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Manage User Permissions</p>
                                </div>
                            </button>
                        </Link>
                        <Link href="/admin/payments">
                            <button className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-gold/30 hover:bg-gold/5 transition-all text-left group">
                                <ShoppingCart className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">Fiat Gateway</p>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Verify Ledger Settlement</p>
                                </div>
                            </button>
                        </Link>
                        <Link href="/admin/vendor-approvals">
                            <button className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-gold/30 hover:bg-gold/5 transition-all text-left group">
                                <ShieldCheck className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">Elite Approvals</p>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Vendor Access Grants</p>
                                </div>
                            </button>
                        </Link>
                        <Link href="/admin/logs">
                            <button className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4 hover:border-gold/30 hover:bg-gold/5 transition-all text-left group">
                                <History className="w-6 h-6 text-zinc-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">System Matrix</p>
                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Audit Logs & Telemetry</p>
                                </div>
                            </button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
