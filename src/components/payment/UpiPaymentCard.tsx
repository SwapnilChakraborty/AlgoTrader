"use client";

import { useState } from "react";
import { QrCode, Copy, Check, ShieldCheck, Zap, ArrowDown } from "lucide-react";

interface UpiPaymentCardProps {
    upiId: string;
    amount?: string | number;
    name?: string;
    notes?: string;
    title?: string;
}

export default function UpiPaymentCard({
    upiId,
    amount,
    name = "AlgoMarket",
    notes = "Payment",
    title = "Secure Capital Transfer"
}: UpiPaymentCardProps) {
    const [copied, setCopied] = useState(false);

    // Construct UPI Link: upi://pay?pa=ADDRESS&pn=NAME&am=AMOUNT&cu=INR&tn=NOTES
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}${amount ? `&am=${amount}` : ""}&cu=INR&tn=${encodeURIComponent(notes)}`;

    // QR Code API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}&bgcolor=ffffff&color=000000`;

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 md:p-10 space-y-10 relative overflow-hidden group shadow-2xl">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                            <QrCode className="w-6 h-6 text-gold" />
                            {title}
                        </h2>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Direct P2P Settlement Layer</p>
                    </div>
                    {amount && (
                        <div className="px-5 py-2 rounded-xl bg-gold/10 border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                            <span className="text-xl font-black text-gold italic">${amount}</span>
                        </div>
                    )}
                </div>

                <div className="relative mx-auto w-64 h-64 group/qr">
                    <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 via-gold/5 to-gold/20 rounded-[2rem] blur-xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-1000" />
                    <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl transition-transform duration-500 group-hover/qr:scale-[1.02] border-4 border-zinc-900 flex items-center justify-center h-full sm:h-auto">
                        <img
                            src={qrUrl}
                            alt="Institutional Payment QR"
                            width={220}
                            height={220}
                            className="rounded-lg mix-blend-multiply"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                <div className="bg-black/40 rounded-2xl p-5 border border-zinc-900 flex items-center justify-between group/copy transition-all hover:border-gold/30">
                    <div className="overflow-hidden">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] mb-1.5">Recipient Vector (UPI ID)</p>
                        <p className="text-white font-black tracking-widest text-xs italic truncate">{upiId}</p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="w-12 h-12 flex items-center justify-center bg-zinc-900 hover:bg-gold/10 rounded-xl border border-zinc-800 hover:border-gold/30 transition-all text-zinc-500 hover:text-gold shrink-0 shadow-lg"
                        title="Copy Identifier"
                    >
                        {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>

                <div className="p-6 bg-gold/5 rounded-2xl border border-gold/10 flex gap-5 group/shield">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20 shadow-[0_0_10px_rgba(212,175,55,0.1)] group-hover/shield:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] mb-1">
                            <span>Protocol Verified Access</span>
                            <Zap className="w-3 h-3 text-gold fill-gold" />
                        </div>
                        <p className="text-[9px] text-zinc-500 leading-relaxed font-black uppercase tracking-widest">
                            Authorized settlement channel. Execute transfer for <span className="text-white font-bold tracking-normal italic">{amount ? `$${amount}` : "the contract value"}</span>.
                            Submit verification cipher (TXID) upon completion.
                        </p>
                    </div>
                </div>
            </div>

            {/* Instruction Cue */}
            <div className="pt-4 flex flex-col items-center gap-3">
                <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
                <p className="text-[9px] font-black text-gold/50 uppercase tracking-[0.5em] italic animate-pulse">Scan to Initiate</p>
            </div>
        </div>
    );
}
