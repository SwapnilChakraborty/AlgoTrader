"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import Script from "next/script";

interface CheckoutButtonProps {
    indicatorId: string;
    price: number;
}

export default function CheckoutButton({ indicatorId, price }: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Razorpay disabled for manual UPI mode
            // Will re-enable when automated payments are needed

            // Redirect to the manual checkout page
            window.location.href = `/checkout/${indicatorId}`;

            /*
            // 1. Create order on backend (calculates platform fee & vendor route transfer)
            const res = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ indicatorId }),
            });

            const orderData = await res.json();

            if (!res.ok) {
                throw new Error(orderData.error || "Failed to create order");
            }

            // 2. Initialize Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC prefix for client
                amount: orderData.amount,
                currency: orderData.currency,
                name: "AlgoMarket",
                description: `Subscription to Premium Indicator`,
                order_id: orderData.id,
                handler: function (response: any) {
                    // 3. DO NOT activate subscription here!
                    // Razorpay has captured the payment. The webhook /api/payment/webhook 
                    // will receive the truth from Razorpay and update Firebase.
                    console.log("Payment successful! Waiting for webhook confirmation...", response);
                    alert("Payment successful! Your access will be granted momentarily.");

                    // Optionally trigger a router refresh or poll for status
                    // window.location.reload();
                },
                theme: {
                    color: "#6366f1" // Tailwind Indigo-500
                }
            };

            // @ts-ignore - Razorpay is loaded via script tag
            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response: any) {
                console.error("Payment failed", response.error);
                alert(`Payment Failed: ${response.error.description}`);
            });

            rzp.open();
            */

        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* <Script src="https://checkout.razorpay.com/v1/checkout.js" /> */}
            <button
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Subscribe Now — ${price}/mo
                    </>
                )}
            </button>
        </>
    );
}
