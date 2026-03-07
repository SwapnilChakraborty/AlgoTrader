import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { z } from "zod";

const approveSchema = z.object({
    requestId: z.string().min(1),
    vendorId: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { requestId, vendorId } = approveSchema.parse(body);

        // Use a transaction to ensure atomic update
        await adminDb.runTransaction(async (transaction) => {
            const requestRef = adminDb.collection("vendor_setup_requests").doc(requestId);
            const userRef = adminDb.collection("users").doc(vendorId);

            const requestDoc = await transaction.get(requestRef);
            if (!requestDoc.exists || requestDoc.data()?.status !== "pending") {
                throw new Error("Request not found or already processed");
            }

            // 1. Update request status
            transaction.update(requestRef, {
                status: "approved",
                approvedAt: new Date(),
                approvedBy: session.user.id
            });

            // 2. Upgrade user role to VENDOR
            transaction.update(userRef, {
                role: "VENDOR",
                roleUpdatedAt: new Date()
            });
        });

        return NextResponse.json({ success: true, message: "Vendor approved and activated." });

    } catch (error: any) {
        console.error("Vendor Approval Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
