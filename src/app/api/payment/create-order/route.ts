import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { indicatorId } = body;

        if (!indicatorId) {
            return NextResponse.json({ error: "Missing indicatorId" }, { status: 400 });
        }

        // Razorpay disabled for manual UPI mode
        // Will re-enable when automated payments are needed
        return NextResponse.json({ error: "Automated payments are currently disabled. Please use manual UPI payment mode." }, { status: 400 });

        /*
        const buyerId = session.user.id;

        // 1. Fetch indicator details from Firebase
        const indicatorDoc = await adminDb.collection("indicators").doc(indicatorId).get();
        if (!indicatorDoc.exists) {
            return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
        }

        const indicator = indicatorDoc.data()!;
        const priceInUsd = indicator.price || 0;
        const sellerId = indicator.vendorId; // Ensure your schema uses this key

        // IMPORTANT: Razorpay expects amounts in the smallest currency unit (e.g., paise for INR, cents for USD)
        // If your platform operates in USD, we multiply by 100.
        const amountInCents = Math.round(priceInUsd * 100);

        if (amountInCents <= 0) {
            return NextResponse.json({ error: "Invalid price" }, { status: 400 });
        }

        // 2. Fetch the seller's Razorpay Account ID
        const sellerDoc = await adminDb.collection("users").doc(sellerId).get();
        const sellerData = sellerDoc.exists ? sellerDoc.data() : null;
        const sellerRazorpayAccId = sellerData?.razorpayAccountId;

        if (!sellerRazorpayAccId) {
            console.warn(`Seller ${sellerId} has no linked Razorpay account. Payment cannot be routed.`);
            return NextResponse.json({ error: "Vendor cannot accept payments right now." }, { status: 400 });
        }

        // 3. Calculate Platform Commission
        // Example: 20% platform fee, 80% to seller. 
        // Pull commissionPercent from indicator or use default.
        const commissionPercent = indicator.commissionPercent || 20;
        const platformFeeInCents = Math.round((amountInCents * commissionPercent) / 100);
        const sellerAmountInCents = amountInCents - platformFeeInCents;

        // 4. Initialize Razorpay Instance
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!
        });

        // 5. Create Order with Transfers (Razorpay Route)
        const orderOptions = {
            amount: amountInCents,
            currency: "USD",
            receipt: `rcpt_${Date.now()}_${buyerId.substring(0, 5)}`,
            notes: {
                buyerId: buyerId,
                indicatorId: indicatorId,
                sellerId: sellerId
            },
            transfers: [
                {
                    account: sellerRazorpayAccId,
                    amount: sellerAmountInCents,
                    currency: "USD",
                    notes: {
                        sale_for: indicatorId
                    },
                    linked_account_notes: ["sale_for"],
                    on_hold: 0 // process immediately to their account
                }
            ]
        };

        const order = await rzp.orders.create(orderOptions);

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
        */

    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
