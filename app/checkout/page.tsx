"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { CustomerDetails } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const emptyCustomer: CustomerDetails = {
  name: "",
  email: "",
  phone: "",
};

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  function updateField(field: keyof CustomerDetails, value: string) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!customer.name.trim()) next.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) next.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(customer.phone)) next.phone = "Enter a valid 10-digit Indian mobile number";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePayment() {
    setPaymentError(null);
    if (!validate()) return;
    if (items.length === 0) {
      setPaymentError("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        size: i.size,
        quantity: i.quantity,
        priceInRupees: i.product.priceInRupees,
      }));

      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems, customer }),
      });
      const orderData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(orderData.error ?? "Could not start payment");
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Graphique Merch",
        description: `${items.length} item(s)`,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: "#00e5ff" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              customer,
              items: orderItems,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.verified) {
            router.push(
              `/order-success?orderId=${encodeURIComponent(verifyData.orderId)}`
            );
          } else {
            setPaymentError(
              "Payment could not be verified. If money was deducted, contact support with your payment ID."
            );
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });

      razorpay.on("payment.failed", (resp: any) => {
        setPaymentError(resp?.error?.description ?? "Payment failed. Please try again.");
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (err: any) {
      setPaymentError(err.message ?? "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="relative overflow-hidden bg-space">
        <div className="pointer-events-none absolute left-[5%] top-[10%] h-[500px] w-[600px] rounded-full bg-blue-accent/15 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-8 sm:px-10 lg:px-[110px]">
          <h1 className="text-[40px] font-extrabold tracking-[1.5px] text-white sm:text-[48px]">
            CHECKOUT
          </h1>

          {items.length === 0 ? (
            <p className="mt-10 text-white/80">
              Your cart is empty — add something before checking out.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
              {/* customer + shipping form */}
              <div className="rounded-[22px] border border-cyan-accent/50 bg-space-card/40 p-8">
                <p className="text-[20px] font-semibold text-white">
                  CONTACT & SHIPPING DETAILS
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Full Name"
                    value={customer.name}
                    onChange={(v) => updateField("name", v)}
                    error={errors.name}
                    autoComplete="name"
                  />
                  <Field
                    label="Phone Number"
                    value={customer.phone}
                    onChange={(v) => updateField("phone", v.replace(/\D/g, "").slice(0, 10))}
                    error={errors.phone}
                    autoComplete="tel"
                    inputMode="numeric"
                  />
                  <Field
                    label="Email"
                    value={customer.email}
                    onChange={(v) => updateField("email", v)}
                    error={errors.email}
                    autoComplete="email"
                    className="sm:col-span-2"
                  />
                </div>
              </div>

              {/* order summary + pay button */}
              <div className="h-fit rounded-[22px] border border-cyan-accent/50 bg-space-card/40 p-8">
                <p className="text-[20px] font-semibold text-white">ORDER SUMMARY</p>
                <div className="mt-5 flex flex-col gap-3 border-t border-white/15 pt-5">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between text-[14px] text-white/85">
                      <span>
                        {item.product.name} × {item.quantity}{" "}
                        <span className="text-white/50">({item.size})</span>
                      </span>
                      <span>
                        ₹{(item.product.priceInRupees * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-5">
                  <span className="text-[19px] font-semibold text-white">Total</span>
                  <span className="text-[24px] font-bold text-white">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {paymentError && (
                  <p className="mt-4 rounded-[8px] bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
                    {paymentError}
                  </p>
                )}

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="mt-6 flex h-[62px] w-full items-center justify-center gap-3 rounded-[16px] border-2 border-cyan-accent bg-black text-[18px] font-extrabold tracking-[0.6px] text-white shadow-[0_0_38px_rgba(0,229,255,0.4)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(0,229,255,0.7)] hover:brightness-125 disabled:opacity-60 disabled:hover:scale-100"
                >
                  {isProcessing ? "PROCESSING…" : "PAY SECURELY"}
                </button>
                <p className="mt-3 text-center text-[13px] text-white/70">
                  Secure checkout by RazorPay
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "email" | "tel";
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[13px] font-medium tracking-[0.5px] text-white/70">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`mt-2 h-[48px] w-full rounded-[8px] border bg-transparent px-4 text-[15px] text-white placeholder:text-white/40 focus:outline-none ${
          error ? "border-red-400" : "border-white/25 focus:border-cyan-accent"
        }`}
      />
      {error && <span className="mt-1 block text-[12px] text-red-300">{error}</span>}
    </label>
  );
}
