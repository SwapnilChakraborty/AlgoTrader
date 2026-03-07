import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { z } from "zod";

const schema = z.object({
    paymentId: z.string().min(1, "Payment ID is required"),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { paymentId } = schema.parse(body);

        // Fetch the payment
        const paymentRef = adminDb.collection("manual_payments").doc(paymentId);
        const paymentDoc = await paymentRef.get();

        if (!paymentDoc.exists) {
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        const paymentData = paymentDoc.data()!;

        if (paymentData.status !== "pending") {
            return NextResponse.json({ error: "Payment is not in pending state" }, { status: 400 });
        }

        // Fetch indicator to get the vendor/seller ID
        const indicatorDoc = await adminDb.collection("indicators").doc(paymentData.indicatorId).get();
        if (!indicatorDoc.exists) {
            return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
        }
        const indicatorData = indicatorDoc.data()!;
        const vendorId = indicatorData.vendorId || indicatorData.sellerId || "unknown";

        // Prevent duplicate subscriptions
        const existingSubs = await adminDb.collection("subscriptions")
            .where("userId", "==", paymentData.buyerId)
            .where("indicatorId", "==", paymentData.indicatorId)
            .where("status", "==", "active")
            .get();

        if (!existingSubs.empty) {
            return NextResponse.json({ error: "User already has an active subscription for this indicator" }, { status: 400 });
        }

        const batch = adminDb.batch();

        // 1. Update payment status to approved
        batch.update(paymentRef, {
            status: "approved",
            updatedAt: new Date(),
            approvedBy: session.user.id
        });

        // 2. Create subscription
        const subscriptionRef = adminDb.collection("subscriptions").doc();
        batch.set(subscriptionRef, {
            userId: paymentData.buyerId, // use userId for consistency with dashboard
            buyerId: paymentData.buyerId,
            indicatorId: paymentData.indicatorId,
            vendorId: vendorId,
            status: "active",
            accessStatus: "pending", // TradingView access status
            activatedAt: new Date(),
            paymentId: paymentId
        });

        // 3. Create job for automation worker
        const jobRef = adminDb.collection("jobs").doc();
        batch.set(jobRef, {
            type: "GRANT_ACCESS",
            userId: paymentData.buyerId,
            indicatorId: paymentData.indicatorId,
            status: "PENDING",
            retries: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await batch.commit();

        return NextResponse.json({ success: true, message: "Payment approved and subscription activated." });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error("Payment Approval Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
