import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import SettingsForm from "./SettingsForm";
import { Settings, UserCircle, ShieldCheck, Sparkles, Key, Lock, Fingerprint } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    if (!userData) {
        redirect("/login");
    }

    const initialData = {
        name: userData.name || session.user.name || "",
        tradingviewUsername: userData.tradingviewUsername || "",
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header Section */}
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-6 shadow-[inset_0_0_15px_rgba(212,175,55,0.05)]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Secure Configuration</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase italic">
                    Personal <span className="text-gold">Terminal</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase">Managing identity vectors and operational credentials</p>
            </div>

            <div className="grid gap-12">
                {/* Profile Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-zinc-950/40 rounded-[2.5rem] border border-zinc-900 overflow-hidden shadow-2xl">
                        <div className="p-8 md:p-10 border-b border-zinc-900 bg-zinc-900/20 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
                                <UserCircle className="w-8 h-8 text-gold drop-shadow-[0_0_5px_#D4AF37]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-widest">Profile Identity</h2>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Operational ID and public alias</p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <SettingsForm initialData={initialData} />
                        </div>
                    </div>
                </div>

                {/* Security Advisory */}
                <div className="bg-gold/5 border border-gold/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 group">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 group-hover:border-gold/30 transition-all shadow-2xl">
                        <ShieldCheck className="w-10 h-10 text-gold" />
                    </div>
                    <div className="space-y-3 text-center md:text-left">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Protocol Shielding</h3>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed uppercase tracking-wide">
                            Your <span className="text-white font-bold">TradingView Alias</span> is fundamental for institutional script provisioning.
                            AlgoMarket operates under zero-trust protocols; your data vectors are encrypted and shielded from external entities.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

