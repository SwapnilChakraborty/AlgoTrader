import cron from "node-cron";
import { adminDb } from "./lib/firebase/admin";
import puppeteer, { Browser, Page, BrowserContext } from "puppeteer";
import { decrypt } from "./lib/crypto";
import os from "os";
import crypto from "crypto";

// Configuration
const CONCURRENCY_LIMIT = 3; // Number of parallel tasks per worker
const WORKER_ID = `${os.hostname()}-${crypto.randomBytes(4).toString('hex')}`;
const POLLING_INTERVAL = "*/15 * * * * *"; // Every 15 seconds

// Global browser instance
let browser: Browser | null = null;
let isInitializing = false;
let activeTasks = 0;

// 1. Initialize the persistent browser instance
async function initBrowser() {
    if (browser || isInitializing) return;
    isInitializing = true;

    console.log(`[${new Date().toISOString()}] [Worker ${WORKER_ID}] Initializing persistent browser...`);
    try {
        browser = await puppeteer.launch({
            headless: true, // Use "new" for production or true for simple
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        browser.on('disconnected', () => {
            console.error(`[${new Date().toISOString()}] [Worker ${WORKER_ID}] Browser disconnected. Resetting...`);
            browser = null;
        });

        console.log(`[${new Date().toISOString()}] [Worker ${WORKER_ID}] Browser READY.`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [Worker ${WORKER_ID}] Failed to launch browser:`, error);
        browser = null;
    } finally {
        isInitializing = false;
    }
}

async function ensureBrowser() {
    if (!browser) await initBrowser();
    if (!browser) throw new Error("Infrastructure Unavailable (Browser)");
    return browser;
}

// 2. Session Management (Cookie Vault)
async function loadVendorSession(vendorId: string, context: BrowserContext) {
    const sessionDoc = await adminDb.collection("vendor_sessions").doc(vendorId).get();
    if (sessionDoc.exists) {
        const cookies = sessionDoc.data()?.cookies;
        if (cookies && Array.isArray(cookies)) {
            console.log(`[Session] Restoring cookies for Vendor ${vendorId}`);
            await (context as any).setCookies(...cookies);
            return true;
        }
    }
    return false;
}

async function saveVendorSession(vendorId: string, page: Page) {
    const cookies = await page.cookies();
    console.log(`[Session] Saving ${cookies.length} cookies for Vendor ${vendorId}`);
    await adminDb.collection("vendor_sessions").doc(vendorId).set({
        cookies,
        updatedAt: new Date()
    }, { merge: true });
}

// 3. Authentication Layer
async function ensureAuthenticated(page: Page, vendorEmail: string, vendorPassword: string, vendorId: string) {
    console.log(`[TV-Auth] Checking state for ${vendorEmail}...`);
    
    await page.goto("https://www.tradingview.com/", { waitUntil: "networkidle2" });
    const loginButtonSelector = 'a[href*="/accounts/signin/"]';
    
    try {
        const loginBtn = await page.$(loginButtonSelector);
        if (!loginBtn) {
            console.log(`[TV-Auth] Session valid for ${vendorEmail}.`);
            return;
        }
    } catch (e) {
        console.log(`[TV-Auth] Login button not found. Assuming authenticated.`);
        return;
    }

    // Perform Login
    console.log(`[TV-Auth] Performing fresh login for ${vendorEmail}...`);
    await page.goto("https://www.tradingview.com/accounts/signin/", { waitUntil: "networkidle2" });

    try {
        const emailButtonSelector = '.js-show-email';
        await page.waitForSelector(emailButtonSelector, { timeout: 3000 });
        await page.click(emailButtonSelector);
    } catch (e) {}

    await page.waitForSelector('input[name="id_userLogin"]');
    await page.type('input[name="id_userLogin"]', vendorEmail, { delay: 50 });
    await page.type('input[name="password"]', vendorPassword, { delay: 50 });

    await Promise.all([
        page.click('.tv-button__loader'),
        page.waitForNavigation({ waitUntil: "networkidle2" })
    ]);

    // Save session after successful login
    await saveVendorSession(vendorId, page);
    console.log(`[TV-Auth] Login successful and session persisted for ${vendorId}`);
}

// 4. Core Task Execution
async function grantIndicatorAccess(job: any) {
    const activeBrowser = await ensureBrowser();
    activeTasks++;
    
    // Create Isolated Context (Incognito)
    const context = await activeBrowser.createBrowserContext();
    const page = await context.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    try {
        // Resolve IDs
        const buyerDoc = await adminDb.collection("users").doc(job.userId).get();
        const buyerData = buyerDoc.data();
        const tradingviewUsername = buyerData?.tradingviewUsername;

        const indicatorDoc = await adminDb.collection("indicators").doc(job.indicatorId).get();
        const indicatorData = indicatorDoc.data();
        const vendorId = indicatorData?.vendorId || indicatorData?.sellerId;

        const vendorDoc = await adminDb.collection("users").doc(vendorId).get();
        const vendorData = vendorDoc.data();
        const vendorEmail = vendorData?.tradingviewEmail;
        const vendorPassword = decrypt(vendorData?.tradingviewPassword);

        if (!tradingviewUsername || !vendorEmail || !vendorPassword) {
            throw new Error("Incomplete credentials for automation.");
        }

        // Apply Session Persistence
        await loadVendorSession(vendorId, context);

        // Authenticate
        await ensureAuthenticated(page, vendorEmail, vendorPassword, vendorId);

        // Grant Access
        console.log(`[Worker] Navigating to script ${job.indicatorId}...`);
        await page.goto(`https://www.tradingview.com/script/${job.indicatorId}/`, { waitUntil: "networkidle2" });

        const manageAccessSelector = '[data-name="manage-access"]';
        await page.waitForSelector(manageAccessSelector, { timeout: 15000 });
        await page.click(manageAccessSelector);

        const addUserInputSelector = 'input[placeholder="Enter username"]';
        await page.waitForSelector(addUserInputSelector, { timeout: 5000 });
        await page.type(addUserInputSelector, tradingviewUsername);
        
        await new Promise(r => setTimeout(r, 1000));
        await page.click('[data-name="add-access"]');
        await new Promise(res => setTimeout(res, 2500));

        // Mark Success
        await adminDb.collection("jobs").doc(job.id).update({
            status: "completed",
            updatedAt: new Date()
        });

        // Update Subscription
        const subsSnapshot = await adminDb.collection("subscriptions")
            .where("userId", "==", job.userId)
            .where("indicatorId", "==", job.indicatorId)
            .where("status", "==", "active")
            .get();

        if (!subsSnapshot.empty) {
            await subsSnapshot.docs[0].ref.update({
                accessStatus: "granted",
                updatedAt: new Date()
            });
        }

        console.log(`[Worker] Job ${job.id} COMPLETED.`);
    } catch (error: any) {
        console.error(`[Worker] Job ${job.id} FAILED:`, error.message);
        const nextRetries = (job.retries || 0) + 1;
        await adminDb.collection("jobs").doc(job.id).update({
            status: nextRetries >= 3 ? "failed_permanently" : "failed",
            retries: nextRetries,
            errorMessage: error.message,
            updatedAt: new Date()
        });
    } finally {
        await context.close();
        activeTasks--;
    }
}

// 5. Polling & Horizontal Scaling (Atomic Locking)
async function poolJobs() {
    if (activeTasks >= CONCURRENCY_LIMIT) return;

    const availableSlots = CONCURRENCY_LIMIT - activeTasks;
    console.log(`[Poller] Active Tasks: ${activeTasks}/${CONCURRENCY_LIMIT}. Polling for ${availableSlots} jobs...`);

    const jobsSnapshot = await adminDb.collection("jobs")
        .where("status", "in", ["pending", "failed"])
        .orderBy("createdAt", "asc")
        .limit(availableSlots)
        .get();

    for (const doc of jobsSnapshot.docs) {
        const job = { id: doc.id, ...doc.data() as any };
        if (job.retries >= 3) continue;

        // Atomic Lock: Only process if we successfully update status to 'processing'
        const lockRef = adminDb.collection("jobs").doc(doc.id);
        
        try {
            await adminDb.runTransaction(async (t) => {
                const liveDoc = await t.get(lockRef);
                const currentStatus = liveDoc.data()?.status;
                
                if (currentStatus === "pending" || currentStatus === "failed") {
                    t.update(lockRef, {
                        status: "processing",
                        workerId: WORKER_ID,
                        updatedAt: new Date()
                    });
                } else {
                    throw new Error("Job already locked by another worker.");
                }
            });

            // Start processing if lock acquired
            grantIndicatorAccess(job).catch(err => {
                console.error(`[Fatal] Task unhandled error:`, err);
            });
        } catch (e: any) {
            console.log(`[Lock] Skipping job ${doc.id}: ${e.message}`);
        }
    }
}

// 6. Lifecycle
async function startup() {
    console.log(`[Worker ${WORKER_ID}] Starting in Production Mode...`);
    await initBrowser();
    cron.schedule(POLLING_INTERVAL, () => {
        poolJobs().catch(console.error);
    });
}

process.on('SIGINT', async () => {
    console.log("Shutting down...");
    if (browser) await browser.close();
    process.exit(0);
});

startup().catch(console.error);
