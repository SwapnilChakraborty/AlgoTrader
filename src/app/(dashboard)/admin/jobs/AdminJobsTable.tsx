"use client";

import { useState } from "react";
import { RefreshCcw, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

export default function AdminJobsTable({ initialJobs }: { initialJobs: any[] }) {
    const [jobs, setJobs] = useState(initialJobs);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleRetry = async (jobId: string) => {
        setProcessingId(jobId);
        try {
            const res = await fetch("/api/admin/jobs/retry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId }),
            });

            if (!res.ok) throw new Error("Retry failed");

            // Update status locally
            setJobs(prev => prev.map(j =>
                j.id === jobId ? { ...j, status: "PENDING", retries: j.retries + 1 } : j
            ));
        } catch (error: any) {
            alert(error.message);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case "PENDING": return <Clock className="w-4 h-4 text-amber-500" />;
            case "FAILED": return <AlertCircle className="w-4 h-4 text-red-500" />;
            case "PROCESSING": return <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />;
            default: return null;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold border-b border-zinc-800">
                    <tr>
                        <th className="px-6 py-4">Job ID</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">User / Script</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Retries</th>
                        <th className="px-6 py-4">Last Updated</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-zinc-900/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs">{job.id.substring(0, 8)}...</td>
                            <td className="px-6 py-4 font-bold text-white text-xs">{job.type}</td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-zinc-300 font-medium">U: {(job.payload as any).username || "Unknown"}</span>
                                    <span className="text-zinc-500 text-[10px]">S: {(job.payload as any).scriptId || "N/A"}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(job.status)}
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${job.status === "COMPLETED" ? "text-emerald-500" :
                                            job.status === "FAILED" ? "text-red-500" : "text-zinc-400"
                                        }`}>
                                        {job.status}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono">{job.retries}</td>
                            <td className="px-6 py-4 text-xs">
                                {new Date(job.updatedAt).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {(job.status === "FAILED" || job.status === "COMPLETED") && (
                                    <button
                                        onClick={() => handleRetry(job.id)}
                                        disabled={processingId === job.id}
                                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 ml-auto disabled:opacity-50 transition-all font-black uppercase tracking-tighter text-[10px]"
                                    >
                                        {processingId === job.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                                        Force Retry
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {jobs.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-zinc-600 italic">No job activity recorded.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
