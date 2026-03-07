"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ExternalLink, Loader2, Clock, Check, X, ShieldAlert } from "lucide-react";

export default function AdminPaymentsTable({ initialPayments }: { initialPayments: any[] }) {
    const [payments, setPayments] = useState(initialPayments);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

    const filteredPayments = payments.filter(p => p.status === activeTab);

    const handleAction = async (paymentId: string, action: "approve" | "reject") => {
        if (!confirm(`Are you sure you want to ${action} this payment?`)) return;

        setProcessingId(paymentId);
        try {
            const res = await fetch(`/api/admin/payments/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Failed to ${action}`);
            }

            // Update local status instead of removing, so it moves to respective tab
            const updatedStatus = action === "approve" ? "approved" : "rejected";
            setPayments(prev => prev.map(p =>
                p.id === paymentId ? { ...p, status: updatedStatus } : p
            ));
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const tabs = [
        { id: "pending", label: "Pending Verification", icon: <Clock className="w-4 h-4" />, color: "text-amber-500" },
        { id: "approved", label: "Settlement History", icon: <Check className="w-4 h-4" />, color: "text-emerald-500" },
        { id: "rejected", label: "Rejected Requests", icon: <X className="w-4 h-4" />, color: "text-red-500" },
    ];

    return (
        <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-zinc-900 bg-zinc-900/20">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? `${tab.color} bg-white/5` : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.02]"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.id === 'pending' ? 'bg-amber-500' :
                                    tab.id === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
                                }`} />
                        )}
                        <span className="ml-2 px-2 py-0.5 rounded-md bg-black/40 text-[8px] border border-white/10">
                            {payments.filter(p => p.status === tab.id).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-black/40 text-[9px] uppercase text-zinc-600 font-black tracking-[0.3em] border-b border-zinc-900">
                        <tr>
                            <th className="px-8 py-6">Buyer Vector</th>
                            <th className="px-8 py-6">Indicator Path</th>
                            <th className="px-8 py-6">Value (USD)</th>
                            <th className="px-8 py-6">Cipher (TXID)</th>
                            <th className="px-8 py-6">Evidence</th>
                            {activeTab === "pending" && <th className="px-8 py-6 text-right">Settlement Action</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 bg-transparent">
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan={activeTab === "pending" ? 6 : 5} className="px-8 py-12 text-center text-zinc-700 italic font-medium uppercase text-xs tracking-widest">
                                    No records present in this matrix sector.
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white uppercase tracking-tight italic">{payment.buyerEmail}</span>
                                            <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mt-0.5">ID: {payment.buyerId?.slice(0, 8)}...</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                            <span className="uppercase text-[10px] font-black text-zinc-300 tracking-wider italic">{payment.indicatorName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-black text-white italic tracking-tighter text-base">${payment.amount}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-mono text-[10px] text-zinc-500 bg-black/40 px-2 py-1 rounded border border-zinc-900">{payment.transactionId}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        {payment.screenshotUrl ? (
                                            <a href={payment.screenshotUrl} target="_blank" rel="noreferrer" className="text-gold hover:text-white inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                                                View Evidence <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-zinc-800 italic text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <ShieldAlert className="w-3 h-3" /> No Proof
                                            </span>
                                        )}
                                    </td>
                                    {activeTab === "pending" && (
                                        <td className="px-8 py-5 text-right">
                                            {processingId === payment.id ? (
                                                <div className="inline-flex items-center gap-2 text-gold animate-pulse text-[10px] font-black uppercase tracking-widest">
                                                    <Loader2 className="w-3 h-3 animate-spin" /> Verifying...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-4">
                                                    <button
                                                        onClick={() => handleAction(payment.id, "approve")}
                                                        className="h-10 px-4 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5 group/btn"
                                                        title="Authorize Settlement"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                        Authorize
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(payment.id, "reject")}
                                                        className="h-10 px-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/5 group/btn"
                                                        title="Reject Request"
                                                    >
                                                        <XCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
