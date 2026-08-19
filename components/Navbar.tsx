"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/#collection" },
  { label: "COLLECTIONS", href: "/#collection" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="relative z-20 mx-auto flex max-w-[1920px] items-center justify-between px-6 pt-8 sm:px-10 lg:px-[110px]">
      <Link href="/" className="relative h-10 w-40 sm:h-12 sm:w-48">
        <Image
          src="/branding/logo.png"
          alt="Graphique Merch"
          fill
          className="object-contain object-left"
          priority
        />
      </Link>

      <nav className="hidden gap-8 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[18px] font-semibold tracking-[2.5px] text-white/90 transition hover:text-cyan-accent lg:text-[20px]"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-5">
        <Link href="/cart" aria-label="Cart" className="relative text-white/90 hover:text-cyan-accent">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h2l1.5 10.5A2 2 0 0 0 9.48 18H18a2 2 0 0 0 1.96-1.6L21 8H6.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="21" r="1.3" fill="currentColor" />
            <circle cx="18" cy="21" r="1.3" fill="currentColor" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-accent text-[9px] font-bold text-black">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
