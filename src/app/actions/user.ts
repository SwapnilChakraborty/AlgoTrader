"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const userSettingsSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    tradingviewUsername: z.string().min(2, "TradingView username is required for script access"),
});

export async function updateUserSettings(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const tradingviewUsername = formData.get("tradingviewUsername") as string;

    const validatedFields = userSettingsSchema.safeParse({
        name,
        tradingviewUsername,
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors.name?.[0] ||
                validatedFields.error.flatten().fieldErrors.tradingviewUsername?.[0] ||
                "Invalid input"
        };
    }

    try {
        await adminDb.collection("users").doc(session.user.id).update({
            name: validatedFields.data.name,
            tradingviewUsername: validatedFields.data.tradingviewUsername,
            updatedAt: new Date(),
        });

        revalidatePath("/(dashboard)/settings", "page");
        revalidatePath("/(dashboard)/user/dash", "page");

        return {
            success: true,
            message: "Profile updated successfully! Some changes may require a re-login to reflect in the sidebar."
        };
    } catch (error) {
        console.error("Error updating user settings:", error);
        return { error: "Failed to update settings. Please try again." };
    }
}
