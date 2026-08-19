"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const product = getProductBySlug(params.slug);

  const [selectedSize, setSelectedSize] = useState(
    product?.defaultSize ?? ""
  );
  const [selectedImage, setSelectedImage] = useState(
    product?.detailImage ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-32 text-center text-white">
        <p className="text-2xl font-bold">Product not found</p>
        <Link href="/" className="mt-4 inline-block text-cyan-accent">
          ← Back to shop
        </Link>
      </main>
    );
  }

  function handleAddToCart() {
    if (!product) return;
    addItem(product, selectedSize, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <main className="relative overflow-hidden bg-space">
      {/* ambient glow, matching the site's cosmic theme */}
      <div className="pointer-events-none absolute left-[5%] top-[10%] h-[500px] w-[600px] rounded-full bg-blue-accent/15 blur-[130px]" />
      <div className="pointer-events-none absolute right-[5%] top-[30%] h-[400px] w-[500px] rounded-full bg-cyan-accent/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-8 sm:px-10 lg:px-[110px]">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* gallery */}
          <div className="flex gap-6">
            <div className="flex flex-col gap-4">
              {product.thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(thumb)}
                  className={`relative h-[126px] w-[110px] shrink-0 overflow-hidden rounded-[16px] border transition ${
                    selectedImage === thumb
                      ? "border-cyan-accent shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                      : "border-[#007599]/60"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
            <div className="relative h-[600px] w-full max-w-[560px] overflow-hidden rounded-[22px] border border-cyan-accent/50 bg-space-card/40 shadow-[0_0_60px_rgba(0,229,255,0.1)]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          </div>

          {/* details */}
          <div className="pt-2">
            <p className="text-[18px] font-bold tracking-[1px] text-[#2f9fe8]">
              NEW ARRIVAL
            </p>
            <h1 className="mt-3 text-[44px] font-bold leading-[1.05] text-white sm:text-[56px] lg:text-[64px]">
              {product.name}
            </h1>

            <div className="mt-8 rounded-[11px] bg-gradient-to-r from-cyan-accent/20 to-fuchsia-900/20 px-6 py-5 shadow-[inset_0_0_20px_rgba(54,183,244,0.15)]">
              <p className="text-[28px] font-extrabold text-white">
                ₹{product.priceInRupees.toLocaleString("en-IN")}
              </p>
            </div>

            {product.sizes.length > 1 || product.sizes[0] !== "ONE SIZE" ? (
              <div className="mt-8">
                <p className="text-[16px] font-bold tracking-[1px] text-white">
                  SIZE
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-[52px] min-w-[80px] items-center justify-center rounded-[8px] px-3 text-[18px] font-medium tracking-[2px] text-white transition ${
                        selectedSize === size
                          ? "border-2 border-cyan-accent shadow-[0_0_25px_rgba(255,255,255,0.35)]"
                          : "border border-[#d9d9d9]/60"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <p className="text-[16px] font-bold tracking-[1px] text-white">
                QUANTITY
              </p>
              <div className="mt-4 flex h-[52px] w-[220px] items-center justify-between rounded-[6px] border-2 border-cyan-accent/80 bg-black px-6">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-[20px] font-bold text-white"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-[18px] font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-[20px] font-bold text-white"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-10 flex h-[69px] w-full max-w-[430px] items-center justify-center gap-3 rounded-[16px] border-2 border-cyan-accent bg-black text-[18px] font-extrabold tracking-[0.6px] text-white shadow-[0_0_38px_rgba(0,229,255,0.4)] transition hover:brightness-125"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {justAdded ? "ADDED ✓" : "ADD TO CART"}
            </button>

            {justAdded && (
              <button
                onClick={() => router.push("/cart")}
                className="mt-4 block text-[15px] text-cyan-accent hover:text-white"
              >
                View cart →
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
