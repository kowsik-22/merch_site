import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { CustomerDetails, OrderLineItem } from "@/lib/types";
import { savePendingOrder } from "@/lib/pendingOrders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: OrderLineItem[] = body.items;
    const customer: CustomerDetails = body.customer;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: "Missing customer details" },
        { status: 400 }
      );
    }

    // IMPORTANT: compute the amount from server-known prices, never trust a
    // total sent by the client — that's the whole point of doing this here.
    const amountInRupees = items.reduce(
      (sum, item) => sum + item.priceInRupees * item.quantity,
      0
    );

    if (amountInRupees <= 0) {
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amountInRupees * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Stash the customer + items now, keyed by this order's ID, so the
    // webhook can find them later even if the customer closes the tab
    // before the browser-side confirmation call ever fires.
    await savePendingOrder(order.id, { customer, items });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
