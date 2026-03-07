import { adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { company, email, interest, scale, message } = data;

        if (!company || !email || !interest) {
            return NextResponse.json({ error: "Missing required identification vectors." }, { status: 400 });
        }

        // Add lead to Firestore
        const leadRef = await adminDb.collection("sales_leads").add({
            company,
            email,
            interest,
            scale: scale || "Undisclosed",
            message: message || "No additional intel.",
            status: "new",
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, leadId: leadRef.id });
    } catch (error: any) {
        console.error("Sales Lead Error:", error);
        return NextResponse.json({ error: "Failed to transmit lead data." }, { status: 500 });
    }
}
