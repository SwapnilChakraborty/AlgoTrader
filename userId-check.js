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
        const email = 'trader@demo.com';
        const userSnap = await db.collection('users').where('email', '==', email).get();

        if (userSnap.empty) {
            console.log(`User ${email} not found.`);
            process.exit();
        }

        const userDoc = userSnap.docs[0];
        const userId = userDoc.id;
        console.log(`User ID for ${email}: [${userId}]`);

        const subsSnap = await db.collection('subscriptions').get();
        console.log(`Total subscriptions in DB: ${subsSnap.size}`);

        subsSnap.forEach(doc => {
            const data = doc.data();
            console.log(`- Sub ID: ${doc.id}, userId in sub: [${data.userId}], status: ${data.status}`);
            if (data.userId === userId) {
                console.log(`  MATCH FOUND!`);
            } else {
                console.log(`  MISMATCH: [${data.userId}] !== [${userId}]`);
            }
        });

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

run();
