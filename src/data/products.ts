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
  variantPrices?: Record<string, number>; // maps variant option to unit price
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
  imagePoolSize?: number;
  productCount?: number;
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
  {
    slug: "mens-shalwar-kameez",
    category: "mens-shalwar-kameez",
    imageFolder: "mens-shalwar-kameez",
    imagePoolSize: 22,
    productCount: 16,
    priceRange: [2200, 6500],
    moqOptions: [1, 5, 10],
    variantSets: [
      { label: "Size", options: ["S", "M", "L", "XL", "XXL"] },
      { label: "Fabric", options: ["Cambric Cotton", "Wash & Wear", "Karandi", "Linen"] },
    ],
    nameParts: {
      adjectives: ["Classic", "Embroidered", "Formal", "Casual", "Boski", "Chikankari", "Plain", "Designer"],
      nouns: ["Shalwar Kameez", "Kurta Shalwar", "Kurta Set"],
    },
    descriptor: "stitched shalwar kameez",
  },
  {
    slug: "womens-lawn-suits",
    category: "womens-lawn-suits",
    imageFolder: "womens-lawn-suits",
    imagePoolSize: 30,
    productCount: 18,
    priceRange: [1800, 7500],
    moqOptions: [1, 6, 12],
    variantSets: [
      { label: "Stitching", options: ["Unstitched", "Stitched (+ tailoring)"] },
      { label: "Size", options: ["Small", "Medium", "Large", "Free Size (Unstitched)"] },
    ],
    nameParts: {
      adjectives: ["Embroidered", "Printed", "Digital Print", "Chikankari", "Khaddar", "Festive", "Bridal", "Casual", "Premium"],
      nouns: ["Lawn Suit", "3-Piece Suit", "Unstitched Suit"],
    },
    descriptor: "unstitched 3-piece lawn suit",
  },
  {
    slug: "kids-traditional-wear",
    category: "kids-traditional-wear",
    imageFolder: "kids-traditional-wear",
    imagePoolSize: 29,
    productCount: 16,
    priceRange: [1200, 3800],
    moqOptions: [3, 10, 20],
    variantSets: [
      { label: "Age", options: ["1-2 yrs", "3-4 yrs", "5-6 yrs", "7-8 yrs", "9-10 yrs"] },
      { label: "Fabric", options: ["Cotton", "Lawn", "Silk Blend"] },
    ],
    nameParts: {
      adjectives: ["Mini", "Embroidered", "Festive", "Boys", "Girls", "Printed", "Party-Wear", "Everyday"],
      nouns: ["Shalwar Kameez", "Kurta Set", "Frock", "Ethnic Set"],
    },
    descriptor: "kids' traditional outfit",
  },
  {
    slug: "kitchen-storage",
    category: "kitchen-storage",
    imageFolder: "kitchen-storage",
    imagePoolSize: 15,
    productCount: 9,
    priceRange: [400, 2200],
    moqOptions: [5, 12, 24],
    variantSets: [
      { label: "Material", options: ["BPA-Free Plastic", "Glass", "Stainless Steel"] },
      { label: "Size", options: ["Small", "Medium", "Large", "Set of 3"] },
    ],
    nameParts: {
      adjectives: ["Airtight", "Stackable", "Transparent", "Minimalist", "Space-Saving", "Leak-Proof"],
      nouns: ["Storage Container", "Jar Set", "Organizer Box", "Spice Rack"],
    },
    descriptor: "kitchen storage piece",
  },
  {
    slug: "stationery-desk",
    category: "stationery-desk",
    imageFolder: "stationery-desk",
    imagePoolSize: 15,
    productCount: 9,
    priceRange: [250, 1500],
    moqOptions: [6, 12, 24],
    variantSets: [
      { label: "Color", options: ["Pastel Pink", "Sage Green", "Cream", "Lavender", "Multicolor"] },
    ],
    nameParts: {
      adjectives: ["Cute", "Minimalist", "Aesthetic", "Compact", "Pastel", "Kawaii"],
      nouns: ["Desk Organizer", "Notebook Set", "Sticky Note Pack", "Pen Holder"],
    },
    descriptor: "desk accessory",
  },
  {
    slug: "bathroom-accessories",
    category: "bathroom-accessories",
    imageFolder: "bathroom-accessories",
    imagePoolSize: 15,
    productCount: 9,
    priceRange: [500, 2800],
    moqOptions: [5, 12, 20],
    variantSets: [
      { label: "Material", options: ["Ceramic", "Bamboo", "Stainless Steel", "Silicone"] },
      { label: "Color", options: ["White", "Black", "Natural Wood", "Pastel"] },
    ],
    nameParts: {
      adjectives: ["Minimalist", "Compact", "Freestanding", "Wall-Mounted", "Rustic", "Modern"],
      nouns: ["Soap Dispenser", "Storage Caddy", "Organizer Set", "Accessory Tray"],
    },
    descriptor: "bathroom accessory",
  },
  {
    slug: "bedsheets",
    category: "bedsheets",
    imageFolder: "bedsheets",
    imagePoolSize: 15,
    productCount: 9,
    priceRange: [1500, 5500],
    moqOptions: [3, 8, 15],
    variantSets: [
      { label: "Size", options: ["Single", "Double", "Queen", "King"] },
      { label: "Material", options: ["Cotton", "Egyptian Cotton", "Microfiber", "Silk Blend"] },
    ],
    nameParts: {
      adjectives: ["Printed", "Plain Dyed", "Embroidered", "Striped", "Floral", "Minimalist"],
      nouns: ["Bedsheet Set", "Fitted Sheet Set", "Duvet Cover Set", "Bedding Set"],
    },
    descriptor: "bedsheet set",
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
      const stock = 0; // All products sold out

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
        images: imagesFor(config.imageFolder, 5, productIndex * 3, config.imagePoolSize ?? 15),
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

export const generatedProducts: Product[] = nicheConfigs.flatMap((config) =>
  generateProductsForNiche(config, config.productCount ?? 9)
);

// ═══════════════════════════════════════════════════════════════
// REAL PRODUCTS — Client's actual inventory
// ═══════════════════════════════════════════════════════════════

const realPerfumes: Product[] = [
  {
    id: "real-perfume-1", slug: "oud-royale-eau-de-parfum",
    name: "Oud Royale Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "A luxurious oriental fragrance centered around premium oud wood, enriched with warm amber and soft vanilla. Long-lasting sillage that evolves beautifully throughout the day. Perfect for evening wear and special occasions.",
    bullets: ["Premium oud wood base note", "Long-lasting 8+ hours", "Warm amber & vanilla heart", "Elegant glass bottle with gold accents"],
    images: ["/images/products/perfumes/p1.jpg"],
    tiers: [{ minQty: 1, price: 2550 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 2550, "30ml": 1750 },
    rating: 4.8, reviewCount: 0, stock: 25, isNew: true, isBestseller: true,
    tags: ["perfume", "oud", "luxury"],
  },
  {
    id: "real-perfume-2", slug: "velvet-rose-eau-de-parfum",
    name: "Velvet Rose Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "A romantic floral masterpiece with Bulgarian rose at its heart, wrapped in velvet musk and a touch of pink pepper. Feminine, elegant, and utterly captivating.",
    bullets: ["Bulgarian rose centifolia", "Velvet musk base", "Pink pepper top note", "Suitable for daily & formal wear"],
    images: ["/images/products/perfumes/p2.jpg"],
    tiers: [{ minQty: 1, price: 2500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 2500, "30ml": 1650 },
    rating: 4.7, reviewCount: 0, stock: 20, isNew: true, isBestseller: false,
    tags: ["perfume", "rose", "floral"],
  },
  {
    id: "real-perfume-3", slug: "midnight-noir-eau-de-parfum",
    name: "Midnight Noir Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "A bold, mysterious fragrance for the modern gentleman. Dark leather, smoky vetiver, and black cardamom create an aura of confidence and sophistication.",
    bullets: ["Dark leather & smoky vetiver", "Black cardamom top note", "Masculine & sophisticated", "All-season signature scent"],
    images: ["/images/products/perfumes/p3.jpg"],
    tiers: [{ minQty: 1, price: 2400 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 2400, "30ml": 1700 },
    rating: 4.6, reviewCount: 0, stock: 18, isNew: true, isBestseller: false,
    tags: ["perfume", "noir", "masculine"],
  },
  {
    id: "real-perfume-4", slug: "golden-amber-eau-de-parfum",
    name: "Golden Amber Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "Rich golden amber blended with saffron, sandalwood, and a whisper of honey. A warm, enveloping fragrance that feels like liquid gold on your skin.",
    bullets: ["Golden amber & saffron blend", "Sandalwood warmth", "Honey-kissed sweetness", "Exceptional longevity"],
    images: ["/images/products/perfumes/p4.jpg"],
    tiers: [{ minQty: 1, price: 2500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 2500, "30ml": 1800 },
    rating: 4.5, reviewCount: 0, stock: 22, isNew: true, isBestseller: false,
    tags: ["perfume", "amber", "warm"],
  },
  {
    id: "real-perfume-5", slug: "crimson-blaze-eau-de-parfum",
    name: "Crimson Blaze Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "Fiery and passionate — crimson berries, cinnamon bark, and smoldering incense create a trail of seduction. A fragrance that commands attention.",
    bullets: ["Crimson berries & cinnamon", "Smoldering incense base", "Passionate & bold", "Perfect for date nights"],
    images: ["/images/products/perfumes/p5.jpg"],
    tiers: [{ minQty: 1, price: 3000 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 3000, "30ml": 1650 },
    rating: 4.9, reviewCount: 0, stock: 15, isNew: true, isBestseller: true,
    tags: ["perfume", "crimson", "bold"],
  },
  {
    id: "real-perfume-6", slug: "silk-dream-eau-de-parfum",
    name: "Silk Dream Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "Light as silk, dreamy as a cloud. White peony, jasmine petals, and soft musk create an ethereal, clean fragrance that feels like a breath of fresh air.",
    bullets: ["White peony & jasmine petals", "Soft musk undertone", "Light & ethereal", "Ideal for spring & summer"],
    images: ["/images/products/perfumes/p6.jpg"],
    tiers: [{ minQty: 1, price: 3000 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 3000, "30ml": 1750 },
    rating: 4.7, reviewCount: 0, stock: 20, isNew: true, isBestseller: false,
    tags: ["perfume", "silk", "floral"],
  },
  {
    id: "real-perfume-7", slug: "citrus-burst-eau-de-toilette",
    name: "Citrus Burst Eau de Toilette",
    category: "perfumes", niche: "perfumes",
    description: "An explosion of fresh Italian lemon, bergamot, and green tea. Uplifting, energizing, and perfect for the modern man who loves a clean, zesty vibe.",
    bullets: ["Italian lemon & bergamot", "Green tea heart note", "Fresh & energizing", "Great for everyday wear"],
    images: ["/images/products/perfumes/p7.jpg"],
    tiers: [{ minQty: 1, price: 2000 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 2000, "30ml": 1200 },
    rating: 4.4, reviewCount: 0, stock: 30, isNew: true, isBestseller: false,
    tags: ["perfume", "citrus", "fresh"],
  },
  {
    id: "real-perfume-8", slug: "opal-musk-eau-de-parfum",
    name: "Opal Musk Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "Pure white musk with iridescent notes of pear blossom, iris, and cashmere wood. A sophisticated unisex fragrance that shimmers on the skin.",
    bullets: ["Pure white musk base", "Pear blossom & iris", "Cashmere wood warmth", "Unisex — for everyone"],
    images: ["/images/products/perfumes/p8.jpg"],
    tiers: [{ minQty: 1, price: 3200 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 3200, "30ml": 2000 },
    rating: 4.8, reviewCount: 0, stock: 12, isNew: true, isBestseller: true,
    tags: ["perfume", "musk", "unisex"],
  },
  {
    id: "real-perfume-9", slug: "ivory-bloom-eau-de-parfum",
    name: "Ivory Bloom Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "Delicate ivory florals — lily of the valley, white gardenia, and Madagascar vanilla. A graceful, feminine scent that leaves a trail of elegance wherever you go.",
    bullets: ["Lily of the valley & gardenia", "Madagascar vanilla base", "Graceful & feminine", "Long-lasting elegance"],
    images: ["/images/products/perfumes/p9.jpg"],
    tiers: [{ minQty: 1, price: 3500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 3500, "30ml": 2150 },
    rating: 4.9, reviewCount: 0, stock: 10, isNew: true, isBestseller: true,
    tags: ["perfume", "ivory", "feminine"],
  },
  {
    id: "real-perfume-10", slug: "blush-mist-eau-de-parfum",
    name: "Blush Mist Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "A soft, powdery mist of pink blush, peony, and sandalwood. Gentle, romantic, and effortlessly chic — your new everyday signature.",
    bullets: ["Pink blush & peony", "Sandalwood warmth", "Soft & powdery finish", "Everyday signature scent"],
    images: ["/images/products/perfumes/p10.jpg"],
    tiers: [{ minQty: 1, price: 2350 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 2350, "30ml": 1550 },
    rating: 4.5, reviewCount: 0, stock: 18, isNew: true, isBestseller: false,
    tags: ["perfume", "blush", "romantic"],
  },
  {
    id: "real-perfume-11", slug: "amber-noir-eau-de-parfum",
    name: "Amber Noir Eau de Parfum",
    category: "perfumes", niche: "perfumes",
    description: "Dark amber meets black orchid and tonka bean. A deep, intoxicating evening fragrance for those who embrace the night. Mysterious, magnetic, unforgettable.",
    bullets: ["Dark amber & black orchid", "Tonka bean richness", "Evening & special occasion", "Intoxicating & magnetic"],
    images: ["/images/products/perfumes/p11.jpg"],
    tiers: [{ minQty: 1, price: 3000 }],
    moq: 1,
    variants: [{ label: "Size", options: ["50ml", "30ml"] }],
    variantPrices: { "50ml": 3000, "30ml": 1850 },
    rating: 4.7, reviewCount: 0, stock: 15, isNew: true, isBestseller: false,
    tags: ["perfume", "amber", "noir"],
  },
];

const realBedsheets: Product[] = [
  {
    id: "real-bedsheet-1", slug: "export-quality-cotton-bedsheet-set-1",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Floral Elegance",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b1.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.6, reviewCount: 0, stock: 50, isNew: true, isBestseller: true,
    tags: ["bedsheet", "cotton", "king size"],
  },
  {
    id: "real-bedsheet-2", slug: "export-quality-cotton-bedsheet-set-2",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Garden Paradise",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b2.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.5, reviewCount: 0, stock: 45, isNew: true, isBestseller: false,
    tags: ["bedsheet", "cotton", "king size"],
  },
  {
    id: "real-bedsheet-3", slug: "export-quality-cotton-bedsheet-set-3",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Royal Bloom",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b3.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.7, reviewCount: 0, stock: 40, isNew: true, isBestseller: false,
    tags: ["bedsheet", "cotton", "king size"],
  },
  {
    id: "real-bedsheet-4", slug: "export-quality-cotton-bedsheet-set-4",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Midnight Garden",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b4.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.4, reviewCount: 0, stock: 35, isNew: true, isBestseller: false,
    tags: ["bedsheet", "cotton", "king size"],
  },
  {
    id: "real-bedsheet-5", slug: "export-quality-cotton-bedsheet-set-5",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Sunset Bloom",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b5.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.6, reviewCount: 0, stock: 30, isNew: true, isBestseller: false,
    tags: ["bedsheet", "cotton", "king size"],
  },
  {
    id: "real-bedsheet-6", slug: "export-quality-cotton-bedsheet-set-6",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Classic Ivory",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b6.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.5, reviewCount: 0, stock: 50, isNew: true, isBestseller: true,
    tags: ["bedsheet", "cotton", "king size"],
  },
  {
    id: "real-bedsheet-7", slug: "export-quality-cotton-bedsheet-set-7",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Emerald Path",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b7.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.4, reviewCount: 0, stock: 25, isNew: true, isBestseller: false,
    tags: ["bedsheet", "cotton", "king size"],
  },
  {
    id: "real-bedsheet-8", slug: "export-quality-cotton-bedsheet-set-8",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Terracotta Dreams",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b8.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.3, reviewCount: 0, stock: 30, isNew: true, isBestseller: false,
    tags: ["bedsheet", "cotton", "king size"],
  },
  {
    id: "real-bedsheet-9", slug: "export-quality-cotton-bedsheet-set-9",
    name: "5 PC Export Quality Pure Cotton Bedsheet — Ocean Mist",
    category: "bedsheets", niche: "bedsheets",
    description: "⚜️ 5 PC Export Quality Pure Cotton Bedsheet\n\n✨ Double Bedsheet — King Size\n💯 100% Pure Cotton\n• 1 Flat Sheet — King Size (87×95 inches)\n• 4 Pillow Covers — Size 19×29 inches\n\nGuaranteed Colours\nReady To Use and easily washable",
    bullets: ["100% Pure Cotton fabric", "King Size flat sheet (87×95)", "4 Pillow Covers (19×29)", "Guaranteed colours — fade resistant", "Ready to use & easily washable", "Export quality finish"],
    images: ["/images/products/bedsheets/b9.jpg"],
    tiers: [{ minQty: 1, price: 1750 }, { minQty: 5, price: 1650 }, { minQty: 20, price: 1500 }],
    moq: 1,
    variants: [{ label: "Size", options: ["King Size"] }],
    rating: 4.6, reviewCount: 0, stock: 40, isNew: true, isBestseller: true,
    tags: ["bedsheet", "cotton", "king size"],
  },
];

export const products: Product[] = [...generatedProducts, ...realPerfumes, ...realBedsheets];

// Universal sort: in-stock products first, sold-out after
export function sortInStockFirst<T extends { stock: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.stock > 0 && b.stock === 0) return -1;
    if (a.stock === 0 && b.stock > 0) return 1;
    return 0;
  });
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return sortInStockFirst(products.filter((p) => p.category === categorySlug));
}

export function getRelatedProducts(product: Product, count = 4) {
  return sortInStockFirst(
    products.filter((p) => p.category === product.category && p.id !== product.id)
  ).slice(0, count);
}

export { categories };
