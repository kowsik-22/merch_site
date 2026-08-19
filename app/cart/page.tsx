"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const router = useRouter();
  const [discountCode, setDiscountCode] = useState("");

  const total = subtotal; // hook discount logic in here once you have real codes

  return (
    <main className="relative overflow-hidden bg-space">
      <div className="pointer-events-none absolute left-[5%] top-[10%] h-[500px] w-[600px] rounded-full bg-blue-accent/15 blur-[130px]" />
      <div className="pointer-events-none absolute right-[5%] top-[20%] h-[400px] w-[500px] rounded-full bg-cyan-accent/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-8 sm:px-10 lg:px-[110px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[44px] font-extrabold tracking-[1.5px] text-white sm:text-[56px] lg:text-[64px]">
              YOUR CART
            </h1>
            <p className="mt-2 text-[20px] text-white/90">
              {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
            </p>
          </div>
          <Link
            href="/"
            className="hidden items-center gap-2 text-[20px] font-semibold tracking-[2px] text-cyan-accent hover:text-white sm:flex"
          >
            Continue Shopping →
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-20 rounded-[22px] border border-cyan-accent/40 bg-space-card/40 px-10 py-20 text-center">
            <p className="text-[22px] text-white">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-[28px] border-2 border-cyan-accent px-8 py-3 text-[15px] font-bold tracking-[0.5px] text-cyan-accent hover:bg-cyan-accent hover:text-black"
            >
              BROWSE THE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            {/* cart items */}
            <div className="rounded-[22px] border border-cyan-accent/50 bg-space-card/40 p-8 shadow-[0_0_50px_rgba(255,255,255,0.06)]">
              <div className="flex flex-col divide-y divide-white/10">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex flex-wrap items-center gap-6 py-6 first:pt-0 last:pb-0"
                  >
                    <div className="relative h-[110px] w-[110px] shrink-0 overflow-hidden rounded-[8px] border-2 border-cyan-accent/70">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-[200px] flex-1">
                      <p className="text-[20px] font-bold text-white">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-[22px] font-bold text-white">
                        ₹{item.product.priceInRupees.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-[14px] text-white/70">
                        SIZE : {item.size} · COLOR : {item.product.color}
                      </p>
                    </div>

                    <div className="flex h-[52px] items-center justify-between rounded-[6px] border-2 border-cyan-accent/80 px-5 sm:w-[160px]">
                      <button
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity - 1)
                        }
                        className="text-[18px] font-bold text-white"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-[16px] font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                        className="text-[18px] font-bold text-white"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="flex items-center gap-1.5 text-[15px] text-white/80 hover:text-red-400"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* order summary */}
            <div className="h-fit rounded-[22px] border border-cyan-accent/50 bg-space-card/40 p-8 shadow-[0_0_50px_rgba(255,255,255,0.06)]">
              <p className="text-[20px] font-semibold text-white">
                ORDER SUMMARY
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5 text-[16px]">
                <span className="font-light text-white">
                  Subtotal ({itemCount} items)
                </span>
                <span className="font-semibold text-white">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-5 flex gap-3 border-t border-white/15 pt-5">
                <input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter Discount Code"
                  className="h-[54px] flex-1 rounded-[6px] border border-[#007599] bg-transparent px-4 text-[14px] text-white placeholder:text-white/50 focus:border-cyan-accent focus:outline-none"
                />
                <button className="h-[53px] w-[129px] rounded-[6px] border-2 border-cyan-accent text-[19px] font-semibold tracking-[1px] text-white shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:bg-cyan-accent hover:text-black">
                  APPLY
                </button>
              </div>

              <div className="mt-6 flex items-start justify-between border-t border-white/15 pt-5">
                <div>
                  <p className="text-[19px] font-semibold text-white">
                    Total
                  </p>
                  <p className="text-[14px] font-light text-white/70">
                    Exclusive of all taxes
                  </p>
                </div>
                <span className="text-[24px] font-bold text-white">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="mt-7 flex h-[69px] w-full items-center justify-center gap-3 rounded-[16px] border-2 border-cyan-accent bg-black text-[20px] font-extrabold tracking-[0.8px] text-white shadow-[0_0_38px_rgba(0,229,255,0.4)] transition hover:brightness-125"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                PROCEED TO CHECKOUT
              </button>
              <p className="mt-3 text-center text-[13px] text-white/70">
                Secure checkout by RazorPay
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
