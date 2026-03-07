import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import VendorSettingsForm from "./VendorSettingsForm";
import { Settings, Shield, Zap, Lock, Cpu, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorSettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    let initialEmail = "";
    let initialPassword = "";
    let initialUpiId = "";

    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    if (userDoc.exists) {
        const data = userDoc.data();
        initialEmail = data?.tradingviewEmail || "";
        initialPassword = data?.tradingviewPassword || "";
        initialUpiId = data?.upiId || "";
    }

    return (
        <div className="max-w-4xl space-y-12 pb-20">
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-6">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Automation Matrix</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase italic">
                    Auto-<span className="text-gold">Pilot</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase">Operational credentials and capital distribution parameters</p>
            </div>

            <div className="grid gap-12">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-zinc-950/40 rounded-[2.5rem] border border-zinc-900 overflow-hidden shadow-2xl">
                        <div className="p-8 md:p-10 border-b border-zinc-900 bg-zinc-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl group-hover:bg-gold/10 transition-all duration-500">
                                    <Shield className="w-8 h-8 text-gold drop-shadow-[0_0_5px_#D4AF37]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-widest">Automation Protocol</h2>
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">TradingView Script Provisioning</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-black/20 border-b border-zinc-900/50">
                            <div className="flex gap-4 items-start max-w-2xl">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium uppercase tracking-wide">
                                    AlgoMarket's background workers require these credentials to verify and grant script access to your verified subscribers in real-time.
                                    All data is encrypted within institutional-grade vaults.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <VendorSettingsForm initialEmail={initialEmail} initialPassword={initialPassword} initialUpiId={initialUpiId} />
                        </div>
                    </div>
                </div>

                {/* Additional Info / Security Badge */}
                <div className="flex items-center justify-center p-8 border border-zinc-900 rounded-[2rem] bg-zinc-950/20 group">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-gold/30 group-hover:text-gold transition-colors" />
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">AES-256 Encryption</span>
                        </div>
                        <div className="w-px h-4 bg-zinc-800" />
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-gold/30 group-hover:text-gold transition-colors" />
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Distributed Node Cluster</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

