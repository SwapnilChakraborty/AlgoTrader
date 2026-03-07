"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const indicatorSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    scriptId: z.string().min(1, "TradingView Script ID is required"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
});

export async function createIndicator(prevState: any, formData: FormData) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { error: "You must be logged in." };
        }

        // Check if user is vendor
        const userDoc = await adminDb.collection("users").doc(session.user.id).get();
        if (!userDoc.exists || userDoc.data()?.role !== "VENDOR") {
            // If not explicitly finding vendor role locally in demo, fallback to checking session role.
            if (session.user.role !== "VENDOR") {
                return { error: "You must be a Vendor to create indicators." };
            }
        }

        const rawData = {
            name: formData.get("name"),
            description: formData.get("description"),
            scriptId: formData.get("scriptId"),
            price: formData.get("price"),
        };

        const validatedData = indicatorSchema.parse(rawData);

        const newIndicator = {
            vendorId: session.user.id,
            name: validatedData.name,
            description: validatedData.description || "",
            scriptId: validatedData.scriptId,
            price: validatedData.price,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await adminDb.collection("indicators").add(newIndicator);

        revalidatePath("/vendor/indicators");

        return { success: true };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }
        console.error("Failed to create indicator:", error);
        return { error: "Failed to create indicator. Please try again later." };
    }
}

export async function getIndicatorById(id: string) {
    try {
        const doc = await adminDb.collection("indicators").doc(id).get();
        if (!doc.exists) return null;

        return {
            id: doc.id,
            ...doc.data()
        } as { id: string; name: string; price: number; description?: string; scriptId?: string; vendorId?: string };
    } catch (error) {
        console.error("Error fetching indicator:", error);
        return null;
    }
}
