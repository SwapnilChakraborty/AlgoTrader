import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role || "USER";

    return (
        <div className="flex bg-[var(--background)] min-h-screen">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
