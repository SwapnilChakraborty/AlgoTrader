import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || "local_secret";

// Helper to verify Razorpay webhook signature
function verifySignature(bodyStr: string, signature: string) {
    const expectedSignature = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(bodyStr)
        .digest("hex");
    return expectedSignature === signature;
}

export async function POST(req: Request) {
    try {
        // Razorpay disabled for manual UPI mode
        // Will re-enable when automated payments are needed
        return NextResponse.json({ error: "Automated payments disabled" }, { status: 400 });

        /*
        const bodyStr = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature || !verifySignature(bodyStr, signature)) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(bodyStr);
        // ... code commented ...

        return NextResponse.json({ received: true });
        */
    } catch (error) {
        console.error("[Webhook Error]:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
