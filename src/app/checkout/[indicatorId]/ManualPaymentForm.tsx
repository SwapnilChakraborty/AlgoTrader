"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ManualPaymentFormProps {
    indicatorId: string;
    indicatorName: string;
    price: number;
    initialTradingviewUsername?: string;
}

export default function ManualPaymentForm({ indicatorId, indicatorName, price, initialTradingviewUsername = "" }: ManualPaymentFormProps) {
    const [transactionId, setTransactionId] = useState("");
    const [tradingviewUsername, setTradingviewUsername] = useState(initialTradingviewUsername);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!transactionId || transactionId.length < 8) {
            setError("Please enter a valid Transaction ID");
            return;
        }

        if (!tradingviewUsername || tradingviewUsername.trim().length === 0) {
            setError("TradingView Username is required for script delivery");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/payment/manual-submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ indicatorId, transactionId, tradingviewUsername }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit payment");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Payment Submitted!</h3>
                <p className="text-gray-400 max-w-sm">
                    Your transaction ID <span className="text-white font-mono">{transactionId}</span> has been received.
                    Our admins will verify the payment and activate your subscription shortly.
                </p>
                <button
                    onClick={() => window.location.href = "/dashboard"}
                    className="mt-8 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-center">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Submit Payment Details</h2>
                <p className="text-gray-400 text-sm">After making the payment, please enter your transaction details below for verification.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="space-y-6 flex-grow">
                <div>
                    <label htmlFor="transactionId" className="block text-sm font-medium text-gray-300 mb-2">
                        UPI Transaction ID <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="transactionId"
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 123456789012"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">The 12-digit reference number from your payment app.</p>
                </div>

                <div>
                    <label htmlFor="tradingviewUsername" className="block text-sm font-medium text-gray-300 mb-2">
                        TradingView Username <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="tradingviewUsername"
                        type="text"
                        value={tradingviewUsername}
                        onChange={(e) => setTradingviewUsername(e.target.value)}
                        placeholder="e.g. your_tv_username"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">Required for the script to be shared to your TradingView account.</p>
                </div>

                <div>
                    <label htmlFor="screenshot" className="block text-sm font-medium text-gray-300 mb-2">
                        Payment Screenshot <span className="text-gray-500 text-xs ml-1">(Optional)</span>
                    </label>
                    <input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer text-sm cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-2">Uploading a screenshot can speed up verification.</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
                <button
                    type="submit"
                    disabled={loading || !transactionId || !tradingviewUsername}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        "Submit Payment"
                    )}
                </button>
            </div>
        </form>
    );
}
