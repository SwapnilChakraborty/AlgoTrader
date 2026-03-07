"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/lib/crypto";

const vendorSettingsSchema = z.object({
    tradingviewEmail: z.string().email("Invalid email address"),
    tradingviewPassword: z.string().min(1, "Password is required"),
    upiId: z.string().min(3, "UPI ID is required").refine(val => val.includes('@'), "Invalid UPI ID format (missing @)"),
});

export async function updateVendorSettings(prevState: any, formData: FormData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { error: "You must be logged in." };
        }

        const userDoc = await adminDb.collection("users").doc(session.user.id).get();
        if (!userDoc.exists || userDoc.data()?.role !== "VENDOR") {
            if (session.user.role !== "VENDOR") {
                return { error: "Only vendors can update these settings." };
            }
        }

        const rawData = {
            tradingviewEmail: formData.get("tradingviewEmail"),
            tradingviewPassword: formData.get("tradingviewPassword"),
            upiId: formData.get("upiId"),
        };

        const validatedData = vendorSettingsSchema.parse(rawData);

        // Save to vendor's user document
        await adminDb.collection("users").doc(session.user.id).set({
            tradingviewEmail: validatedData.tradingviewEmail,
            tradingviewPassword: encrypt(validatedData.tradingviewPassword),
            upiId: validatedData.upiId,
            updatedAt: new Date(),
        }, { merge: true });

        revalidatePath("/vendor/settings");

        return { success: true, message: "Settings saved successfully." };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }
        console.error("Failed to update vendor settings:", error);
        return { error: "Failed to save settings. Please try again later." };
    }
}
