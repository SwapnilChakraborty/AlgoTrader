# Deployment Guide: AlgoMarket Live

This guide explains how to take the AlgoMarket project live on a production server.

## 1. Prerequisites
- A VPS (Ubuntu 22.04+ recommended).
- A Domain Name pointed to your VPS IP.
- Firebase Project (Blaze plan recommended for production).
- Razorpay Account with **Route** enabled.
- Google Cloud Console Project (for Google OAuth).

---

## 2. Environment Variables
Create a `.env` file on your server with the following variables. Do not use local test keys for production.

```env
# URL & Secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_long_random_secret_here
NEXT_PUBLIC_URL=https://your-domain.com

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
# Private key must include \n for newlines
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Security
# Must be exactly 32 characters
ENCRYPTION_KEY=your_secure_32_character_secret_key

# Razorpay (Live Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=your_secure_webhook_secret

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 3. Server Setup (Docker)
The easiest way to deploy is using the provided Docker configuration. It handles the Next.js app and the Puppeteer worker automatically.

### Install Docker on VPS
Run these commands on your Ubuntu server:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
```

### Deploy
1. Clone your repository to the server.
2. Build and start the containers:
```bash
sudo docker-compose up -d --build
```

---

## 4. Setup Webhooks
To verify payments, you must setup the Razorpay Webhook:
1. Go to **Razorpay Dashboard > Settings > Webhooks**.
2. URL: `https://your-domain.com/api/payment/webhook`
3. Secret: Value from your `RAZORPAY_WEBHOOK_SECRET`.
4. Events: Select `order.paid` and `payment.captured`.

---

## 5. Domain & SSL (Nginx)
Use Nginx as a reverse proxy to handle HTTPS (via Certbot).

### Example Nginx Config:
```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then run Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 6. Maintenance
- **Logs**: `sudo docker-compose logs -f`
- **Restarting**: `sudo docker-compose restart`
- **Worker Status**: Check logs to ensure the Puppeteer worker is polling Firebase for jobs.
