import { getIndicatorById } from "@/app/actions/indicator";
import { Copy, UploadCloud, CheckCircle2, QrCode } from "lucide-react";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

export default async function CheckoutPage({
    params
}: {
    params: Promise<{ indicatorId: string }>
}) {
    const { indicatorId } = await params;
    const indicator = await getIndicatorById(indicatorId);

    if (!indicator) {
        notFound();
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    let initialTradingviewUsername = "";
    const userDoc = await adminDb.collection("users").doc(session.user.id).get();
    if (userDoc.exists) {
        initialTradingviewUsername = userDoc.data()?.tradingviewUsername || "";
    }

    // Ensure a pending subscription record exists so it shows in "Billing"
    const subsSnapshot = await adminDb.collection("subscriptions")
        .where("userId", "==", session.user.id)
        .where("indicatorId", "==", indicatorId)
        .limit(1)
        .get();

    if (subsSnapshot.empty) {
        await adminDb.collection("subscriptions").add({
            userId: session.user.id,
            indicatorId: indicatorId,
            status: "pending",
            accessStatus: "pending",
            createdAt: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
    }

    // Fetch vendor's UPI ID from their user document
    let upiId = process.env.NEXT_PUBLIC_UPI_ID || "example@upi";
    if (indicator.vendorId) {
        const vendorDoc = await adminDb.collection("users").doc(indicator.vendorId).get();
        if (vendorDoc.exists) {
            const vendorUpiId = vendorDoc.data()?.upiId;
            if (vendorUpiId) {
                upiId = vendorUpiId;
            } else {
                upiId = "VENDOR_NOT_CONFIGURED@upi"; // Fallback if vendor hasn't set it yet
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Complete Your Payment</h1>
                    <p className="text-gray-400">Subscribe to {indicator.name} for ${indicator.price}/month</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Payment Instructions & QR */}
                    <div className="space-y-8">
                        <UpiPaymentCard
                            upiId={upiId}
                            amount={indicator.price}
                            name={indicator.name}
                            notes={`Subscription: ${indicator.name}`}
                        />

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-gray-400 space-y-4">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Info className="w-4 h-4 text-indigo-400" />
                                Next Steps
                            </h3>
                            <ol className="list-decimal list-inside space-y-2 ml-1">
                                <li>Scan the QR or copy the UPI ID above</li>
                                <li>Make the payment in your preferred UPI app</li>
                                <li>Copy the 12-digit Transaction ID from your app</li>
                                <li>Fill out and submit the form to the right</li>
                            </ol>
                        </div>
                    </div>

                    {/* Submission Form */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 h-full">
                        <ManualPaymentForm indicatorId={indicator.id} indicatorName={indicator.name} price={indicator.price} initialTradingviewUsername={initialTradingviewUsername} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Separate client component for form handling to keep page server-side rendered mostly
import ManualPaymentForm from "./ManualPaymentForm";
import UpiPaymentCard from "@/components/payment/UpiPaymentCard";
import { Info } from "lucide-react";
