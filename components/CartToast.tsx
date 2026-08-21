"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function CartToast() {
  const { notification, dismissNotification } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notification) return;

    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), 2700);
    const dismissTimer = setTimeout(() => dismissNotification(), 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(dismissTimer);
    };
  }, [notification, dismissNotification]);

  if (!notification) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[1000] flex items-center gap-3 rounded-[14px] border border-cyan-accent/60 bg-space-card/95 px-5 py-4 shadow-[0_0_30px_rgba(0,229,255,0.35)] backdrop-blur-md transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-accent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12l5 5L20 6"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p className="text-[14px] font-bold text-white">Added to cart</p>
        <p className="text-[13px] text-white/70">{notification.productName}</p>
      </div>
    </div>
  );
}
