# Multi-Vendor Razorpay Configuration

Your payment integration using Razorpay Route is complete. This document details how to configure and test the system.

## Environment Variables
Add the following to your `.env` file:

```env
# Client-side (Public) Key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YourTestKeyId

# Server-side Secret Keys
RAZORPAY_KEY_ID=rzp_test_YourTestKeyId
RAZORPAY_KEY_SECRET=YourTestKeySecret
RAZORPAY_WEBHOOK_SECRET=your_custom_secure_webhook_secret_here

# Google OAuth Keys
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

*Note: The `RAZORPAY_WEBHOOK_SECRET` is defined by YOU when you create the webhook in the Razorpay Dashboard. It is an arbitrary secure string used for crypto signatures, not a key provided automatically by Razorpay.*

## How to Test Payments

1. **Vendor Setup:**
   Ensure the seller's user document in the `users` collection has a valid `razorpayAccountId` field. You can create a test linked account via your main Razorpay Dashboard (under "Route").
   *Example: `acc_PrZ1H3mO9D`*

2. **Run Local Webhooks:**
   Because Razorpay needs a public URL to send webhooks to (`/api/payment/webhook`), you cannot use `localhost` directly. 
   Use Stripe CLI or Ngrok to tunnel traffic:
   ```bash
   ngrok http 3000
   ```
   Take the generated ngrok URL, append `/api/payment/webhook`, and paste it into the Razorpay Webhook settings.
   
3. **Configure Webhook Events:**
   When setting up the webhook in the Razorpay dashboard, ensure you subscribe to the `payment.captured` event.

4. **Test the Flow:**
   - Log in as a Buyer.
   - Click the `<CheckoutButton>` for a specific indicator.
   - The popup will open. Use [Razorpay's Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/) to authorize the payment.
   - Watch your server console. You should see the `POST /api/payment/webhook` executing and printing `Granted access for User...`.
   - Check the Firebase `subscriptions` collection to verify the document was created with status `active`.
   - Check your Razorpay Route dashboard to verify the funds automatically split between your main account (platform fee) and the linked account (vendor).
