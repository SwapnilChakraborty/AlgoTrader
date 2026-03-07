import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import AdminPaymentsTable from "./AdminPaymentsTable";

export default async function AdminPaymentsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch all payments for history visibility
    const paymentsSnapshot = await adminDb
        .collection("manual_payments")
        .get();

    let pendingPayments = await Promise.all(paymentsSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Fetch buyer email
        let buyerEmail = "Unknown";
        if (data.buyerId) {
            const userDoc = await adminDb.collection("users").doc(data.buyerId).get();
            if (userDoc.exists) buyerEmail = userDoc.data()?.email || "Unknown";
        }

        // Fetch indicator name
        let indicatorName = "Unknown";
        if (data.indicatorId) {
            const indicatorDoc = await adminDb.collection("indicators").doc(data.indicatorId).get();
            if (indicatorDoc.exists) indicatorName = indicatorDoc.data()?.name || "Unknown";
        }

        return {
            id: doc.id,
            buyerEmail,
            indicatorName,
            amount: data.amount,
            transactionId: data.transactionId,
            screenshotUrl: data.screenshotUrl,
            status: data.status,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            indicatorId: data.indicatorId,
            buyerId: data.buyerId
        };
    }));

    // In-memory sort to bypass index requirements
    pendingPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">
                    Fiat <span className="text-gold">Gateway</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase italic">Level 4 Settlement Authorization / Manual Verification Matrix</p>
            </div>

            <div className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <AdminPaymentsTable initialPayments={pendingPayments} />
            </div>
        </div>
    );
}
