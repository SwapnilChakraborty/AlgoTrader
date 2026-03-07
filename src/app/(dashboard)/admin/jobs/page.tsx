import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import AdminJobsTable from "./AdminJobsTable";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch recent jobs (last 50)
    const jobsSnapshot = await adminDb
        .collection("jobs")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

    const jobs = jobsSnapshot.docs.map(doc => {
        const data = doc.data();
        let payload = {};
        try {
            payload = JSON.parse(data.payload || "{}");
        } catch (e) { }

        return {
            id: doc.id,
            type: data.type,
            status: data.status,
            retries: data.retries,
            error: data.lastError,
            payload,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Automation Job Monitor</h1>
            <p className="text-zinc-400 mb-8 w-full">Track and manage background TradingView access grant jobs.</p>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                <AdminJobsTable initialJobs={jobs} />
            </div>
        </div>
    );
}
