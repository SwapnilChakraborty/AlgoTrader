import { adminDb } from "./src/lib/firebase/admin";

async function checkAndFix() {
    try {
        console.log("Checking trader account...");
        const userSnap = await adminDb.collection("users").where("email", "==", "trader@demo.com").get();
        if (userSnap.empty) {
            console.log("Trader demo account not found");
            process.exit();
        }
        const userId = userSnap.docs[0].id;
        console.log("Trader User ID:", userId);

        const indSnap = await adminDb.collection("indicators").where("name", "==", "Demo Dummy Script").get();
        let indicatorId;
        if (indSnap.empty) {
            console.log("Demo Dummy Script not found. Creating it...");
            const newInd = await adminDb.collection("indicators").add({
                name: "Demo Dummy Script",
                description: "An institutional-grade algorithmic vector designed for testing the complete end-to-end payment and authorization flow.",
                price: 5,
                scriptId: "TEST_SCRIPT_ID",
                vendorId: "demo-vendor",
                isLive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            indicatorId = newInd.id;
        } else {
            indicatorId = indSnap.docs[0].id;
        }
        console.log("Indicator ID:", indicatorId);

        const subsSnap = await adminDb.collection("subscriptions")
            .where("userId", "==", userId)
            .where("indicatorId", "==", indicatorId)
            .get();

        if (subsSnap.empty) {
            console.log("No subscription found. Adding pending subscription...");
            await adminDb.collection("subscriptions").add({
                userId,
                indicatorId,
                status: "pending",
                accessStatus: "pending",
                createdAt: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            console.log("✅ Pending subscription added successfully!");
        } else {
            console.log("Subscription already exists with ID:", subsSnap.docs[0].id);
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit();
    }
}

checkAndFix();
