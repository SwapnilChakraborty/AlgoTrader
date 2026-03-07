import { adminDb } from "@/lib/firebase/admin";
import { AlertTriangle, CheckCircle, RefreshCcw, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
    const jobsSnapshot = await adminDb.collection("jobs")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

    const jobs = jobsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            type: data.type,
            payload: JSON.parse(data.payload || "{}"),
            status: data.status,
            retries: data.retries,
            createdAt: data.createdAt?.toDate() || new Date()
        };
    });

    return (
        <div className="space-y-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Logs & Automation</h1>
                    <p className="text-sm text-slate-500">Real-time status of TradingView API background jobs</p>
                </div>
                <button className="btn-secondary flex items-center gap-2 text-sm">
                    <RefreshCcw className="w-4 h-4" /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass p-5 rounded-xl border border-indigo-500/20">
                    <h4 className="text-slate-500 text-sm font-medium mb-1">Pending Jobs</h4>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {jobs.filter(j => j.status === 'PENDING').length}
                    </div>
                </div>
                <div className="glass p-5 rounded-xl border border-teal-500/20">
                    <h4 className="text-slate-500 text-sm font-medium mb-1">Completed (24h)</h4>
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        {jobs.filter(j => j.status === 'COMPLETED').length}
                    </div>
                </div>
                <div className="glass p-5 rounded-xl border border-red-500/20">
                    <h4 className="text-slate-500 text-sm font-medium mb-1">Failed Jobs</h4>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {jobs.filter(j => j.status === 'FAILED').length}
                    </div>
                </div>
                <div className="glass p-5 rounded-xl border border-[var(--color-border)]">
                    <h4 className="text-slate-500 text-sm font-medium mb-1">Avg Process Time</h4>
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">~1.2s</div>
                </div>
            </div>

            <div className="glass rounded-xl border border-[var(--color-border)] overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--color-border)]">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500">Job ID</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Type</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Payload</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Retries</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-slate-700 dark:text-slate-300">
                        {jobs.map(job => (
                            <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">{job.id.substring(0, 8)}...</td>
                                <td className="px-6 py-4 font-medium">{job.type}</td>
                                <td className="px-6 py-4 font-mono text-xs max-w-xs truncate">
                                    {JSON.stringify(job.payload)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${job.status === 'COMPLETED' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' :
                                        job.status === 'FAILED' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                            'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                        }`}>
                                        {job.status === 'COMPLETED' && <CheckCircle className="w-3.5 h-3.5" />}
                                        {job.status === 'FAILED' && <AlertTriangle className="w-3.5 h-3.5" />}
                                        {(job.status === 'PENDING' || job.status === 'PROCESSING') && <Clock className="w-3.5 h-3.5" />}
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{job.retries}</td>
                                <td className="px-6 py-4 text-slate-500">{new Date(job.createdAt).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No background jobs recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
