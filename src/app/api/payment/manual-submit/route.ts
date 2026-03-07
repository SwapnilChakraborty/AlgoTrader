import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { z } from "zod";

const manualSubmitSchema = z.object({
    indicatorId: z.string().min(1, "Indicator ID is required"),
    transactionId: z.string().min(8, "Transaction ID must be at least 8 characters"),
    screenshotUrl: z.string().optional(),
    tradingviewUsername: z.string().min(1, "TradingView Username is required"),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = manualSubmitSchema.parse(body);
        const { indicatorId, transactionId, screenshotUrl, tradingviewUsername } = validatedData;
        const buyerId = session.user.id;

        // Fetch indicator details
        const indicatorDoc = await adminDb.collection("indicators").doc(indicatorId).get();
        if (!indicatorDoc.exists) {
            return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
        }
        const indicatorData = indicatorDoc.data();
        const amount = indicatorData?.price || 0;

        // Check for duplicate transaction ID
        const existingTxn = await adminDb
            .collection("manual_payments")
            .where("transactionId", "==", transactionId)
            .get();

        if (!existingTxn.empty) {
            return NextResponse.json({ error: "This Transaction ID has already been submitted." }, { status: 400 });
        }

        // Insert manual payment record
        const paymentRef = await adminDb.collection("manual_payments").add({
            buyerId,
            indicatorId,
            transactionId,
            screenshotUrl: screenshotUrl || null,
            amount,
            status: "pending",
            createdAt: new Date(),
        });

        // Save TradingView username to user doc
        await adminDb.collection("users").doc(buyerId).set({ tradingviewUsername }, { merge: true });

        return NextResponse.json({ success: true, paymentId: paymentRef.id, message: "Payment request submitted." });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error("Manual Payment Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
