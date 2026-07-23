import { categories } from "./categories";
import type { PriceTier } from "@/lib/pricing";

export type Variant = {
  label: string;
  options: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  niche: string;
  description: string;
  bullets: string[];
  images: string[];
  tiers: PriceTier[];
  moq: number;
  variants: Variant[];
  rating: number;
  reviewCount: number;
  stock: number;
  isNew: boolean;
  isBestseller: boolean;
  tags: string[];
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// deterministic pseudo-random so the catalog is stable across builds
function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function imagesFor(folder: string, count: number, offset: number, total = 15) {
  const imgs: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = ((offset + i) % total) + 1;
    imgs.push(`/images/products/${folder}/${idx}.jpg`);
  }
  return imgs;
}

type NicheConfig = {
  slug: string;
  category: string;
  imageFolder: string;
  priceRange: [number, number];
  moqOptions: number[];
  variantSets: Variant[];
  nameParts: { adjectives: string[]; nouns: string[] };
  descriptor: string;
};

const nicheConfigs: NicheConfig[] = [
  {
    slug: "perfumes",
    category: "perfumes",
    imageFolder: "perfumes",
    priceRange: [2500, 8500],
    moqOptions: [1, 3, 5],
    variantSets: [
      { label: "Size", options: ["30ml", "50ml", "100ml"] },
      { label: "Scent Family", options: ["Floral", "Woody", "Citrus", "Musk"] },
    ],
    nameParts: {
      adjectives: ["Velvet", "Midnight", "Golden", "Blush", "Amber", "Silk", "Opal", "Crimson", "Ivory"],
      nouns: ["Oud", "Bloom", "Mist", "Musk", "Dream", "Rose", "Noir", "Aura"],
    },
    descriptor: "eau de parfum",
  },
  {
    slug: "cushions",
    category: "cushions",
    imageFolder: "cushions",
    priceRange: [1200, 3500],
    moqOptions: [2, 5, 10],
    variantSets: [
      { label: "Size", options: ["16x16 in", "18x18 in", "20x20 in"] },
      { label: "Fabric", options: ["Velvet", "Linen", "Boucle", "Cotton"] },
    ],
    nameParts: {
      adjectives: ["Boho", "Embroidered", "Tufted", "Quilted", "Woven", "Pleated", "Fringed", "Textured"],
      nouns: ["Cushion", "Throw Pillow", "Accent Pillow", "Lumbar Pillow"],
    },
    descriptor: "cushion cover",
  },
  {
    slug: "handbags",
    category: "handbags",
    imageFolder: "handbags",
    priceRange: [3500, 12000],
    moqOptions: [1, 2, 5],
    variantSets: [
      { label: "Color", options: ["Tan", "Black", "Blush Pink", "Camel", "Emerald"] },
      { label: "Strap", options: ["Chain Strap", "Leather Strap", "Detachable"] },
    ],
    nameParts: {
      adjectives: ["Structured", "Quilted", "Woven", "Mini", "Oversized", "Slouchy", "Boxy"],
      nouns: ["Tote", "Shoulder Bag", "Crossbody", "Satchel", "Hobo Bag"],
    },
    descriptor: "handbag",
  },
  {
    slug: "jewelry",
    category: "jewelry",
    imageFolder: "jewelry",
    priceRange: [800, 6000],
    moqOptions: [3, 5, 10],
    variantSets: [
      { label: "Finish", options: ["Gold Plated", "Silver Plated", "Rose Gold"] },
      { label: "Stone", options: ["Zircon", "Pearl", "Crystal", "None"] },
    ],
    nameParts: {
      adjectives: ["Statement", "Layered", "Delicate", "Chunky", "Beaded", "Vintage-Style", "Minimalist"],
      nouns: ["Necklace", "Earrings", "Bracelet", "Ring Set", "Anklet"],
    },
    descriptor: "jewelry piece",
  },
  {
    slug: "sunglasses",
    category: "sunglasses",
    imageFolder: "sunglasses",
    priceRange: [1500, 5500],
    moqOptions: [3, 6, 12],
    variantSets: [
      { label: "Frame", options: ["Tortoiseshell", "Black", "Clear", "Gold Metal"] },
      { label: "Lens", options: ["UV400", "Polarized", "Gradient"] },
    ],
    nameParts: {
      adjectives: ["Retro", "Oversized", "Cat-Eye", "Round", "Square", "Aviator-Style", "Slim"],
      nouns: ["Sunglasses", "Shades"],
    },
    descriptor: "sunglasses",
  },
  {
    slug: "scarves",
    category: "scarves",
    imageFolder: "scarves",
    priceRange: [1000, 3200],
    moqOptions: [3, 6, 12],
    variantSets: [
      { label: "Material", options: ["Silk", "Satin", "Chiffon", "Cotton Blend"] },
      { label: "Print", options: ["Floral", "Abstract", "Solid", "Paisley"] },
    ],
    nameParts: {
      adjectives: ["Printed", "Draped", "Fringed", "Hand-Rolled", "Lightweight", "Textured"],
      nouns: ["Silk Scarf", "Wrap", "Shawl", "Neck Scarf"],
    },
    descriptor: "scarf",
  },
  {
    slug: "wallets",
    category: "wallets",
    imageFolder: "wallets",
    priceRange: [1800, 4500],
    moqOptions: [3, 6, 12],
    variantSets: [
      { label: "Material", options: ["Genuine Leather", "Vegan Leather", "Suede"] },
      { label: "Color", options: ["Black", "Tan", "Burgundy", "Blush"] },
    ],
    nameParts: {
      adjectives: ["Slim", "Folded", "Zip-Around", "Compact", "Embossed", "Classic"],
      nouns: ["Wallet", "Clutch", "Card Holder", "Coin Purse"],
    },
    descriptor: "wallet",
  },
  {
    slug: "hair-accessories",
    category: "hair-accessories",
    imageFolder: "hair-accessories",
    priceRange: [300, 1200],
    moqOptions: [5, 10, 20],
    variantSets: [
      { label: "Material", options: ["Pearl", "Velvet", "Satin", "Metal"] },
      { label: "Color", options: ["Ivory", "Black", "Blush", "Gold"] },
    ],
    nameParts: {
      adjectives: ["Pearl", "Velvet", "Claw", "Braided", "Jeweled", "Oversized Bow"],
      nouns: ["Hair Clip", "Headband", "Scrunchie Set", "Hair Pin Set"],
    },
    descriptor: "hair accessory",
  },
  {
    slug: "watches",
    category: "watches",
    imageFolder: "watches",
    priceRange: [2500, 15000],
    moqOptions: [1, 3, 5],
    variantSets: [
      { label: "Strap", options: ["Leather", "Steel Mesh", "Chain Link"] },
      { label: "Dial", options: ["White", "Black", "Rose Gold", "Mother of Pearl"] },
    ],
    nameParts: {
      adjectives: ["Classic", "Minimalist", "Vintage-Style", "Slim", "Bold"],
      nouns: ["Wristwatch", "Watch"],
    },
    descriptor: "watch",
  },
  {
    slug: "candles",
    category: "candles",
    imageFolder: "candles",
    priceRange: [800, 2500],
    moqOptions: [5, 10, 20],
    variantSets: [
      { label: "Scent", options: ["Vanilla Musk", "Sandalwood", "Rose Garden", "Ocean Breeze", "Amber Spice"] },
      { label: "Size", options: ["Small (100g)", "Medium (200g)", "Large (350g)"] },
    ],
    nameParts: {
      adjectives: ["Hand-Poured", "Soy", "Aromatherapy", "Glass Jar", "Minimalist"],
      nouns: ["Scented Candle", "Candle"],
    },
    descriptor: "candle",
  },
  {
    slug: "vases",
    category: "vases",
    imageFolder: "vases",
    priceRange: [1500, 6000],
    moqOptions: [2, 5, 10],
    variantSets: [
      { label: "Material", options: ["Ceramic", "Glass", "Terracotta", "Marble Finish"] },
      { label: "Size", options: ["Small", "Medium", "Large"] },
    ],
    nameParts: {
      adjectives: ["Sculptural", "Textured", "Fluted", "Minimalist", "Hand-Painted", "Organic-Shape"],
      nouns: ["Vase", "Flower Vase", "Decor Vase"],
    },
    descriptor: "decorative vase",
  },
  {
    slug: "belts",
    category: "belts",
    imageFolder: "belts",
    priceRange: [1500, 4000],
    moqOptions: [3, 6, 12],
    variantSets: [
      { label: "Material", options: ["Genuine Leather", "Vegan Leather"] },
      { label: "Buckle", options: ["Gold Buckle", "Silver Buckle", "Statement Buckle"] },
    ],
    nameParts: {
      adjectives: ["Classic", "Woven", "Wide", "Slim", "Statement", "Braided"],
      nouns: ["Belt", "Waist Belt"],
    },
    descriptor: "belt",
  },
];

const descriptionTemplates = [
  "A {descriptor} designed for everyday luxury, blending premium materials with a look that turns heads. Perfect for gifting or treating yourself.",
  "Elevate your collection with this {descriptor} — carefully finished, comfortable to use daily, and built to last well beyond the trend cycle.",
  "This {descriptor} pairs standout craftsmanship with an on-trend silhouette, making it a versatile pick for both everyday wear and special occasions.",
  "Thoughtfully made, this {descriptor} balances bold personality with wearable elegance — a House of Fashion favorite.",
];

function generateProductsForNiche(config: NicheConfig, count: number): Product[] {
  const products: Product[] = [];
  const rand = seededRandom(config.slug.length * 97);
  let productIndex = 0;

  for (const adj of config.nameParts.adjectives) {
    for (const noun of config.nameParts.nouns) {
      if (products.length >= count) break;
      const name = `${adj} ${noun}`;
      const slug = slugify(`${config.slug}-${name}-${productIndex}`);
      const r1 = rand();
      const r2 = rand();
      const r3 = rand();

      const basePrice =
        config.priceRange[0] +
        Math.round(r1 * (config.priceRange[1] - config.priceRange[0]));
      const roundedBase = Math.round(basePrice / 50) * 50;

      const moq = config.moqOptions[Math.floor(r2 * config.moqOptions.length)];
      const tiers: PriceTier[] = [
        { minQty: 1, price: roundedBase },
        { minQty: Math.max(moq, 5), price: Math.round(roundedBase * 0.9) },
        { minQty: Math.max(moq * 3, 20), price: Math.round(roundedBase * 0.78) },
      ];

      const rating = Math.round((3.8 + r3 * 1.2) * 10) / 10;
      const reviewCount = Math.floor(8 + r1 * 240);
      const stock = Math.floor(15 + r2 * 300);

      const descTemplate =
        descriptionTemplates[productIndex % descriptionTemplates.length];
      const description = descTemplate.replace("{descriptor}", config.descriptor);

      products.push({
        id: slug,
        slug,
        name,
        category: config.category,
        niche: config.slug,
        description,
        bullets: [
          "Premium materials, quality-checked before dispatch",
          `MOQ: ${moq} piece${moq > 1 ? "s" : ""} — bulk pricing available`,
          "Ships from Karachi, Pakistan — nationwide delivery",
          "7-day easy return on unused items",
        ],
        images: imagesFor(config.imageFolder, 5, productIndex * 3),
        tiers,
        moq,
        variants: config.variantSets,
        rating,
        reviewCount,
        stock,
        isNew: r1 > 0.8,
        isBestseller: r2 > 0.85,
        tags: [config.category, adj.toLowerCase(), noun.toLowerCase()],
      });

      productIndex++;
    }
  }

  return products.slice(0, count);
}

export const products: Product[] = nicheConfigs.flatMap((config) =>
  generateProductsForNiche(config, 9)
);

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.category === categorySlug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count);
}

export { categories };
