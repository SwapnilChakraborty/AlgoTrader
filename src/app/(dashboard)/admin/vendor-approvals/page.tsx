import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import AdminVendorApprovalsTable from "./AdminVendorApprovalsTable";
import { ShieldCheck, ShieldAlert, Cpu } from "lucide-react";

export default async function AdminVendorApprovalsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch pending vendor activation requests
    const snapshot = await adminDb
        .collection("vendor_setup_requests")
        .where("status", "==", "pending")
        .orderBy("createdAt", "desc")
        .get();

    const requests = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            vendorId: data.vendorId,
            vendorEmail: data.vendorEmail,
            transactionId: data.transactionId,
            notes: data.notes || null,
            status: data.status,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
    });

    return (
        <div className="p-8 md:p-12 space-y-12 max-w-[1600px] mx-auto min-h-screen pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-12">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                        <ShieldCheck className="w-3.5 h-3.5 fill-gold" />
                        <span>System Administration</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-widest uppercase italic leading-tight">
                        Vendor <span className="text-gold">Oversight</span>
                    </h1>
                    <p className="text-zinc-500 max-w-xl font-medium uppercase tracking-widest text-xs leading-relaxed">
                        Audit and authorize institutional access for new creators. Verify settlement signatures before propagating roles.
                    </p>
                </div>

                <div className="flex items-center gap-6 bg-zinc-950/40 p-6 rounded-3xl border border-zinc-900 backdrop-blur-sm self-start">
                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20">
                        <Cpu className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1">Queue Status</p>
                        <p className="text-white text-xl font-black uppercase tracking-widest italic">{requests.length} Pending</p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 rounded-[2.5rem] blur-2xl opacity-50"></div>
                <div className="relative bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
                    <AdminVendorApprovalsTable initialRequests={requests} />
                </div>
            </div>
        </div>
    );
}

