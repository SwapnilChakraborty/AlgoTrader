import { adminDb } from "./src/lib/firebase/admin";

async function seed() {
    try {
        console.log("Seeding dummy indicator...");

        // Find a vendor to associate with
        const vendorsSnapshot = await adminDb.collection("users").where("role", "==", "VENDOR").limit(1).get();
        let vendorId = "demo-vendor";

        if (!vendorsSnapshot.empty) {
            vendorId = vendorsSnapshot.docs[0].id;
        } else {
            // Create a dummy vendor if none exists
            const newVendor = await adminDb.collection("users").add({
                name: "Elite Creator",
                email: "vendor@example.com",
                role: "VENDOR",
                upiId: "demo@upi",
                createdAt: new Date()
            });
            vendorId = newVendor.id;
        }

        const dummyIndicator = {
            name: "Demo Dummy Script",
            description: "An institutional-grade algorithmic vector designed for testing the complete end-to-end payment and authorization flow.",
            price: 5, // Low price for testing
            scriptId: "TEST_SCRIPT_ID",
            vendorId: vendorId,
            isLive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await adminDb.collection("indicators").add(dummyIndicator);
        console.log("Dummy indicator created with ID:", docRef.id);

        // Output for the agent to capture
        console.log(`DUMMY_INDICATOR_ID=${docRef.id}`);

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        process.exit();
    }
}

seed();
