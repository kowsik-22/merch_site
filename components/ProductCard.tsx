"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div
      className="group relative w-[300px] shrink-0 transition-transform duration-300 hover:-translate-y-2"
      style={{ transform: `rotate(${product.rotateDeg}deg)` }}
    >
      <div className="relative h-[410px] w-full rounded-[15px] border border-cyan-accent/35 bg-space-card/60 shadow-[0px_14px_45px_6px_rgba(36,107,255,0.16)] backdrop-blur-[17.5px] transition-all duration-300 group-hover:border-cyan-accent/80 group-hover:shadow-[0_0_45px_10px_rgba(0,229,255,0.35)]">
        {/* badge */}
        <div className="absolute -top-3 right-6 rounded-[11px] bg-cyan-accent px-4 py-1.5 shadow-[0_0_31px_0_rgba(0,229,255,0.44)]">
          <p className="text-[13px] font-extrabold tracking-[0.32px] text-black">
            {product.badge}
          </p>
        </div>

        {/* product image links to detail page */}
        <Link
          href={`/product/${product.slug}`}
          className="flex h-[230px] w-full items-center justify-center pt-8"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={product.imageWidth}
            height={product.imageHeight}
            className="h-full w-auto object-contain drop-shadow-[4px_8px_9px_rgba(0,0,0,0.49)] transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </Link>

        {/* details */}
        <div className="px-6 pt-2">
          <Link href={`/product/${product.slug}`}>
            <p className="text-[17px] font-extrabold tracking-[0.2px] text-white transition-colors hover:text-cyan-accent">
              {product.name}
            </p>
          </Link>
          <p className="mt-1 text-[17px] font-black tracking-[0.2px] text-white">
            ₹{product.priceInRupees.toLocaleString("en-IN")}
          </p>
          <div className="my-3 h-px w-full bg-white/15" />
          <button
            onClick={() => addItem(product, product.defaultSize, 1)}
            className="pb-4 text-[17px] text-cyan-accent transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_10px_rgba(0,229,255,0.9)]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
