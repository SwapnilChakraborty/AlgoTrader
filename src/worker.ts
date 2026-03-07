import cron from "node-cron";
import { adminDb } from "./lib/firebase/admin";
import puppeteer, { Browser, Page } from "puppeteer";
import { decrypt } from "./lib/crypto";

// Global browser instance
let browser: Browser | null = null;
let isInitializing = false;

// 1. Initialize the persistent browser instance
async function initBrowser() {
    if (browser || isInitializing) return;
    isInitializing = true;

    console.log(`[${new Date().toISOString()}] [Worker] Initializing persistent Puppeteer browser...`);
    try {
        browser = await puppeteer.launch({
            headless: true,
            userDataDir: "./puppeteer-session",
            slowMo: 50,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        // Handle unexpected browser disconnects
        browser.on('disconnected', () => {
            console.error(`[${new Date().toISOString()}] [Worker] Browser disconnected. Resetting instance...`);
            browser = null;
        });

        console.log(`[${new Date().toISOString()}] [Worker] Browser initialized successfully.`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [Worker] Failed to launch browser:`, error);
        browser = null;
    } finally {
        isInitializing = false;
    }
}

async function ensureBrowser() {
    if (!browser) {
        await initBrowser();
    }
    if (!browser) {
        throw new Error("Browser infrastructure is currently unavailable.");
    }
    return browser;
}

// 2. Helper to verify if we are logged in
async function ensureAuthenticated(page: Page, vendorEmail: string, vendorPassword: string) {
    console.log(`[TV-API] Checking authentication state...`);

    // Go to the main page to check state
    await page.goto("https://www.tradingview.com/", { waitUntil: "networkidle2" });

    // Check for login button. If it exists, we are not logged in.
    const loginButtonSelector = 'a[href*="/accounts/signin/"]';

    try {
        // We wait briefly for the login button. 
        // If it doesn't appear, we assume we're logged in 
        // (TradingView UI changes often, so we might want to check for a user avatar instead, but this is a solid fallback)
        const loginBtn = await page.$(loginButtonSelector);

        if (!loginBtn) {
            console.log(`[TV-API] Already authenticated for Vendor via persistent session.`);
            return;
        }

    } catch (e) {
        // Element not found - probably logged in
        console.log(`[TV-API] Login button not found. Assuming authenticated.`);
        return;
    }

    // 3. Perform manual login since session wasn't active
    console.log(`[TV-API] Not authenticated. Navigating to login page...`);
    await page.goto("https://www.tradingview.com/accounts/signin/", { waitUntil: "networkidle2" });

    // Click Email button if the social OAuth options appear
    try {
        const emailButtonSelector = '.js-show-email';
        await page.waitForSelector(emailButtonSelector, { timeout: 3000 });
        await page.click(emailButtonSelector);
    } catch (e) {
        // Ignored
    }

    console.log(`[TV-API] Logging in as Vendor...`);
    await page.waitForSelector('input[name="id_userLogin"]');

    // Use slowMo, but let's be extra safe and add a tiny explicit delay
    await new Promise(r => setTimeout(r, 500));
    await page.type('input[name="id_userLogin"]', vendorEmail);
    await page.type('input[name="password"]', vendorPassword);

    // Click submit
    await Promise.all([
        page.click('.tv-button__loader'),
        page.waitForNavigation({ waitUntil: "networkidle2" })
    ]);

    console.log(`[TV-API] Login successful for Vendor.`);
}

// 4. Core Logic to Grant Access safely
async function grantIndicatorAccess(scriptId: string, username: string, vendorEmail: string, vendorPasswordEncrypted: string) {
    const activeBrowser = await ensureBrowser();

    console.log(`[${new Date().toISOString()}] [TV-API] Processing access for script ${scriptId} to user ${username}...`);

    // Decrypt password only at the point of use
    const vendorPassword = decrypt(vendorPasswordEncrypted);

    // Open a new tab for this specific job
    const page = await activeBrowser.newPage();

    // Randomize user agent slightly to help with Cloudflare / TV blocks
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        // Check/Perform Login
        await ensureAuthenticated(page, vendorEmail, vendorPassword);

        // Navigate to the script's invite-only management page
        await page.goto(`https://www.tradingview.com/script/${scriptId}/`, { waitUntil: "networkidle2" });

        // Click the "Manage Access" button
        const manageAccessSelector = '[data-name="manage-access"]';
        await page.waitForSelector(manageAccessSelector, { timeout: 15000 });
        await page.click(manageAccessSelector);

        // Enter username and Add
        console.log(`[TV-API] Adding user ${username} to access list...`);
        const addUserInputSelector = 'input[placeholder="Enter username"]';
        await page.waitForSelector(addUserInputSelector, { timeout: 5000 });
        await page.type(addUserInputSelector, username);

        // Slow down before clicking add
        await new Promise(r => setTimeout(r, 1000));

        // Click Add button
        const addButtonSelector = '[data-name="add-access"]';
        await page.click(addButtonSelector);

        // Wait a bit for the UI to update and save over the network
        await new Promise(res => setTimeout(res, 2500));

        console.log(`[TV-API] Successfully granted access to ${username} for script ${scriptId}.`);
    } catch (error) {
        console.error(`[TV-API] Puppeteer automation failed for user ${username}:`, error);
        throw error;
    } finally {
        // ALWAYS close the tab to prevent memory leaks, but DO NOT close the browser
        await page.close();
    }
}

async function processPendingJobs() {
    console.log(`[${new Date().toISOString()}] [Worker] Polling for pending jobs...`);

    // Find jobs that are pending or failed
    const jobsSnapshot = await adminDb.collection("jobs")
        .where("status", "in", ["pending", "failed"])
        .orderBy("createdAt", "asc")
        .limit(10)
        .get();

    const jobs = jobsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as any }))
        .filter(job => job.retries < 3);

    if (jobs.length === 0) return;

    for (const job of jobs) {
        try {
            // Mark as processing
            await adminDb.collection("jobs").doc(job.id).update({
                status: "processing",
                updatedAt: new Date()
            });

            if (job.type === "GRANT_ACCESS") {
                // Get buyer info to find TradingView username
                const buyerDoc = await adminDb.collection("users").doc(job.userId).get();
                const buyerData = buyerDoc.data();
                const tradingviewUsername = buyerData?.tradingviewUsername;

                if (!tradingviewUsername) {
                    throw new Error("Buyer has no tradingviewUsername saved.");
                }

                // Get indicator to find vendor
                const indicatorDoc = await adminDb.collection("indicators").doc(job.indicatorId).get();
                const indicatorData = indicatorDoc.data();
                const vendorId = indicatorData?.vendorId || indicatorData?.sellerId;

                if (!vendorId) {
                    throw new Error("Indicator has no vendor associated.");
                }

                // Get vendor info to find TradingView credentials
                const vendorDoc = await adminDb.collection("users").doc(vendorId).get();
                const vendorData = vendorDoc.data();
                const vendorEmail = vendorData?.tradingviewEmail;
                const vendorPassword = vendorData?.tradingviewPassword;

                if (!vendorEmail || !vendorPassword) {
                    throw new Error("Vendor has not set up TradingView credentials.");
                }

                // Execute Puppeteer automation securely on a new tab
                await grantIndicatorAccess(job.indicatorId, tradingviewUsername, vendorEmail, vendorPassword);

                // Update the subscription to granted
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
            }

            // Mark job as completed
            await adminDb.collection("jobs").doc(job.id).update({
                status: "completed",
                updatedAt: new Date()
            });

        } catch (error: any) {
            console.error(`[Worker] Job ${job.id} failed:`, error.message);

            const nextRetries = (job.retries || 0) + 1;
            const finalStatus = nextRetries >= 3 ? "failed_permanently" : "failed";

            await adminDb.collection("jobs").doc(job.id).update({
                status: finalStatus,
                retries: nextRetries,
                errorMessage: error.message,
                updatedAt: new Date()
            });
        }
    }
}

// 5. Lifecycle Management
async function startup() {
    console.log("Starting DB Worker Process with node-cron...");
    // Cold start browser
    await initBrowser();

    // Run job queue every 30 seconds
    cron.schedule("*/30 * * * * *", () => {
        processPendingJobs().catch(console.error);
    });
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log("Received SIGINT. Closing browser...");
    if (browser) {
        await browser.close();
    }
    process.exit(0);
});

startup().catch(console.error);
