import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { z } from "zod";

const submissionSchema = z.object({
    transactionId: z.string().min(8, "Transaction ID must be at least 8 characters"),
    notes: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "PENDING_VENDOR") {
            return NextResponse.json({ error: "Forbidden: Only pending vendors can submit activation requests" }, { status: 403 });
        }

        const body = await req.json();
        const { transactionId, notes } = submissionSchema.parse(body);

        // Check for duplicate transaction ID in setup requests
        const existingTxn = await adminDb
            .collection("vendor_setup_requests")
            .where("transactionId", "==", transactionId)
            .get();

        if (!existingTxn.empty) {
            return NextResponse.json({ error: "This Transaction ID has already been submitted." }, { status: 400 });
        }

        // Create the setup request
        await adminDb.collection("vendor_setup_requests").add({
            vendorId: session.user.id,
            vendorEmail: session.user.email,
            transactionId,
            notes: notes || null,
            status: "pending",
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, message: "Activation request submitted." });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error("Vendor Setup Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
