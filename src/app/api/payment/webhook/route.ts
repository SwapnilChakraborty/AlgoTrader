import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        // Razorpay disabled for manual UPI mode
        // Will re-enable when automated payments are needed
        return NextResponse.json({ error: "Automated payments disabled" }, { status: 400 });

        /*
        const payloadStr = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature || !payloadStr) {
            return NextResponse.json({ error: "Missing payload or signature" }, { status: 400 });
        }

        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error("Critical Error: Webhook secret is not configured.");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        // 1. Verify Signature
        // ... code commented ...

        return NextResponse.json({ status: "success", subscriptionId: docRef.id });
        */
    } catch (error: any) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
