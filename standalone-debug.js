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
        console.log("Searching for user: trader@demo.com");
        const userSnap = await db.collection('users').where('email', '==', 'trader@demo.com').get();
        if (userSnap.empty) {
            console.log("User not found");
        } else {
            const user = userSnap.docs[0];
            console.log("User ID:", user.id);
            console.log("User Data:", JSON.stringify(user.data()));

            console.log("Searching for subscriptions...");
            const subsSnap = await db.collection('subscriptions').where('userId', '==', user.id).get();
            console.log("Subscriptions count:", subsSnap.size);
            subsSnap.forEach(d => console.log("Sub ID:", d.id, JSON.stringify(d.data())));

            console.log("Searching for indicators...");
            const indSnap = await db.collection('indicators').get();
            console.log("Indicators count:", indSnap.size);
            indSnap.forEach(d => console.log("Ind ID:", d.id, d.data().name));
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit();
    }
}

run();
