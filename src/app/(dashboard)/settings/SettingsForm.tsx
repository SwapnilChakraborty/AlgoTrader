"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateUserSettings } from "@/app/actions/user";
import { Save, AlertCircle, CheckCircle2, User, Globe, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto px-10 h-14 shadow-xl shadow-gold/20 group"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    <span className="uppercase tracking-widest text-xs font-black">Syncing Matrix...</span>
                </>
            ) : (
                <>
                    <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="uppercase tracking-widest text-xs font-black">Save Terminal Profile</span>
                </>
            )}
        </Button>
    );
}

interface SettingsFormProps {
    initialData: {
        name: string;
        tradingviewUsername: string;
    };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [state, formAction] = useFormState(updateUserSettings, null);

    return (
        <form action={formAction} className="space-y-10">
            {state?.error && (
                <div className="p-6 rounded-[1.5rem] bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="p-6 rounded-[1.5rem] bg-gold/5 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    {state.message}
                </div>
            )}

            <div className="grid gap-8 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-3">
                    <label htmlFor="name" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-3">
                        <User className="w-4 h-4 text-gold/50" />
                        Operational Alias
                    </label>
                    <div className="relative group/input">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={initialData.name}
                            placeholder="Identify yourself..."
                            className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-bold uppercase tracking-widest text-xs italic placeholder:text-zinc-600"
                        />
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-focus-within/input:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                    </div>
                </div>

                {/* TradingView Username */}
                <div className="space-y-3">
                    <label htmlFor="tradingviewUsername" className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gold/50" />
                        TradingView Vector
                    </label>
                    <div className="relative group/input">
                        <input
                            id="tradingviewUsername"
                            name="tradingviewUsername"
                            type="text"
                            defaultValue={initialData.tradingviewUsername}
                            placeholder="Matrix identifier..."
                            className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all font-bold uppercase tracking-widest text-xs italic placeholder:text-zinc-600"
                        />
                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-focus-within/input:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                    </div>
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Authorization requisite for elite script access
                    </p>
                </div>
            </div>

            <div className="pt-10 border-t border-zinc-900 flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}

