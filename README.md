# AlgoMarket - TradingView Indicator SaaS

A production-ready SaaS marketplace for buying and selling TradingView invite-only indicators with automated subscription access.

## Features
- **Multi-Vendor Marketplace**: Anyone can list an indicator. Traders can subscribe.
- **Automated TradingView Access**: No manual intervention needed to grant/revoke access.
- **Node-Cron Background Workers**: Fully scalable DB-backed job queue replaces Redis.
- **Premium Fintech UI**: Built with Tailwind CSS and Next.js 14 App Router.

---

## 🚀 Deployment Guide

### Prerequisites
- Docker Engine & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (or use the provided `docker-compose.yml`)

### 1. Environment Setup
Copy the `.env.example` (or `.env` generated) to `.env` on your production server.

```bash
DATABASE_URL="postgresql://postgres:password@postgres:5432/tv_saas?schema=public"
NEXTAUTH_SECRET="your_secure_random_string"
NEXTAUTH_URL="https://yourdomain.com"
PAYMENT_WEBHOOK_SECRET="your_razorpay_webhook_secret"
```

### 2. Deploy with Docker Compose
The system is fully dockerized. The `docker-compose.yml` spins up:
1. PostgreSQL Database
2. Next.js Web App
3. Node-Cron Background Worker

Run the following command in the root directory:

```bash
docker-compose up -d --build
```

### 3. Database Migrations
Once the database container is running, execute the Prisma migrations to create the tables:

```bash
# Run this inside the app container or locally pointing to the DB
npx prisma db push

# Alternatively, wait for the app container to start and run:
docker exec -it tv_saas_app npx prisma db push
```

---

## Technical Stack
- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Server Actions & API Routes, Node.js Cron Worker
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (Credentials + bcrypt)

## Background Processing Architecture
Instead of Redis + BullMQ, this system uses a table (`jobs`) in PostgreSQL. 
The standalone `worker.ts` script runs via `node-cron` every minute, polling for `PENDING` jobs, granting access to TradingView via the pseudo-API, and handling retries intelligently. It also runs a daily cron job to cleanup expired subscriptions automatically.
