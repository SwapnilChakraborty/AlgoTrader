# Deploying to Vercel

Vercel is excellent for hosting the **Next.js frontend and APIs**. However, because this project includes a **Puppeteer Background Worker**, you cannot host everything on Vercel alone.

## 1. The Strategy
- **Vercel**: Hosts the website (`/register`, `/dashboard`, etc.) and the API routes.
- **Separate VPS / Railway / Render**: Hosts the `worker.ts` process. The worker will connect to the same Firebase database and handle TradingView automation.

---

## 2. Deploying the App to Vercel

### Step 1: Push to GitHub
If you haven't already:
```bash
git add .
git commit -m "Prepare for Vercel"
git push origin master
```

### Step 2: Connect to Vercel
1. Go to [Vercel](https://vercel.com) and click **"Add New" > "Project"**.
2. Import your GitHub repository.
3. **Environment Variables**: You must add all variables from your `.env` to the Vercel Dashboard (**Project Settings > Environment Variables**).

> [!IMPORTANT]
> For `FIREBASE_PRIVATE_KEY`, copy the exact string from your service account JSON. If it includes `\n`, Vercel handles it correctly if you paste it as a single line or ensure the newlines are preserved.

### Step 3: Build Settings
Vercel will automatically detect Next.js. You don't need to change the build commands.
- **Build Command**: `next build`
- **Output Directory**: `.next`

---

## 3. The Automation Worker (CRITICAL)
Vercel uses **Serverless Functions**, which have a 10–60 second time limit. The Puppeteer worker needs to stay "alive" to poll the database and perform long TradingView actions.

**You have two options for the worker:**

### Option A: Use the Docker setup (Recommended)
Follow the [DEPLOYMENT.md](file:///e:/Product_Indiactor/DEPLOYMENT.md) guide to run the `worker` container on a small $5/mo VPS. It will work perfectly with your Vercel frontend as they both talk to the same Firebase.

### Option B: Deploy Worker to Render/Railway
1. Create a "Background Worker" service on Render or Railway.
2. Point it to your GitHub repo.
3. Set the start command to: `npx tsx src/worker.ts`.
4. Add the same Firebase and Encryption environment variables.

---

## 4. Summary of Vercel Config
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Install Command**: `npm install`
- **Environment Variables**: Required for Firebase, NextAuth, Razorpay, and Google OAuth.
