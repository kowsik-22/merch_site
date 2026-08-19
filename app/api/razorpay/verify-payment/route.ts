import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// This route exists purely so the customer's browser gets a fast "yes, this
// was real" and can redirect to the confirmation page. Actual order logging
// (Excel + Google Sheets) happens in the webhook route instead, which
// Razorpay calls directly and doesn't depend on this request ever completing.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error("Razorpay signature mismatch", { razorpay_order_id });
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Verified. The webhook will independently log this order — this
    // response is only used to redirect the customer to /order-success.
    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
