"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ExternalLink, Clock, User, Mail, Hash, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface Request {
    id: string;
    vendorId: string;
    vendorEmail: string;
    transactionId: string;
    notes: string | null;
    status: string;
    createdAt: string;
}

export default function AdminVendorApprovalsTable({ initialRequests }: { initialRequests: Request[] }) {
    const [requests, setRequests] = useState(initialRequests);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    const handleApprove = async (requestId: string, vendorId: string) => {
        if (!confirm("Authorize institutional role upgrade for this entity?")) return;

        setProcessingId(requestId);
        try {
            const res = await fetch("/api/admin/vendor-approvals/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, vendorId }),
            });

            if (res.ok) {
                setRequests(requests.filter(r => r.id !== requestId));
            } else {
                const data = await res.json();
                alert(data.error || "Authorization propagation failure");
            }
        } catch (err) {
            alert("Network consensus error during authorization");
        } finally {
            setProcessingId(null);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="p-24 text-center space-y-8 animate-in fade-in duration-700">
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute -inset-4 bg-gold/5 rounded-full blur-xl"></div>
                    <div className="w-24 h-24 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 flex items-center justify-center relative z-10">
                        <ShieldCheck className="w-10 h-10 text-zinc-700" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Protocol Clear</h3>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">All pending activation ciphers have been processed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-950/20">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Entity Vector</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Settlement Cipher</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Broadcasted</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic text-right">Oversight Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                    {requests.map((request) => (
                        <tr key={request.id} className="hover:bg-gold/[0.02] transition-colors group/row">
                            <td className="px-8 py-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover/row:border-gold/30 transition-colors">
                                        <User className="w-6 h-6 text-zinc-500 group-hover/row:text-gold transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-white font-black tracking-widest text-sm uppercase italic">{request.vendorEmail}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">UID:</p>
                                            <p className="text-[9px] text-zinc-500 font-mono tracking-tighter">{request.vendorId}</p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black border border-zinc-900 w-fit">
                                        <Hash className="w-3 h-3 text-gold/50" />
                                        <p className="text-white font-mono text-[10px] tracking-widest">{request.transactionId}</p>
                                    </div>
                                    {request.notes ? (
                                        <div className="flex gap-2 max-w-xs">
                                            <Zap className="w-3 h-3 text-gold/30 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic line-clamp-2">
                                                "{request.notes}"
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest italic ml-1">No transmission notes</p>
                                    )}
                                </div>
                            </td>
                            <td className="px-8 py-8">
                                <div className="flex flex-col">
                                    <span className="text-white font-black tracking-widest text-[10px] uppercase italic">
                                        {new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">
                                        {new Date(request.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-8 text-right">
                                <Button
                                    onClick={() => handleApprove(request.id, request.vendorId)}
                                    disabled={processingId === request.id}
                                    variant="outline"
                                    className="h-12 px-6 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-500 transition-all group/btn shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                                >
                                    {processingId === request.id ? (
                                        <Clock className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                            <span className="uppercase tracking-widest text-[10px] font-black italic">Authorize Access</span>
                                        </>
                                    )}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

