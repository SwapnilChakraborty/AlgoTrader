"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Code, DollarSign, FileText, Zap } from "lucide-react";
import Link from "next/link";
import { createIndicator } from "@/app/actions/indicator";

export default function NewIndicatorPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);

        const result = await createIndicator(null, formData);

        if (result?.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else if (result?.success) {
            router.push("/vendor/indicators");
            router.refresh();
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/vendor/indicators"
                    className="p-2 glass rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Upload New Indicator</h1>
                    <p className="text-sm text-slate-500">Add your TradingView script details and pricing</p>
                </div>
            </div>

            <form action={handleSubmit} className="glass rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                    {/* General Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-[var(--color-border)] pb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" /> General Details
                        </h3>

                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Indicator Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                minLength={3}
                                placeholder="e.g. Next-Gen Trend Tracker Pro"
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Describe what makes your indicator unique, how to use it, and what assets it works best on..."
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-[var(--color-border)] rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
                            />
                        </div>
                    </div>

                    {/* Technical & Pricing */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-[var(--color-border)] pb-2 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-teal-500" /> Integration & Pricing
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label htmlFor="scriptId" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                    <Code className="w-4 h-4 text-slate-400" /> TradingView Script ID
                                </label>
                                <input
                                    type="text"
                                    id="scriptId"
                                    name="scriptId"
                                    required
                                    placeholder="e.g. STD;abc123xyz"
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
                                />
                                <p className="text-xs text-slate-500 mt-1">The unique ID from your published invite-only script.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="price" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-slate-400" /> Monthly Price (USD)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="29.99"
                                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-[var(--color-border)] rounded-lg pl-8 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-semibold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-[var(--color-border)] flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn-secondary"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Publish Indicator</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
