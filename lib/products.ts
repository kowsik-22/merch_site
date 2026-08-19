export type Product = {
  id: string;
  slug: string; // used in /product/[slug] route
  name: string;
  priceInRupees: number;
  badge: string;
  image: string; // main card image (home page)
  imageWidth: number;
  imageHeight: number;
  rotateDeg: number; // tilted-card look on the home page
  detailImage: string; // large image on product detail page
  thumbnails: string[]; // small gallery images on product detail page
  sizes: string[];
  defaultSize: string;
  color: string;
};

// NOTE: these image URLs are temporary Figma CDN links (expire ~7 days from export).
// Before deploying, download them and move to /public, then update the `image`,
// `detailImage`, and `thumbnails` fields below to local paths.
export const products: Product[] = [
  {
    id: "core-tee",
    slug: "graphique-cosmic-t-shirt",
    name: "GRAPHIQUE CORE TEE",
    priceInRupees: 599,
    badge: "LIMITED",
    image:
      "https://www.figma.com/api/mcp/asset/68a53529-4c72-470f-9959-73dc89906366.png",
    imageWidth: 211,
    imageHeight: 318,
    rotateDeg: -13,
    detailImage:
      "https://www.figma.com/api/mcp/asset/c6a4a161-3c62-4c7e-8210-3af730437201.png",
    thumbnails: [
      "https://www.figma.com/api/mcp/asset/c6a4a161-3c62-4c7e-8210-3af730437201.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    defaultSize: "M",
    color: "COSMIC BLUE",
  },
  {
    id: "hoodie",
    slug: "cosmic-orbit-hoodie",
    name: "GRAPHIQUE COSMIC HOODIE",
    priceInRupees: 1999,
    badge: "BEST SELLER",
    image:
      "https://www.figma.com/api/mcp/asset/268cc4a9-9cfd-462d-a9e4-2aecefc27120.png",
    imageWidth: 202,
    imageHeight: 336,
    rotateDeg: -4,
    detailImage:
      "https://www.figma.com/api/mcp/asset/644b9018-8763-41a1-9b26-dab1aa7acd58.png",
    thumbnails: [
      "https://www.figma.com/api/mcp/asset/644b9018-8763-41a1-9b26-dab1aa7acd58.png",
      "https://www.figma.com/api/mcp/asset/e1480028-6c6a-441f-979a-31a442bda7f2.png",
      "https://www.figma.com/api/mcp/asset/54885c2b-f41c-41e1-a0c2-aa7a6cac897b.png",
      "https://www.figma.com/api/mcp/asset/c6a4a161-3c62-4c7e-8210-3af730437201.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    defaultSize: "M",
    color: "COSMIC BLUE",
  },
  {
    id: "stickers",
    slug: "graphique-stickers",
    name: "GRAPHIQUE STICKERS",
    priceInRupees: 199,
    badge: "NEW DESIGNS",
    image:
      "https://www.figma.com/api/mcp/asset/2d391736-401b-4738-8064-e94f769a00ad.png",
    imageWidth: 157,
    imageHeight: 261,
    rotateDeg: 8,
    detailImage:
      "https://www.figma.com/api/mcp/asset/2d391736-401b-4738-8064-e94f769a00ad.png",
    thumbnails: [
      "https://www.figma.com/api/mcp/asset/2d391736-401b-4738-8064-e94f769a00ad.png",
    ],
    sizes: ["ONE SIZE"],
    defaultSize: "ONE SIZE",
    color: "COSMIC BLUE",
  },
  {
    id: "cap",
    slug: "graphique-cosmic-cap",
    name: "GRAPHIQUE COSMIC CAP",
    priceInRupees: 200,
    badge: "NEW",
    image:
      "https://www.figma.com/api/mcp/asset/39818b14-7787-459d-a453-f5dff6fe4cde.png",
    imageWidth: 121,
    imageHeight: 121,
    rotateDeg: -4,
    detailImage:
      "https://www.figma.com/api/mcp/asset/39818b14-7787-459d-a453-f5dff6fe4cde.png",
    thumbnails: [
      "https://www.figma.com/api/mcp/asset/39818b14-7787-459d-a453-f5dff6fe4cde.png",
    ],
    sizes: ["ONE SIZE"],
    defaultSize: "ONE SIZE",
    color: "COSMIC BLUE",
  },
  {
    id: "tote-bag",
    slug: "graphique-tote-bags",
    name: "GRAPHIQUE TOTE BAGS",
    priceInRupees: 599,
    badge: "NEW DESIGNS",
    image:
      "https://www.figma.com/api/mcp/asset/e78e94c5-0111-491d-ad57-abe21830049f.png",
    imageWidth: 121,
    imageHeight: 236,
    rotateDeg: -4,
    detailImage:
      "https://www.figma.com/api/mcp/asset/e78e94c5-0111-491d-ad57-abe21830049f.png",
    thumbnails: [
      "https://www.figma.com/api/mcp/asset/e78e94c5-0111-491d-ad57-abe21830049f.png",
    ],
    sizes: ["ONE SIZE"],
    defaultSize: "ONE SIZE",
    color: "COSMIC BLUE",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
