"use client";

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  function scrollToCollection() {
    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-space">
      <Hero onExploreCollection={scrollToCollection} />

      <section
        id="collection"
        className="mx-auto max-w-7xl px-6 pb-32 pt-8 sm:px-10 lg:px-16"
      >
        <div className="flex flex-wrap justify-center gap-10 sm:justify-between">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
