"use client";

import Image from "next/image";

// NOTE: temporary Figma CDN links — download to /public/hero/ before
// deploying (see README.md in this project for the full asset list).
const IMG_BG =
  "https://www.figma.com/api/mcp/asset/79ca3cf2-a999-4efb-a5cd-9b38883756df.svg";
const IMG_CLOUDS =
  "https://www.figma.com/api/mcp/asset/c6daf81b-fd3a-44d2-9e84-e93a798ec449.svg";
const IMG_HERO_COMPOSITE =
  "https://www.figma.com/api/mcp/asset/268cc4a9-9cfd-462d-a9e4-2aecefc27120.png";

export default function Hero({
  onExploreCollection,
}: {
  onExploreCollection: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-space">
      {/* starfield background */}
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <Image src={IMG_BG} alt="" fill className="object-cover" priority unoptimized />
      </div>

      {/* nebula glow blobs */}
      <div className="pointer-events-none absolute left-[10%] top-[5%] h-[500px] w-[700px] rounded-full bg-blue-accent/20 blur-[120px] mix-blend-screen" />
      <div className="pointer-events-none absolute right-[10%] top-[20%] h-[500px] w-[700px] rounded-full bg-fuchsia-500/10 blur-[120px] mix-blend-screen" />

      {/* cloud/planet layer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] opacity-70">
        <Image src={IMG_CLOUDS} alt="" fill className="object-cover object-top" unoptimized />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* copy + CTAs */}
          <div>
            <p className="text-[20px] font-semibold tracking-[3.5px] text-cyan-accent">
              MERCHANDISE
            </p>
            <h1 className="mt-4 text-[48px] font-bold leading-[1.1] tracking-[-1px] text-white sm:text-[64px] lg:text-[72px]">
              WEAR THE
              <br />
              GRAPHIQUE
              <br />
              UNIVERSE
            </h1>
            <p className="mt-6 max-w-lg text-[17px] font-semibold leading-[1.5] text-[#8fa6c8]">
              Explore the limited cosmic-inspired merchandise designed for
              creators, dreamers, and visual storytellers.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={onExploreCollection}
                className="rounded-[28px] border-2 border-cyan-accent/90 bg-space-card px-8 py-4 text-[16px] font-bold tracking-[0.5px] text-[#84f2ff] shadow-[0_0_21px_2px_rgba(0,229,255,0.7)] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_35px_6px_rgba(0,229,255,0.9)] hover:brightness-110"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          </div>

          {/* floating hero composite */}
          <div className="relative mx-auto h-[420px] w-full max-w-[520px] lg:h-[520px]">
            <div className="pointer-events-none absolute inset-x-8 bottom-4 h-16 rounded-[50%] bg-cyan-accent/30 blur-2xl" />
            <Image
              src={IMG_HERO_COMPOSITE}
              alt="Graphique merchandise collection — tee, hoodie, stickers and tote bag"
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              unoptimized
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
