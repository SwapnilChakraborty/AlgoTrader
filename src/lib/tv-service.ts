import { adminDb } from "@/lib/firebase/admin";

export async function grantIndicatorAccessAsync(scriptId: string, username: string, userId?: string) {
    const jobRef = await adminDb.collection("jobs").add({
        type: "GRANT_ACCESS",
        payload: JSON.stringify({ scriptId, username, userId }),
        status: "PENDING",
        retries: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return { id: jobRef.id };
}

export async function revokeIndicatorAccessAsync(scriptId: string, username: string, userId?: string) {
    // Enqueue a non-blocking job into the database
    const jobRef = await adminDb.collection("jobs").add({
        type: "REVOKE_ACCESS",
        payload: JSON.stringify({ scriptId, username, userId }),
        status: "PENDING",
        retries: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return { id: jobRef.id };
}
