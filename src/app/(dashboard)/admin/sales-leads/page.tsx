import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import { Globe, Mail, Building2, Users, Calendar, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function AdminSalesLeadsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const leadsSnap = await adminDb.collection("sales_leads").orderBy("createdAt", "desc").get();
    const leads = leadsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toLocaleDateString() || "Unknown"
    }));

    return (
        <div className="space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black text-white tracking-widest uppercase italic">
                    Alpha <span className="text-gold">Leads</span>
                </h1>
                <p className="text-sm text-zinc-500 mt-2 font-medium tracking-wide uppercase italic">Level 4 Strategic Business Development / Institutional Pipeline</p>
            </div>

            <div className="grid gap-6">
                {leads.length === 0 ? (
                    <div className="p-20 text-center border border-dashed border-zinc-800 rounded-[3rem] bg-zinc-950/20">
                        <Globe className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
                        <p className="text-zinc-600 font-black uppercase tracking-widest">No institutional inquiries detected in active tunnel.</p>
                    </div>
                ) : (
                    leads.map((lead: any) => (
                        <Card key={lead.id} className="bg-zinc-950/40 border-zinc-900 rounded-[2.5rem] overflow-hidden hover:border-gold/20 transition-all group">
                            <CardContent className="p-8 flex flex-col md:flex-row justify-between gap-8">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{lead.company}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold tracking-wider">{lead.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold tracking-wider">{lead.createdAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-zinc-400 text-sm font-medium leading-relaxed bg-black/40 p-6 rounded-2xl border border-zinc-900 italic">
                                        "{lead.message}"
                                    </p>
                                </div>

                                <div className="flex flex-col justify-between items-end gap-6 text-right min-w-[200px]">
                                    <div className="space-y-4 w-full">
                                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Interest Sector</p>
                                            <p className="text-xs font-black text-gold uppercase tracking-widest">{lead.interest}</p>
                                        </div>
                                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Target Scale</p>
                                            <p className="text-xs font-black text-white uppercase tracking-widest">{lead.scale}</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors group/btn">
                                        Initialize Outreach <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
