import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Zap, Clock, Info, ShieldCheck, Crown, Cpu } from "lucide-react";
import VendorSetupForm from "./VendorSetupForm";
import { adminDb } from "@/lib/firebase/admin";
import UpiPaymentCard from "@/components/payment/UpiPaymentCard";

export default async function VendorSetupPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role === "VENDOR") {
        redirect("/vendor/indicators");
    }

    if (session.user.role !== "PENDING_VENDOR") {
        redirect("/dashboard");
    }

    const platformUpiId = process.env.NEXT_PUBLIC_ADMIN_UPI_ID || "admin@algo-market";
    const setupFee = "99";

    // Check for existing pending request
    const pendingRequestSnapshot = await adminDb
        .collection("vendor_setup_requests")
        .where("vendorId", "==", session.user.id)
        .where("status", "==", "pending")
        .limit(1)
        .get();

    const hasPendingRequest = !pendingRequestSnapshot.empty;

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-10 px-6 pb-24">
            {/* Header Section */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                    <Crown className="w-3.5 h-3.5 fill-gold" />
                    <span>Elite Creator Tier</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-widest uppercase italic leading-tight">
                    Platform <span className="text-gold">Activation</span>
                </h1>
                <p className="text-zinc-500 max-w-2xl mx-auto font-medium uppercase tracking-widest text-xs leading-relaxed">
                    To maintain institutional standards and support distributed node infrastructure, a one-time activation protocol is required for new creators.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mt-16 items-start">
                {/* Payment Card Section */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 rounded-[3rem] blur-xl opacity-50"></div>
                    <UpiPaymentCard
                        upiId={platformUpiId}
                        amount={setupFee}
                        name="AlgoMarket Node Activation"
                        notes="Institutional Vendor Seat"
                        title="Activation Settlement"
                    />
                </div>

                {/* Submission Form or Pending State */}
                <div className="relative group min-h-full">
                    <div className="absolute -inset-1 bg-zinc-900/50 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-zinc-950/40 rounded-[2.5rem] p-10 border border-zinc-900 h-full shadow-2xl backdrop-blur-sm">
                        {hasPendingRequest ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-12">
                                <div className="relative">
                                    <div className="absolute -inset-8 bg-gold/10 rounded-full blur-2xl animate-pulse"></div>
                                    <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] border border-zinc-800 flex items-center justify-center shadow-2xl relative z-10">
                                        <Clock className="w-12 h-12 text-gold animate-spin-slow" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-white uppercase italic tracking-widest">Verification Flux</h2>
                                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
                                        Institutional audit in progress. Our consensus layer is verifying your settlement.
                                    </p>
                                </div>
                                <div className="bg-gold/5 p-6 rounded-2xl border border-gold/10 w-full text-left flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1.5">SLA Timeline</p>
                                        <p className="text-white text-xs font-black uppercase tracking-widest italic">2 - 6 Settlement Hours</p>
                                    </div>
                                    <ShieldCheck className="w-6 h-6 text-gold/30" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-800 text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
                                    <p className="flex items-center gap-3 text-gold mb-4 text-xs italic">
                                        <Cpu className="w-4 h-4 text-gold" />
                                        Onboarding Protocol
                                    </p>
                                    <ol className="space-y-4">
                                        <li className="flex gap-4">
                                            <span className="text-gold">01.</span> Execute UPI settlement via the secure QR.
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="text-gold">02.</span> Extract the 12-digit transaction ID.
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="text-gold">03.</span> Submit ID below for institutional audit.
                                        </li>
                                    </ol>
                                </div>
                                <VendorSetupForm />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

