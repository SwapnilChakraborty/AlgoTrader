# Deploying Puppeteer Worker to Railway

This guide explains how to host the **TradingView Automation Worker** on Railway while keeping your frontend on Vercel.

## 1. Why Railway?
Railway provides a persistent environment with proper specialized support for Puppeteer and Chromium, which Vercel's serverless functions lack.

---

## 2. Deployment Steps

### Step 1: Prepare the Repository
I have already added a `railway.json` file to your project. This tells Railway to:
1. Use the `Dockerfile`.
2. Target the `worker` stage (which contains all the Chromium dependencies).
3. Run the worker process persistently.

### Step 2: Create a Railway Project
1. Go to [Railway.app](https://railway.app) and click **"New Project"**.
2. Select **"Deploy from GitHub repo"** and choose this repository.
3. Click **"Deploy Now"**.

### Step 3: Configure Environment Variables
In the Railway Dashboard, go to your service's **Variables** tab and add the same keys from your `.env`:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ENCRYPTION_KEY` (32 characters)

### Step 4: Verify Deployment
1. Go to the **Logs** tab in Railway.
2. You should see: `[Worker] Initializing persistent Puppeteer browser...` followed by `[Worker] Browser initialized successfully.`
3. The worker will now automatically poll your Firebase for new indicator access requests every 30 seconds.

---

## 3. How it Works together
1. **User Buys Indicator**: Vercel API creates a "job" in your Firestore.
2. **Railway Worker Sees Job**: The worker running on Railway detects the job.
3. **Puppeteer Automation**: The worker logs into TradingView, grants access, and updates the task as "completed".
4. **Vercel Frontend Updates**: Your users see the status change to "Active" on the website.

---

## 4. Troubleshooting
- **Memory Limit**: Puppeteer can be memory-intensive. If the worker crashes, ensure the Railway service has at least **1GB of RAM** (default is usually enough for 1-2 concurrent tabs).
- **Environment Variables**: If the worker says "Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", check that your `FIREBASE_PRIVATE_KEY` includes the `\n` characters correctly.
