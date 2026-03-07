import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import bcrypt from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["USER", "VENDOR"]).default("USER"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role } = registerSchema.parse(body);

        const existingUserSnapshot = await adminDb
            .collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();

        if (!existingUserSnapshot.empty) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const assignedRole = role === "VENDOR" ? "PENDING_VENDOR" : "USER";

        const userRef = adminDb.collection("users").doc();
        await userRef.set({
            email,
            passwordHash,
            role: assignedRole as "USER" | "VENDOR" | "PENDING_VENDOR",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: userRef.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
