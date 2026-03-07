import { adminDb } from "../src/lib/firebase/admin";
import bcrypt from "bcrypt";

async function createDemoTrader() {
    console.log("Creating demo trader account...");

    const email = "trader@demo.com";
    const password = "password123";

    try {
        const existingSnapshot = await adminDb
            .collection("users")
            .where("email", "==", email)
            .get();

        if (!existingSnapshot.empty) {
            console.log("Demo trader account already exists!");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const userRef = adminDb.collection("users").doc();
        await userRef.set({
            email,
            passwordHash,
            role: "USER",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("✅ Demo trader account created successfully!");
        console.log("-----------------------------------------");
        console.log(`Login Email: ${email}`);
        console.log(`Password:    ${password}`);
        console.log("-----------------------------------------");
    } catch (error) {
        console.error("❌ Failed to create demo trader:", error);
    } finally {
        process.exit(0);
    }
}

createDemoTrader();
