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

        // Update payment status to rejected
        await paymentRef.update({
            status: "rejected",
            updatedAt: new Date(),
            rejectedBy: session.user.id
        });

        return NextResponse.json({ success: true, message: "Payment rejected." });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        console.error("Payment Rejection Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
