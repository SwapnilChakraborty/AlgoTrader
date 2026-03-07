import { adminDb } from "../src/lib/firebase/admin";
import bcrypt from "bcrypt";

async function createDemoVendor() {
    console.log("Creating demo vendor account...");

    const email = "vendor@demo.com";
    const password = "password123";

    try {
        // Check if user already exists
        const existingSnapshot = await adminDb
            .collection("users")
            .where("email", "==", email)
            .get();

        if (!existingSnapshot.empty) {
            console.log("Demo vendor account already exists!");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const userRef = adminDb.collection("users").doc();
        await userRef.set({
            email,
            passwordHash,
            role: "VENDOR",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("✅ Demo vendor account created successfully!");
        console.log("-----------------------------------------");
        console.log(`Login Email: ${email}`);
        console.log(`Password:    ${password}`);
        console.log("-----------------------------------------");
        console.log("You can now login at http://localhost:3000/login using these credentials.");
    } catch (error) {
        console.error("❌ Failed to create demo vendor:", error);
    } finally {
        process.exit(0);
    }
}

createDemoVendor();
