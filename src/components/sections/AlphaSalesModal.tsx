"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, Globe, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AlphaSalesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AlphaSalesModal({ isOpen, onClose }: AlphaSalesModalProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        company: "",
        email: "",
        interest: "API Access",
        scale: "100-500 Users",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/sales-leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Status Header */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-gold via-white to-gold animate-gradient-x" />

                        <div className="p-10 md:p-12">
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {submitted ? (
                                <div className="text-center py-10 space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-widest">Lead Transmitted</h3>
                                    <p className="text-zinc-400 font-medium">An Alpha Specialist will contact your corporate office within 24 hours.</p>
                                    <Button onClick={onClose} variant="outline" className="mt-8 border-zinc-800 h-14 px-12 uppercase tracking-widest">Close Secure Link</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div>
                                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Alpha <span className="text-gold">Sales</span></h2>
                                        <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">Institutional Access Application</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Corporate Name</label>
                                            <input
                                                required
                                                value={form.company}
                                                onChange={e => setForm({ ...form, company: e.target.value })}
                                                placeholder="Quant Alpha Group"
                                                className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 transition-all font-bold placeholder:text-zinc-800"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Work Email</label>
                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                placeholder="ops@quantalpha.com"
                                                className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 transition-all font-bold placeholder:text-zinc-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Primary Interest</label>
                                            <select
                                                value={form.interest}
                                                onChange={e => setForm({ ...form, interest: e.target.value })}
                                                className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 transition-all font-bold appearance-none cursor-pointer"
                                            >
                                                <option>API Access</option>
                                                <option>White-label Solutions</option>
                                                <option>Bulk Whitelisting</option>
                                                <option>Custom Development</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Target Scale</label>
                                            <select
                                                value={form.scale}
                                                onChange={e => setForm({ ...form, scale: e.target.value })}
                                                className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 transition-all font-bold appearance-none cursor-pointer"
                                            >
                                                <option>100-500 Users</option>
                                                <option>500-2,500 Users</option>
                                                <option>2,500+ Users</option>
                                                <option>Institutional / Fund</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Strategic Intel (Optional)</label>
                                        <textarea
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            placeholder="Describe your current infrastructure..."
                                            rows={3}
                                            className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 transition-all font-bold placeholder:text-zinc-800 resize-none"
                                        />
                                    </div>

                                    <div className="pt-4 flex flex-col md:flex-row gap-4">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            size="lg"
                                            className="flex-1 h-16 text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-gold/10"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>Transmit Application <Zap className="w-4 h-4 ml-2" /></>
                                            )}
                                        </Button>
                                        <div className="flex items-center gap-4 px-6 opacity-30">
                                            <ShieldCheck className="w-5 h-5 text-gold" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Tunnel Active</span>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
