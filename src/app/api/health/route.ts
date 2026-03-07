import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // 1. Check DB
        const dbCheck = await adminDb.collection("users").limit(1).get();

        // 2. Check Worker Activity (Last job processed)
        const lastJob = await adminDb.collection("jobs")
            .orderBy("updatedAt", "desc")
            .limit(1)
            .get();

        const lastJobTime = lastJob.docs[0]?.data()?.updatedAt?.toDate();
        const workerStatus = lastJobTime && (Date.now() - lastJobTime.getTime() < 1000 * 60 * 60)
            ? "ACTIVE"
            : "IDLE_OR_STALLED";

        return NextResponse.json({
            status: "OPERATIONAL",
            database: dbCheck.size >= 0 ? "CONNECTED" : "ERROR",
            worker: {
                status: workerStatus,
                lastSeen: lastJobTime || "NEVER"
            },
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "DEGRADED",
            error: error.message
        }, { status: 500 });
    }
}
