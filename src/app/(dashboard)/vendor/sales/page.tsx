import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DollarSign, TrendingUp, CreditCard, Users, ArrowUpRight, Activity, Zap, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function VendorSalesPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">
                    Operational <span className="text-gold">Ledger</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase">Institutional capital flow and subscription performance matrix</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Recurring Revenue", value: "$4,250", icon: <DollarSign className="w-5 h-5 text-gold" />, trend: "+12.5%", sub: "MRR Status" },
                    { label: "Active Fleet", value: "85", icon: <Users className="w-5 h-5 text-gold" />, trend: "+5.1%", sub: "Subscribers" },
                    { label: "Vector Alpha", value: "4.2%", icon: <TrendingUp className="w-5 h-5 text-gold" />, trend: "+0.4%", sub: "Conversion" },
                    { label: "Yield (LTV)", value: "$450", icon: <CreditCard className="w-5 h-5 text-gold" />, trend: "Steady", sub: "Equity Value" },
                ].map((kpi, i) => (
                    <Card key={i} className="border-zinc-900 bg-zinc-950/40 hover:border-gold/30 transition-all duration-500 rounded-[2rem] group">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-xl bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:scale-110 transition-transform">
                                    {kpi.icon}
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${kpi.trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                                    }`}>
                                    {kpi.trend}
                                </span>
                            </div>
                            <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{kpi.label}</h4>
                            <div className="text-3xl font-black text-white italic tracking-tighter mb-2">{kpi.value}</div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">{kpi.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Analytics Surface */}
            <Card className="border-zinc-900 bg-zinc-950/40 rounded-[3rem] overflow-hidden min-h-[500px] flex flex-col relative group">
                <div className="p-10 border-b border-zinc-900 flex items-center justify-between relative z-10">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Revenue Performance Matrix</h3>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Real-time capital distribution analytics</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="h-10 px-6 text-[10px] font-bold uppercase border-zinc-800 hover:bg-zinc-900">7D</Button>
                        <Button variant="outline" size="sm" className="h-10 px-6 text-[10px] font-bold uppercase border-gold/30 bg-gold/5 text-gold">30D</Button>
                        <Button variant="outline" size="sm" className="h-10 px-6 text-[10px] font-bold uppercase border-zinc-800 hover:bg-zinc-900">ALL</Button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    {/* Abstract Institutional "Graph" Visualization */}
                    <div className="relative z-10 text-center px-10">
                        <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-zinc-800 shadow-2xl group-hover:scale-110 group-hover:border-gold/30 transition-all duration-500">
                            <Activity className="w-12 h-12 text-zinc-700 group-hover:text-gold transition-colors" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-widest mb-4">Awaiting Data Streams</h3>
                        <p className="text-zinc-500 max-w-md mx-auto font-medium leading-relaxed uppercase tracking-wide text-xs">
                            High-frequency transactional data is being indexed for visualization. Charts will initialize upon the next institutional settlement cycle.
                        </p>
                    </div>

                    {/* Fake Chart Lines (Decorative) */}
                    <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-1000">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <path d="M0,100 Q200,50 400,150 T800,80 T1200,120 T1600,40" fill="none" stroke="#D4AF37" strokeWidth="4" />
                            <path d="M0,120 Q200,80 400,180 T800,110 T1200,150 T1600,70" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="10 10" />
                        </svg>
                    </div>
                </div>

                <div className="p-8 bg-black/40 border-t border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            <Zap className="w-3.5 h-3.5" /> Real-time Streaming
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                            <ShieldCheck className="w-3.5 h-3.5" /> Vault Verified
                        </div>
                    </div>
                    <Button variant="outline" className="h-10 px-8 text-[10px] font-black uppercase tracking-widest border-zinc-800 hover:text-white">
                        Export Dataset (.CSV)
                    </Button>
                </div>
            </Card>
        </div>
    );
}

