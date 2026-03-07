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
        console.log("--- DIAGNOSTIC START ---");
        const userSnap = await db.collection('users').where('email', '==', 'trader@demo.com').get();
        if (userSnap.empty) {
            console.log("trader@demo.com NOT FOUND");
        } else {
            const user = userSnap.docs[0];
            console.log("TRADER_EMAIL:", user.data().email);
            console.log("TRADER_DOC_ID:", user.id);

            const subsSnap = await db.collection('subscriptions').where('userId', '==', user.id).get();
            console.log("SUBSCRIPTIONS_FOUND:", subsSnap.size);
            subsSnap.forEach(d => {
                console.log("- SUB_ID:", d.id);
                console.log("  DATA:", JSON.stringify(d.data()));
            });

            // Also check if any subscription exists with 'buyerId' instead of 'userId'
            const subsSnap2 = await db.collection('subscriptions').where('buyerId', '==', user.id).get();
            if (subsSnap2.size > 0) {
                console.log("SUBSCRIPTIONS_FOUND_BY_BUYER_ID:", subsSnap2.size);
            }
        }
        console.log("--- DIAGNOSTIC END ---");
    } catch (e) {
        console.error("DIAGNOSTIC ERROR:", e);
    } finally {
        process.exit();
    }
}

run();
