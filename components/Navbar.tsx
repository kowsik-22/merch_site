"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/#collection" },
  { label: "COLLECTIONS", href: "/#collection" },
];

export default function Navbar() {
  const { itemCount } = useCart();

  function scrollToFooter(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("site-footer")?.scrollIntoView({ behavior: "smooth" });
  }

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
            className="relative text-[18px] font-semibold tracking-[2.5px] text-white/90 transition-all duration-200 hover:text-cyan-accent hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] lg:text-[20px]"
          >
            {link.label}
          </Link>
        ))}
        <a
          href="#site-footer"
          onClick={scrollToFooter}
          className="relative text-[18px] font-semibold tracking-[2.5px] text-white/90 transition-all duration-200 hover:text-cyan-accent hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] lg:text-[20px]"
        >
          CONTACT
        </a>
      </nav>

      <div className="flex items-center gap-5">
        <Link
          href="/cart"
          aria-label="Cart"
          className="group relative text-white/90 transition-all duration-200 hover:text-cyan-accent hover:drop-shadow-[0_0_12px_rgba(0,229,255,0.9)]"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-200 group-hover:scale-110"
          >
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
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-accent text-[10px] font-bold text-black shadow-[0_0_10px_rgba(0,229,255,0.8)]">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
