import * as dotenv from "dotenv";
dotenv.config();
import { adminDb } from "./src/lib/firebase/admin";
async function run() {
    try {
        console.log("Connecting to Firestore...");
        const s = await adminDb.collection("users").get();
        console.log("Users found:", s.size);
        s.forEach(d => console.log(d.id, d.data().email, d.data().role));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
