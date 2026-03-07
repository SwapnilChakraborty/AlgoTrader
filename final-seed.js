const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
}

const db = admin.firestore();

async function run() {
    try {
        console.log("--- SEEDING START ---");

        // 1. Ensure a Vendor exists
        let vendorId;
        const vendorSnap = await db.collection('users').where('role', '==', 'VENDOR').limit(1).get();
        if (vendorSnap.empty) {
            console.log("Creating demo vendor...");
            const newVendor = await db.collection('users').add({
                name: "Elite Creator",
                email: "vendor@demo.com",
                role: "VENDOR",
                upiId: "demo@upi",
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            vendorId = newVendor.id;
        } else {
            vendorId = vendorSnap.docs[0].id;
        }
        console.log("Vendor ID:", vendorId);

        // 2. Ensure the Dummy Indicator exists
        let indicatorId;
        const indSnap = await db.collection('indicators').where('name', '==', 'Demo Dummy Script').get();
        if (indSnap.empty) {
            console.log("Creating Demo Dummy Script...");
            const newInd = await db.collection('indicators').add({
                name: "Demo Dummy Script",
                description: "An institutional-grade algorithmic vector designed for testing the complete end-to-end payment and authorization flow.",
                price: 5,
                scriptId: "TEST_SCRIPT_ID",
                vendorId: vendorId,
                isLive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            indicatorId = newInd.id;
        } else {
            indicatorId = indSnap.docs[0].id;
            console.log("Indicator already exists.");
        }
        console.log("Indicator ID:", indicatorId);

        // 3. Ensure the Trader has a subscription
        const userSnap = await db.collection('users').where('email', '==', 'trader@demo.com').get();
        if (userSnap.empty) {
            console.log("Trader account not found. Please log in as trader@demo.com first to create record.");
        } else {
            const userId = userSnap.docs[0].id;
            console.log("Trader ID:", userId);

            const subsSnap = await db.collection('subscriptions')
                .where('userId', '==', userId)
                .where('indicatorId', '==', indicatorId)
                .get();

            if (subsSnap.empty) {
                console.log("Creating pending subscription for trader...");
                await db.collection('subscriptions').add({
                    userId,
                    indicatorId,
                    status: "pending",
                    accessStatus: "pending",
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log("✅ Subscription created!");
            } else {
                console.log("Trader already has this subscription.");
            }
        }

        console.log("--- SEEDING COMPLETE ---");
    } catch (e) {
        console.error("Error during seeding:", e);
    } finally {
        process.exit();
    }
}

run();
