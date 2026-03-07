import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardRedirect() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    // Role-based routing
    if (session.user.role === "ADMIN") {
        redirect("/admin/dash");
    } else if (session.user.role === "VENDOR") {
        redirect("/vendor/indicators");
    } else if (session.user.role === "PENDING_VENDOR") {
        redirect("/vendor/setup");
    } else {
        redirect("/user/dash"); // Normal user/trader route
    }
}
