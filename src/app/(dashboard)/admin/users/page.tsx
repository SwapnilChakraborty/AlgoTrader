import { adminDb } from "@/lib/firebase/admin";
import { Search, ShieldAlert, ShieldCheck, MoreVertical } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const usersSnapshot = await adminDb.collection("users")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

    const users = await Promise.all(usersSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        const tvAccountDoc = await adminDb.collection("tradingViewAccounts").doc(doc.id).get();
        const tradingViewAccount = tvAccountDoc.exists ? tvAccountDoc.data() : null;

        const subsSnapshot = await adminDb.collection("subscriptions")
            .where("userId", "==", doc.id)
            .where("status", "==", "active")
            .get();

        return {
            id: doc.id,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
            tradingViewAccount,
            _count: {
                subscriptions: subsSnapshot.size
            }
        };
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-sm text-slate-500">View and manage all platform users</p>
                </div>

                <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg px-3 py-2 border border-[var(--color-border)] focus-within:border-indigo-500 transition-colors shadow-sm">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search email or username..."
                        className="bg-transparent border-none outline-none text-sm w-64 text-slate-700 dark:text-slate-200"
                    />
                </div>
            </div>

            <div className="glass rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--color-border)]">
                            <tr>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">User Email</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">TradingView Username</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Role</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Active Subs</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Joined</th>
                                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)] text-slate-700 dark:text-slate-300">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {user.tradingViewAccount ? (
                                            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                                                {user.tradingViewAccount.tvUsername}
                                                {user.tradingViewAccount.verified && <ShieldCheck className="w-4 h-4 text-teal-500" />}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic">Unlinked</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                                            user.role === 'VENDOR' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400' :
                                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user._count.subscriptions}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            <MoreVertical className="w-5 h-5 ml-auto" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No users found in database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between text-sm text-slate-500">
                    <span>Showing 1 to {users.length} of {users.length} entries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-[var(--color-border)] rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-[var(--color-border)] rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
