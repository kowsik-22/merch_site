"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-space px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-accent/15 blur-[130px]" />

      <div className="relative max-w-lg rounded-[22px] border border-cyan-accent/50 bg-space-card/40 p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-accent">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12l5 5L20 6"
              stroke="#00e5ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-[32px] font-extrabold text-white">
          Order Confirmed
        </h1>
        <p className="mt-3 text-white/75">
          Thanks for your order! A confirmation has been sent to your email.
        </p>
        {orderId && (
          <p className="mt-4 text-[13px] text-white/50">
            Order reference: {orderId}
          </p>
        )}
        <Link
          href="/"
          className="mt-8 inline-block rounded-[28px] border-2 border-cyan-accent px-8 py-3 text-[14px] font-bold tracking-[0.5px] text-cyan-accent hover:bg-cyan-accent hover:text-black"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}
