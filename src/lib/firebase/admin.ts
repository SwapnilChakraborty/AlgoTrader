import * as admin from "firebase-admin";

if (!admin.apps.length) {
    let credential;

    // Local dev: might use a service account JSON file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            credential = admin.credential.cert(serviceAccount);
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", e);
        }
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        // Vercel deployment: uses individual variables
        credential = admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        });
    } else {
        // Fallback default creds if running locally with ADC
        credential = admin.credential.applicationDefault();
    }

    try {
        admin.initializeApp({
            credential,
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    } catch (error) {
        // Fail silently or handle securely
    }
}

const adminDb = admin.firestore();

export { admin, adminDb };
