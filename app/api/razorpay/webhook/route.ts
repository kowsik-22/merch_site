import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getPendingOrder, deletePendingOrder } from "@/lib/pendingOrders";
import { appendOrderToSheet } from "@/lib/googleSheets";

// This endpoint is called by Razorpay's servers directly — not by the
// customer's browser — the moment a payment is captured. That makes it
// reliable even if the customer closes the tab right after paying, loses
// signal, or the browser crashes before it can report success itself.
//
// Set this URL in Razorpay Dashboard → Settings → Webhooks:
//   https://yourdomain.com/api/razorpay/webhook
// and generate a webhook secret there — put it in RAZORPAY_WEBHOOK_SECRET.
// Subscribe to at least the "payment.captured" event.

export async function POST(req: NextRequest) {
  // Signature is computed over the exact raw request body, so read it as
  // text first — parsing to JSON and re-stringifying would not match.
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set — see .env.example");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("Webhook signature mismatch — request did not come from Razorpay");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);

  if (payload.event !== "payment.captured") {
    // Acknowledge other event types so Razorpay doesn't retry them —
    // we simply don't act on anything besides a captured payment.
    return NextResponse.json({ received: true });
  }

  const payment = payload.payload?.payment?.entity;
  const razorpayOrderId: string | undefined = payment?.order_id;
  const razorpayPaymentId: string | undefined = payment?.id;

  if (!razorpayOrderId || !razorpayPaymentId) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const pending = await getPendingOrder(razorpayOrderId);
  if (!pending) {
    // Either already processed (webhook can legitimately fire more than
    // once for the same event — Razorpay recommends treating it as
    // idempotent) or an order we don't recognize. Acknowledge either way
    // so Razorpay stops retrying; don't error.
    return NextResponse.json({ received: true, note: "No pending order found — already processed or unknown order" });
  }

  const totalInRupees = pending.items.reduce(
    (sum, item) => sum + item.priceInRupees * item.quantity,
    0
  );

  const orderPayload = {
    razorpayOrderId,
    razorpayPaymentId,
    customer: pending.customer,
    items: pending.items,
    totalInRupees,
  };

  try {
    await appendOrderToSheet(orderPayload);
  } catch (sheetErr) {
    // Fails until GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY /
    // GOOGLE_SHEET_ID are set correctly — see README "Google Sheets setup".
    console.error("Failed to log order to Google Sheet:", sheetErr);
  }

  // Only clear the pending record once we've at least attempted logging —
  // if you want a guaranteed retry on total failure, skip this delete when
  // BOTH loggers reject. Left as one line to keep the happy path simple.
  await deletePendingOrder(razorpayOrderId);

  return NextResponse.json({ received: true });
}
