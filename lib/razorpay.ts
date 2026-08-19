import Razorpay from "razorpay";

// SERVER-ONLY. Never import this file from a "use client" component —
// it uses RAZORPAY_KEY_SECRET, which must never reach the browser.
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set. Add them to .env.local — see .env.example."
  );
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
});
