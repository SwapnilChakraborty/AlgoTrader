"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function VendorSetupForm() {
    const [transactionId, setTransactionId] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!transactionId || transactionId.length < 8) {
            setError("Identification cipher too short (Min 8 characters)");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/vendor-setup/manual-submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId, notes }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Broadcast failure: Activation request denied");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                    <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center relative z-10 border border-emerald-500/20">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-widest">Broadcast Locked</h3>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                        Cipher <span className="text-white font-mono tracking-normal">{transactionId}</span> has been indexed.
                        Institutional review is propagating through the network.
                    </p>
                </div>
                <Button
                    onClick={() => window.location.href = "/dashboard"}
                    variant="outline"
                    className="mt-6 px-10 h-14 border-zinc-800 hover:bg-zinc-900 text-white shadow-xl"
                >
                    <span className="uppercase tracking-widest text-xs font-black">Return to Terminal</span>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
                <div className="p-6 rounded-[1.5rem] bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    {error}
                </div>
            )}

            <div className="space-y-8">
                {/* Transaction ID */}
                <div className="space-y-3">
                    <label htmlFor="transactionId" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-gold/50" />
                        Settlement Cipher (TXID) <span className="text-gold">*</span>
                    </label>
                    <div className="relative group/input">
                        <input
                            id="transactionId"
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-bold uppercase tracking-widest text-xs italic placeholder:text-zinc-600"
                            placeholder="Enter 12-digit reference..."
                            required
                        />
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-focus-within/input:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                    </div>
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-gold/30" />
                        Unique matrix identifier from your settlement app
                    </p>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                    <label htmlFor="notes" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-gold/50" />
                        Creator Vision (Optional)
                    </label>
                    <div className="relative group/input">
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-bold uppercase tracking-widest text-xs italic placeholder:text-zinc-600 min-h-[140px] resize-none"
                            placeholder="Detail your strategy lifecycle..."
                        />
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-focus-within/input:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading || !transactionId}
                className="w-full h-16 shadow-2xl shadow-gold/20 group"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        <span className="uppercase tracking-widest text-xs font-black italic">Propagating...</span>
                    </>
                ) : (
                    <>
                        <span className="uppercase tracking-widest text-xs font-black italic">Initialize Activation</span>
                        <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform duration-500" />
                    </>
                )}
            </Button>
        </form>
    );
}

